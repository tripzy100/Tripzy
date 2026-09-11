import { createServiceClient } from "@/lib/supabase";

const BUCKET_NAME = "kyc-documents";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export interface UploadKycFileOptions {
  userId: string;
  documentType: "DL_FRONT" | "DL_BACK" | "AADHAR_FRONT" | "AADHAR_BACK";
  fileBuffer: Buffer;
  mimeType: string;
  originalFileName: string;
}

export interface StorageResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Validates magic bytes header to prevent file extension / MIME spoofing.
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const header = buffer.toString("hex", 0, 4);

  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return header.startsWith("ffd8ff");
  }
  if (mimeType === "image/png") {
    return header === "89504e47";
  }
  if (mimeType === "image/webp") {
    return buffer.toString("utf8", 8, 12) === "WEBP";
  }
  if (mimeType === "application/pdf") {
    return buffer.toString("utf8", 0, 4) === "%PDF";
  }

  return false;
}

/**
 * Safely uploads a KYC document to private Supabase Storage under the user's isolated folder.
 */
export async function uploadKycDocument({
  userId,
  documentType,
  fileBuffer,
  mimeType,
  originalFileName,
}: UploadKycFileOptions): Promise<StorageResult> {
  // 1. File size check
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "File size exceeds 5MB limit" };
  }

  // 2. MIME type check
  const normalizedMime = mimeType.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
    return { success: false, error: "Unsupported file type. Only JPEG, PNG, WEBP, and PDF are allowed." };
  }

  // 3. Magic bytes validation (no extension spoofing)
  if (!validateMagicBytes(fileBuffer, normalizedMime)) {
    return { success: false, error: "File header does not match declared format." };
  }

  // 4. Sanitize path traversal & construct user-isolated path
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  const extension = MIME_TO_EXT[normalizedMime] || "bin";
  const fileName = `${documentType.toLowerCase()}_${Date.now()}.${extension}`;
  const storagePath = `${sanitizedUserId}/${fileName}`;

  try {
    const supabaseAdmin = createServiceClient();

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: normalizedMime,
        upsert: true,
      });

    if (error) {
      console.error("Storage upload failed (sanitized):", error.message);
      return { success: false, error: "Failed to upload document to secure storage" };
    }

    return { success: true, path: data.path };
  } catch (err: unknown) {
    console.error("Storage upload exception");
    return { success: false, error: "Internal error processing document upload" };
  }
}

/**
 * Generates a short-lived signed URL (15 mins) for viewing a private KYC document.
 * Requires ownership verification or admin privileges.
 */
export async function getSignedKycDocumentUrl({
  storagePath,
  requesterUserId,
  isAdmin,
}: {
  storagePath: string;
  requesterUserId: string;
  isAdmin: boolean;
}): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  // Ownership verification: path must start with "${requesterUserId}/" unless user is admin
  const pathOwnerId = storagePath.split("/")[0];

  if (!isAdmin && pathOwnerId !== requesterUserId) {
    return { success: false, error: "Unauthorized access to private document" };
  }

  try {
    const supabaseAdmin = createServiceClient();
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 900); // 15-minute expiration

    if (error || !data?.signedUrl) {
      return { success: false, error: "Could not generate document preview link" };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch {
    return { success: false, error: "Failed to retrieve signed URL" };
  }
}
