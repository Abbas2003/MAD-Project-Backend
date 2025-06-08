import Joi from 'joi';


const userProfileSchema = Joi.object({
    // User profile details
    nick_name: Joi.string().max(50),
    tag_line: Joi.string().max(50).optional(),
    description: Joi.string().max(75).optional(),
    member_of_mnef: Joi.boolean().default(false),
    address: Joi.string().max(255).optional(),
    service_address: Joi.string().max(255).optional(),
    company_registration_num: Joi.string().max(255).optional(),

    // Integer fields
    zip_code: Joi.number().integer().min(0).allow(null),
    experience: Joi.number().integer().min(0).allow(null),
    profile_visits: Joi.number().integer().min(0),

    // File/path fields
    profile_image: Joi.string().max(255).optional(),
});


export default userProfileSchema;