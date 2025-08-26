import Joi from "joi"

export const updateUserPreferenceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
  prefs: Joi.object({
    theme: Joi.string().valid("LIGHT", "DARK").optional(),
    emailNotifications: Joi.boolean().optional(),
  }).min(1).required()
});

export const getUserPreferenceSchema = Joi.object({
  authId: Joi.string().uuid().required(),
});