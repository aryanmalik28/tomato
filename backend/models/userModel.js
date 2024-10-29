import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },

   email:{
    type:String,
    required:true,
    unique:true,
   },
   password:{
    type:String,
    required:true,
   },
   cartData:{
   //  type:Object,
   //  default:{},
   type: Map,
   of: Number,  // Assuming the value is a number representing quantity
   default: {}
   },


},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);


export default userModel;