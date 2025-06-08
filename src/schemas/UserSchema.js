import Joi from 'joi';

export const userValidationSchema = Joi.object({
    f_name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.max': 'First name must be at most 50 characters',
        }),

    l_name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.max': 'Last name must be at most 50 characters',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(75)
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
        }),

    user_type: Joi.string()
        .valid('client', 'agent', 'admin', 'agency')
        .required()
        .messages({
            'any.only': 'User type must be one of client, agent, admin, or agency',
            'string.empty': 'User type is required',
        }),

    password: Joi.string()
        .min(6)
        .max(75)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password must be at most 75 characters',
        }),
});


export const loginSchema = Joi.object({
    email: Joi.string()
      .email() // { tlds: { allow: false } } // Uncomment if you want to restrict TLDs
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
    }),
  
    password: Joi.string()
      .min(6)
      .max(75)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    })
});