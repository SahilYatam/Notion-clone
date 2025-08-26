import Joi from "joi"

const createWorkspaceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
  userBody: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional().allow(null, ""),
  }).required(),
});

const updateWorkspaceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
  data: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional().allow(null, ""),
  }).min(1).required(),
});

const deleteWorkspaceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
});


const inviteUserToWorkspaceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("OWNER", "ADMIN", "MEMBER", "VIEWER").required(),
});

const removeUserFromWorkspaceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
  rmUserId: Joi.string().uuid().required(),
});


const updateUserRoleSchema = Joi.object({
  ownerAuthId: Joi.string().uuid().required(),
  targetUserId: Joi.string().uuid().required(),
  role: Joi.string().valid("OWNER", "ADMIN", "MEMBER", "VIEWER").required(),
});

const getUserRoleSchema = Joi.object({
  ownerAuthId: Joi.string().uuid().required(),
  targetUserId: Joi.string().uuid().required(),
});

export const workspaceValidation = {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    deleteWorkspaceSchema,
    inviteUserToWorkspaceSchema,
    removeUserFromWorkspaceSchema,
    updateWorkspaceSchema,
    updateUserRoleSchema,
    getUserRoleSchema
}

