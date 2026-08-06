import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/helpers.js";

async function uniqueSlugForOwner(ownerId, name) {
  const base = slugify(name) || "project";
  let slug = base;
  let i = 1;
  while (await Project.exists({ owner: ownerId, slug })) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export async function createProject(ownerId, input) {
  const slug = await uniqueSlugForOwner(ownerId, input.name);
  const project = await Project.create({
    owner: ownerId,
    name: input.name.trim(),
    description: input.description || "",
    platform: input.platform || "Web",
    slug,
  });
  return project.toSafeObject();
}

export async function listProjects(ownerId) {
  const projects = await Project.find({ owner: ownerId }).sort({ createdAt: -1 });
  return projects.map((p) => p.toSafeObject());
}

export async function getProjectForOwner(projectId, ownerId) {
  let project = null;
  if (mongoose.isValidObjectId(projectId)) {
    project = await Project.findOne({ _id: projectId, owner: ownerId });
  }
  if (!project) {
    project = await Project.findOne({ slug: projectId, owner: ownerId });
  }
  if (!project) {
    throw new AppError("Project not found", 404);
  }
  return project;
}

export async function updateProject(projectId, ownerId, input) {
  const project = await getProjectForOwner(projectId, ownerId);
  if (input.name !== undefined) project.name = input.name;
  if (input.description !== undefined) project.description = input.description;
  if (input.platform !== undefined) project.platform = input.platform;
  if (input.status !== undefined) project.status = input.status;
  await project.save();
  return project.toSafeObject();
}

export async function deleteProject(projectId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  await project.deleteOne();
  return { deleted: true };
}
