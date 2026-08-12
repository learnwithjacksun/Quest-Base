import mongoose from "mongoose";

const otpChallengeSchema = new mongoose.Schema(
  {
    otpConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtpConfig",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["email", "sms"],
      required: true,
    },
    destination: {
      type: String,
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    invalidatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

otpChallengeSchema.index({ otpConfig: 1, destination: 1, createdAt: -1 });
otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export const OtpChallenge = mongoose.model("OtpChallenge", otpChallengeSchema);
