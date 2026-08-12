import mongoose from "mongoose";

const DEFAULT_EMAIL_SUBJECT = "Your verification code";
const DEFAULT_EMAIL_TEMPLATE =
  "Your verification code is {{code}}. It expires in {{minutes}} minutes.";
const DEFAULT_SMS_TEMPLATE =
  "Your verification code is {{code}}. It expires in {{minutes}} minutes.";

const otpConfigSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    smsEnabled: {
      type: Boolean,
      default: false,
    },
    codeLength: {
      type: Number,
      default: 6,
      min: 4,
      max: 8,
    },
    expirySeconds: {
      type: Number,
      default: 300,
      min: 60,
      max: 3600,
    },
    maxAttempts: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },
    emailSubject: {
      type: String,
      default: DEFAULT_EMAIL_SUBJECT,
      trim: true,
      maxlength: 120,
    },
    emailTemplate: {
      type: String,
      default: DEFAULT_EMAIL_TEMPLATE,
      trim: true,
      maxlength: 2000,
    },
    smsSender: {
      type: String,
      default: "",
      trim: true,
      maxlength: 15,
    },
    smsTemplate: {
      type: String,
      default: DEFAULT_SMS_TEMPLATE,
      trim: true,
      maxlength: 320,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

otpConfigSchema.methods.toSafeObject = function toSafeObject(extra = {}) {
  return {
    id: this.publicId,
    _id: this._id.toString(),
    projectId: this.project.toString(),
    name: this.name,
    allowedOrigins: this.allowedOrigins,
    emailEnabled: this.emailEnabled,
    smsEnabled: this.smsEnabled,
    codeLength: this.codeLength,
    expirySeconds: this.expirySeconds,
    maxAttempts: this.maxAttempts,
    emailSubject: this.emailSubject,
    emailTemplate: this.emailTemplate,
    smsSender: this.smsSender || "",
    smsTemplate: this.smsTemplate,
    isActive: this.isActive,
    createdAt: this.createdAt?.toISOString?.() ?? this.createdAt,
    updatedAt: this.updatedAt?.toISOString?.() ?? this.updatedAt,
    ...extra,
  };
};

export const OtpConfig = mongoose.model("OtpConfig", otpConfigSchema);
export const OTP_DEFAULTS = {
  emailSubject: DEFAULT_EMAIL_SUBJECT,
  emailTemplate: DEFAULT_EMAIL_TEMPLATE,
  smsTemplate: DEFAULT_SMS_TEMPLATE,
};
