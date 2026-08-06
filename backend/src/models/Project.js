import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    platform: {
      type: String,
      enum: ["Web", "Mobile"],
      default: "Web",
    },
    status: {
      type: String,
      enum: ["Active", "Paused"],
      default: "Active",
    },
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1, slug: 1 }, { unique: true });

projectSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    slug: this.slug,
    description: this.description || undefined,
    platform: this.platform,
    status: this.status,
    apps: 1,
    createdAt: this.createdAt?.toISOString?.() ?? this.createdAt,
    updatedAt: this.updatedAt?.toISOString?.() ?? this.updatedAt,
  };
};

export const Project = mongoose.model("Project", projectSchema);
