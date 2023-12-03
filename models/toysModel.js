const mongoose = require("mongoose");
const joi = require("joi");

let toySchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    date_created:{ type: Date, default: Date.now()},
    user_id:String
})

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validToy = (_reqBody) => {
    let joiSchema = joi.object({
        name: joi.string().min(2).max(99).required(),
        info: joi.string().min(2).max(1000).required(),
        category: joi.string().min(2).max(99).required(),
        img_url: joi.string().min(2).max(200),
        price: joi.number().min(1).required()
    })
    return joiSchema.validate(_reqBody);
}