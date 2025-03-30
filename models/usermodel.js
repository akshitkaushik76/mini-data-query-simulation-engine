const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const users = new mongoose.Schema({
    Username:{
        type:String,
        required:[true,'please enter the usename']
    },
    email:{
        type:String,
        lowercase:true,
        required:[true,'please enter the email'],
        validate:[validator.isEmail,'please enter valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please enter the password'],
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:[true,'please re-enter the confirm password'],
        validate:{
           validator:function(value) {
              return value === this.password;
           },
           message:'password and confirm password does not match',
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    PasswordResetTokenExpire:Date

});
users.pre('save',async function(next) { 
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
})
users.methods.comparepswdinDB = async function(pswd,pswdDB) {
    return await bcrypt.compare(pswd,pswdDB);
}
users.methods.ispasswordChanged = async function(jwtTimestamp) {
    if(this.passwordChangedAt) {
       console.log('this password changed at',jwtTimestamp);
       const pswdchangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
       return jwtTimestamp<pswdchangedTimestamp;
    }
    return false;
}
users.methods.createresetpasswordtoken = async function() {//to be implemented because of the time constraint
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.PasswordResetTokenExpire = Date.now()+10*60*1000;
    return resetToken;
}
const UserSchema = mongoose.model('users',users);
module.exports = UserSchema;