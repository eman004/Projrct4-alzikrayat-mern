const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  location: Joi.string().max(100).allow('', null),
  description: Joi.string().max(500).allow('', null),
  occupation: Joi.string().max(100).allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(1000).allow('', null),
  userId: Joi.string().hex().length(24).required(),
});

const commentSchema = Joi.object({
  comment: Joi.string().min(1).max(500).required(),
  userId: Joi.string().hex().length(24).required(),
});

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegister: validateBody(registerSchema),
  validateLogin: validateBody(loginSchema),
  validatePhoto: validateBody(photoSchema),
  validateComment: validateBody(commentSchema),
};
