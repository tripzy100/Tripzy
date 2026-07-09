import Link from "next/link";

export default function SeoContent() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 lg:py-16" aria-label="About Tripzy Self Drive Car Rental">
      <div className="relative rounded-2xl border border-border bg-card/30 p-8 shadow-sm backdrop-blur-sm sm:p-12">
        {/* Subtle decorative grid pattern or dot accent */}
        <div className="absolute right-6 top-6 text-xs font-semibold uppercase tracking-wider text-primary/30">
          Tripzy Ranchi
        </div>

        {/* Section Header */}
        <h2 className="text-gradient font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Tripzy — Your Trusted Self Drive Car Rental Company in Ranchi
        </h2>

        {/* Introduction */}
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            Welcome to <strong className="text-foreground">Tripzy</strong>, Ranchi&apos;s most trusted{" "}
            <strong className="text-foreground">self drive car rental company</strong>. Whether you are looking
            for a <Link href="/cars" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary">car rental near you</Link> for a
            weekend getaway to Netarhat, a business trip across Jharkhand, or simply need a reliable{" "}
            <strong className="text-foreground">car service</strong> for daily commuting, Tripzy Tours and Travels
            has you covered. We are a homegrown <strong className="text-foreground">car rental</strong> brand built
            specifically for the people of Ranchi, by the people of Ranchi.
          </p>

          <p>
            At <strong className="text-foreground">Tripzy</strong>, we believe that renting a car should be as simple
            as booking a cab. That is why we have built a fully digital platform where you can browse our verified
            cars, complete your KYC paperlessly, and drive away — all within minutes. Our{" "}
            <strong className="text-foreground">self drive car rental</strong> service eliminates the need for a
            chauffeur, giving you complete freedom to explore at your own pace. From the bustling streets of Ranchi
            to the serene waterfalls of Hundru and the hilltop views of Patratu Valley, every journey becomes an
            adventure when you are behind the wheel of a Tripzy car.
          </p>
        </div>

        {/* Detailed sections */}
        <div className="mt-10 grid gap-8 border-t border-border/50 pt-10 md:grid-cols-2">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              Wide Range of Cars Available for Rent in Ranchi
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Our cars include popular models like the Maruti Suzuki Swift, Hyundai i20, Hyundai Verna, Mahindra
              Thar, Mahindra Scorpio N, Tata Safari, and many more. Whether you need a compact hatchback for city
              driving, a comfortable sedan for highway cruising, or a rugged SUV for an off-road adventure — we have
              the perfect <strong className="text-foreground">car rental Ranchi</strong> option for you. Every vehicle
              in our cars undergoes a thorough multi-point inspection, sanitization, and maintenance check before
              each rental, ensuring you always receive a car that looks and performs like new.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              Why Customers Choose Tripzy Car Rental
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              What sets <strong className="text-foreground">Tripzy car rental</strong> apart from other{" "}
              <strong className="text-foreground">car rental</strong> services in Ranchi is our unwavering commitment
              to transparency, safety, and customer satisfaction. We offer{" "}
              <strong className="text-foreground">transparent pricing</strong> with zero hidden charges — what you see
              at checkout is exactly what you pay. Every rental includes comprehensive insurance coverage, so you can
              drive with complete peace of mind. Our 24/7 roadside assistance team is always just a phone call away,
              ensuring help is available whenever and wherever you need it.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              Convenient Pickup and Drop Locations Across Ranchi
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              <strong className="text-foreground">Tripzy Ranchi</strong> offers convenient pickup and drop-off points
              across the city, including Birsa Munda Airport (IXR), making us the ideal choice for travelers arriving
              by air. Whether you are a local resident or a visitor exploring Jharkhand, our strategically located
              hubs ensure that a quality self drive car is never far from your reach. We also offer doorstep delivery
              for added convenience — your chosen car can be delivered right to your home, hotel, or office.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              Hassle-Free Booking and Verification Process
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              The <strong className="text-foreground">Tripzy self drive car rental</strong> experience is designed to
              be hassle-free from start to finish. Our paperless KYC process lets you verify your identity and
              driving licence digitally — no photocopies, no waiting. We accept all major payment methods including UPI,
              credit cards, and debit cards, making the booking process smooth and convenient. For those who need a car
              for longer periods, we offer flexible weekly and monthly subscription plans that provide significant
              savings compared to daily rates.
            </p>
          </div>
        </div>

        {/* Conclusion/CTA banner */}
        <div className="mt-10 border-t border-border/50 pt-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            As a proud part of the <strong className="text-foreground">Tripzy Tours and Travels</strong> family, we
            are committed to making mobility accessible, affordable, and enjoyable for everyone in Ranchi and beyond.
            Join the growing community of over 500 satisfied customers who trust Tripzy for their{" "}
            <strong className="text-foreground">self drive car rental</strong> needs.{" "}
            <Link href="/auth/register" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary">
              Book your car today
            </Link>{" "}
            and experience the freedom of driving on your own terms with{" "}
            <strong className="text-foreground">Tripzy</strong> — Ranchi&apos;s favourite{" "}
            <strong className="text-foreground">self drive car rental company</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
