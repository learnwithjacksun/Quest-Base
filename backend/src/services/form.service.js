import mongoose from "mongoose";
import { Form } from "../models/Form.js";
import { AppError } from "../utils/AppError.js";
import { generatePublicId } from "../utils/crypto.js";
import { getProjectForOwner } from "./project.service.js";

async function uniquePublicId() {
  let id = generatePublicId(8);
  while (await Form.exists({ publicId: id })) {
    id = generatePublicId(8);
  }
  return id;
}

export async function createForm(projectId, ownerId, input) {
  const project = await getProjectForOwner(projectId, ownerId);
  const publicId = await uniquePublicId();
  const form = await Form.create({
    project: project._id,
    owner: ownerId,
    publicId,
    name: input.name.trim(),
    emails: input.emails.map((e) => e.trim().toLowerCase()),
    allowedOrigins: [],
  });
  return form.toSafeObject();
}

export async function listForms(projectId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  const forms = await Form.find({ project: project._id, owner: ownerId }).sort({
    createdAt: -1,
  });
  return forms.map((f) => f.toSafeObject());
}

export async function getFormForOwner(formId, ownerId) {
  let form = await Form.findOne({ publicId: formId, owner: ownerId });
  if (!form && mongoose.isValidObjectId(formId)) {
    form = await Form.findOne({ _id: formId, owner: ownerId });
  }
  if (!form) {
    throw new AppError("Form not found", 404);
  }
  return form;
}

export async function updateForm(formId, ownerId, input) {
  const form = await getFormForOwner(formId, ownerId);
  if (input.name !== undefined) form.name = input.name;
  if (input.emails !== undefined) {
    form.emails = input.emails.map((e) => e.trim().toLowerCase());
  }
  if (input.allowedOrigins !== undefined) {
    form.allowedOrigins = input.allowedOrigins.map((o) => o.trim());
  }
  if (input.isActive !== undefined) form.isActive = input.isActive;
  await form.save();
  return form.toSafeObject();
}

export async function deleteForm(formId, ownerId) {
  const form = await getFormForOwner(formId, ownerId);
  await form.deleteOne();
  return { deleted: true };
}

export async function getPublicForm(publicId) {
  const form = await Form.findOne({ publicId }).populate("project");
  if (!form || !form.isActive) {
    throw new AppError("Form not found", 404);
  }
  if (form.project?.status === "Paused") {
    throw new AppError("This form is currently unavailable", 403);
  }
  return form;
}
