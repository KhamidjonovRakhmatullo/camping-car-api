const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//scheme of data
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please enter vaild Email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

//password hash
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next()
  };
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

//if password is correct then let to login
userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

//token
userSchema.methods.generatedJwtToken = function(){
  return jwt.sign(
  { id: this._id },
  process.env.JWT_TOKEN_SECRET,
  { expiresIn: `24h` } 
  )
}

module.exports = mongoose.model("User", userSchema);
