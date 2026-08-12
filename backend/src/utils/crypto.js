import crypto from "crypto";

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateOtpCode(length = 6) {
  const digits = Math.min(8, Math.max(4, Number(length) || 6));
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;
  return String(Math.floor(min + Math.random() * (max - min)));
}

export function timingSafeEqualHash(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

export function generatePublicId(length = 8) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function generateApiKey() {
  const raw = `qb_${crypto.randomBytes(24).toString("hex")}`;
  return {
    key: raw,
    prefix: raw.slice(0, 10),
    hash: hashToken(raw),
  };
}
