import { ApiKey } from "../models/ApiKey.js";
import { AppError } from "../utils/AppError.js";
import { generateApiKey } from "../utils/crypto.js";
import { getProjectForOwner } from "./project.service.js";

export async function createApiKey(projectId, ownerId, input) {
  const project = await getProjectForOwner(projectId, ownerId);
  const generated = generateApiKey();
  const apiKey = await ApiKey.create({
    project: project._id,
    owner: ownerId,
    name: input.name || "Default key",
    keyPrefix: generated.prefix,
    keyHash: generated.hash,
  });

  return {
    ...apiKey.toSafeObject(),
    key: generated.key,
  };
}

export async function listApiKeys(projectId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  const keys = await ApiKey.find({
    project: project._id,
    owner: ownerId,
    revokedAt: null,
  }).sort({ createdAt: -1 });
  return keys.map((k) => k.toSafeObject());
}

export async function revokeApiKey(projectId, keyId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  const key = await ApiKey.findOne({
    _id: keyId,
    project: project._id,
    owner: ownerId,
    revokedAt: null,
  });
  if (!key) {
    throw new AppError("API key not found", 404);
  }
  key.revokedAt = new Date();
  await key.save();
  return key.toSafeObject();
}
