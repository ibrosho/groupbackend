import Joi from "joi"

export const validateRegister = Joi.object({
    username: Joi.string().required().min(3).max(100),
    password: Joi.string().required().min(8).max(20),
    email: Joi.string().required()
})

export const validateLogin = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8).max(20)
})

export const validateForgotPassword = Joi.object({
   email: Joi.string().required(),
});

export const validateResetPassword = Joi.object({
   password: Joi.string().required().min(8).max(20),
});

export const validateCourse = Joi.object({
   title: Joi.string().min(3).max(100).required(),
   description: Joi.string().min(10).required(),
   instructor: Joi.string().required(),
   duration: Joi.string().required(),
});
