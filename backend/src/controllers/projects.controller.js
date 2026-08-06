import * as projectService from "../services/project.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.userId, req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: "Project created",
    data: { project },
  });
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects(req.userId);
  return ApiResponse.success(res, { data: { projects } });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectForOwner(
    req.params.projectId,
    req.userId,
  );
  return ApiResponse.success(res, { data: { project: project.toSafeObject() } });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.projectId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    message: "Project updated",
    data: { project },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.projectId, req.userId);
  return ApiResponse.success(res, { message: "Project deleted" });
});
