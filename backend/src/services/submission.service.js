import { Submission } from "../models/Submission.js";
import { AppError } from "../utils/AppError.js";
import { getProjectForOwner } from "./project.service.js";
import { getFormForOwner } from "./form.service.js";

export async function listProjectSubmissions(projectId, ownerId, { page = 1, limit = 20 } = {}) {
  const project = await getProjectForOwner(projectId, ownerId);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Submission.find({ project: project._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("form", "publicId name"),
    Submission.countDocuments({ project: project._id }),
  ]);

  return {
    items: items.map((s) => ({
      ...s.toSafeObject(),
      formPublicId: s.form?.publicId,
      formName: s.form?.name,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function listFormSubmissions(formId, ownerId, { page = 1, limit = 20 } = {}) {
  const form = await getFormForOwner(formId, ownerId);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Submission.find({ form: form._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Submission.countDocuments({ form: form._id }),
  ]);

  return {
    items: items.map((s) => s.toSafeObject()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getSubmission(submissionId, ownerId) {
  const submission = await Submission.findById(submissionId).populate("form", "publicId name owner");
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }
  // owner check via form.owner or project ownership
  const formOwner = submission.form?.owner?.toString?.();
  if (formOwner && formOwner !== ownerId.toString()) {
    throw new AppError("Submission not found", 404);
  }
  return {
    ...submission.toSafeObject(),
    formPublicId: submission.form?.publicId,
    formName: submission.form?.name,
  };
}
