import Joi from "joi"

const createUserProfileSchema = Joi.object({
  avatarUrl: Joi.string().uri().optional().allow(null, ""),
  role: Joi.string().valid("USER", "ADMIN").default("USER"),
});

const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  avatarUrl: Joi.string().uri().optional().allow(null, ""),
  role: Joi.string().valid("USER", "ADMIN").optional(),
}).min(1);

const getUserProfileSchema = Joi.object({
  authId: Joi.string().uuid().required(),
});

const getUserByIdSchema = Joi.object({
  authId: Joi.string().uuid().required(),
});

const deleteUserProfileSchema = Joi.object({
  authId: Joi.string().uuid().required(),
});

export const userValidation = {
    createUserProfileSchema,
    updateUserProfileSchema,
    getUserProfileSchema,
    getUserByIdSchema,
    deleteUserProfileSchema
}
