const Joi = require("joi");

// Validation schemas
const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be less than 30 characters",
      "any.required": "Username is required",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is required",
    }),

  name: Joi.string().max(100).optional().messages({
    "string.max": "Name must be less than 100 characters",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().max(100).optional().messages({
    "string.max": "Name must be less than 100 characters",
  }),

  profilePictureUrl: Joi.string().uri().optional().messages({
    "string.uri": "Profile picture URL must be a valid URL",
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "New password is required",
    }),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: validationErrors.join(", "),
        details: error.details,
      });
    }

    next();
  };
};

// Export validation middleware
module.exports = {
  validateSignup: validate(signupSchema),
  validateSignin: validate(signinSchema),
  validateUpdateProfile: validate(updateProfileSchema),
  validateChangePassword: validate(changePasswordSchema),
  validate,
};
