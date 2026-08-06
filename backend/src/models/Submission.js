import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    resourceType: {
      type: String,
      enum: ["image", "raw", "auto"],
      default: "auto",
    },
    publicId: String,
    format: String,
  },
  { _id: false },
);

const submissionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    fields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    files: {
      type: [fileSchema],
      default: [],
    },
    meta: {
      ip: String,
      userAgent: String,
      origin: String,
    },
    status: {
      type: String,
      enum: ["delivered", "failed", "spam", "pending"],
      default: "pending",
    },
    spamScore: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

submissionSchema.methods.toSafeObject = function toSafeObject() {
  const formId =
    this.form?._id?.toString?.() ||
    this.form?.toString?.() ||
    this.form;
  const projectId =
    this.project?._id?.toString?.() ||
    this.project?.toString?.() ||
    this.project;

  return {
    id: this._id.toString(),
    formId,
    projectId,
    fields: this.fields,
    files: this.files,
    meta: this.meta,
    status: this.status,
    spamScore: this.spamScore,
    createdAt: this.createdAt?.toISOString?.() ?? this.createdAt,
  };
};

export const Submission = mongoose.model("Submission", submissionSchema);
