import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
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
    emails: {
      type: [String],
      validate: {
        validator(v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 10;
        },
        message: "Provide between 1 and 10 recipient emails",
      },
      required: true,
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

formSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this.publicId,
    _id: this._id.toString(),
    projectId: this.project.toString(),
    name: this.name,
    emails: this.emails,
    allowedOrigins: this.allowedOrigins,
    isActive: this.isActive,
    createdAt: this.createdAt?.toISOString?.() ?? this.createdAt,
    updatedAt: this.updatedAt?.toISOString?.() ?? this.updatedAt,
  };
};

export const Form = mongoose.model("Form", formSchema);
