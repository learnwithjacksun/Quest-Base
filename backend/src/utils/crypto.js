import crypto from "crypto";

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
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
