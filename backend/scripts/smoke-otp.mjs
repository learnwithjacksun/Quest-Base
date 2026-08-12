/**
 * Smoke test for product OTP (email + SMS skip path).
 * Run from backend/: node scripts/smoke-otp.mjs
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.NODE_ENV = "development";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/unused";
process.env.JWT_ACCESS_SECRET = "dev-access-secret-change-me-32chars";
process.env.JWT_REFRESH_SECRET = "dev-refresh-secret-change-me-32chars";
delete process.env.BREVO_API_KEY;

const { User } = await import("../src/models/User.js");
const { OtpConfig } = await import("../src/models/OtpConfig.js");
const { OtpChallenge } = await import("../src/models/OtpChallenge.js");
const { createProject } = await import("../src/services/project.service.js");
const {
  createOtpConfig,
  updateOtpConfig,
} = await import("../src/services/otpConfig.service.js");
const {
  sendPublicOtp,
  verifyPublicOtp,
} = await import("../src/services/publicOtp.service.js");
const { hashToken } = await import("../src/utils/crypto.js");

function browserReq(body, origin = "http://localhost:5173") {
  return {
    body,
    headers: { origin, "user-agent": "smoke-test" },
    apiKey: null,
    apiKeyProjectId: null,
    ip: "127.0.0.1",
  };
}

function serverReq(body, projectId) {
  return {
    body,
    headers: {},
    apiKey: { id: "smoke" },
    apiKeyProjectId: projectId,
    ip: "127.0.0.1",
  };
}

async function setKnownCode(otpId, destination, code) {
  const config = await OtpConfig.findOne({ publicId: otpId });
  const challenge = await OtpChallenge.findOne({
    otpConfig: config._id,
    destination,
    verifiedAt: null,
    invalidatedAt: null,
  }).sort({ createdAt: -1 });
  if (!challenge) throw new Error(`No challenge for ${destination}`);
  challenge.codeHash = hashToken(`${otpId}:${destination}:${code}`);
  await challenge.save();
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const user = await User.create({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    password: "password123",
    isEmailVerified: true,
  });

  const project = await createProject(user._id, {
    name: "Smoke App",
    platform: "Web",
  });

  let otp = await createOtpConfig(project.id, user._id, {
    name: "Login OTP",
    emailEnabled: true,
    smsEnabled: true,
  });

  otp = await updateOtpConfig(otp.id, user._id, {
    smsSender: "QuestBase",
    allowedOrigins: ["http://localhost:5173"],
  });

  const emailTo = "user@example.com";
  await sendPublicOtp(
    otp.id,
    browserReq({ channel: "email", to: emailTo }),
  );
  await setKnownCode(otp.id, emailTo, "111222");
  const emailVerify = await verifyPublicOtp(
    otp.id,
    browserReq({ to: emailTo, code: "111222" }),
  );
  if (!emailVerify.verified) throw new Error("email verify failed");
  console.log("✓ email send + verify");

  const smsTo = "+15551234567";
  await sendPublicOtp(otp.id, browserReq({ channel: "sms", to: smsTo }));
  await setKnownCode(otp.id, smsTo, "333444");
  const smsVerify = await verifyPublicOtp(
    otp.id,
    browserReq({ to: smsTo, code: "333444" }),
  );
  if (!smsVerify.verified) throw new Error("sms verify failed");
  console.log("✓ sms send + verify (Brevo skipped in dev)");

  let denied = false;
  try {
    await sendPublicOtp(
      otp.id,
      browserReq(
        { channel: "email", to: "other@example.com" },
        "https://evil.example",
      ),
    );
  } catch (err) {
    denied = err.code === "ORIGIN_DENIED" || err.statusCode === 403;
  }
  if (!denied) throw new Error("expected origin denial");
  console.log("✓ origin deny");

  let keyRequired = false;
  try {
    await sendPublicOtp(otp.id, {
      body: { channel: "email", to: "server@example.com" },
      headers: {},
      apiKey: null,
      apiKeyProjectId: null,
      ip: "127.0.0.1",
    });
  } catch (err) {
    keyRequired = err.code === "API_KEY_REQUIRED";
  }
  if (!keyRequired) throw new Error("expected API_KEY_REQUIRED");
  console.log("✓ api key required for server calls");

  await sendPublicOtp(
    otp.id,
    serverReq({ channel: "email", to: "server@example.com" }, project.id),
  );
  console.log("✓ api key allows server send");

  await mongoose.disconnect();
  await mongod.stop();
  console.log("\nAll OTP smoke checks passed.");
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
