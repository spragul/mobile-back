const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }
    },

    password: {
        type: String,
        require: true
    },
    mobile: {
        type: Number,
        require: true
    }
}
)

let userModel = mongoose.model('users', userSchema);
module.exports = { userModel };