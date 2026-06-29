# Tripzy Query Optimization & Indexing Strategy

This document details the database indexing decisions, query search optimizations, and partition models implemented to support millions of platform bookings.

---

## ⚡ Index Strategy & Design

To speed up query processing, we declare explicit database indexes (`@@index` and `@unique`) inside `prisma/schema.prisma` on fields with high query frequencies.

### 1. Identity & Lookup Indexes
- **`User.email` & `User.phone`**: Configured with unique constraint B-Tree indexes to optimize authentication lookups and session verification checks.
- **`DrivingLicence.licenceNumber` & `IdentityDocument.documentNumber`**: Indexed to enforce KYC verification checks.
- **`RiskProfile.userId`**: One-to-one fast lookup to check user status constraints.

### 2. Booking & IoT Search Indexes
- **`Booking.status`**: High-cardinality enum B-Tree index to optimize dashboard status counters.
- **`Booking.pickupDate` & `Booking.returnDate`**: Optimizes range queries for active fleet usage statistics.
- **`GpsTrackerRecord.[vehicleId, capturedAt]`**: Composite index to optimize tracker history retrieval paths.
- **`VehicleTelematics.[vehicleId, capturedAt]`**: Composite index to optimize diagnostics retrieval logs.

### 3. Fleet Allocation & Pricing Indexes
- **`Vehicle.status`**: Speeds up filtering available cars for rental lists.
- **`Vehicle.locationId`**: Speeds up location-based search filtering.
- **`VehicleAvailabilityCalendar.[vehicleId, date]`**: Composite unique index (`@@unique([vehicleId, date])`) to check booking availability.
- **`SurgePricingLog.cityId`**: Fast lookups for active dynamic pricing surge multipliers in specific zones.

---

## 📈 Query Performance Optimization

### 1. Fast Availability Calendar Scans
To check if a car is available for a date range (e.g., July 1st to July 5th), the system executes a range lookup on `VehicleAvailabilityCalendar`:
```sql
SELECT "isAvailable" 
FROM "VehicleAvailabilityCalendar" 
WHERE "vehicleId" = $1 AND "date" >= $2 AND "date" <= $3;
```
Without indexes, this causes full table scans. With our composite unique index on `[vehicleId, date]`, PostgreSQL performs a high-speed index sweep, resolving availability checks in sub-millisecond ranges.

### 2. Fast Session Revocation checking
For compromised credentials, the middleware checks session active status:
- We match incoming session tokens against the `RevokedSession` unique constraint table.
- To reduce database pressure, revoked session tokens are pushed to Upstash Redis as a key-value store with an TTL matching session expiration time, shifting checks to sub-millisecond Redis read paths.

---

## 🗄️ Cache & Table Partitioning Plans

### 1. Upstash Redis Caching Layer
To bypass database lookups entirely for frequent, non-changing data, we cache standard lookups in Upstash Redis (TTL: 24 hours):
- Vehicle Categories (SUV, Sedan, Electric).
- Country / State / City lists.
- Public FAQs and blogs.

### 2. Log & IoT Partitioning (High-Scale Growth)
Tables like `GpsTrackerRecord`, `VehicleTelematics`, `AuditLog`, and `LoginHistory` accumulate millions of rows very quickly. To maintain peak performance:
- We recommend **PostgreSQL Table Partitioning by Range (Time)** (e.g., monthly partitions) for `GpsTrackerRecord` and `VehicleTelematics`.
- This isolates query range sweeps to specific monthly partitions, keeping index depths minimal and query times flat.
