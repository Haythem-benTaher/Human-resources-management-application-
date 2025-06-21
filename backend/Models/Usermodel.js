const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: String},
    email: { type: String },
    phone: { type: String },
    competance : {type : String},
    birthdate: { type: String},
    description: { type: String },
    address : {type: String },
    image : {type : String},
    role : {type : String,default:'candidat'}
},{timestamps: true});

const UserData = mongoose.model('User' , UserSchema)
module.exports = UserData