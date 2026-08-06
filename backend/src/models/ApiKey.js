import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    keyPrefix: {
      type: String,
      required: true,
    },
    keyHash: {
      type: String,
      required: true,
      unique: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

apiKeySchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    projectId: this.project.toString(),
    name: this.name,
    keyPrefix: this.keyPrefix,
    lastUsedAt: this.lastUsedAt,
    revokedAt: this.revokedAt,
    createdAt: this.createdAt,
  };
};

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
