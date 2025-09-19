const Joi = require('joi');

module.exports.ListingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0),
        image: Joi.string().allow("",null),
    }).required(),
});

module.exports.ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.string().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});