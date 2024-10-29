import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import validator from 'validator'




// create token

const createToken= (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
// login user

const loginUser = async (req,res) =>{

    const {email,password} = req.body;
   try {
    const user= await userModel.findOne({email})

     if(!user){
        res.json({success:false,message:"user does not exist"})
     }
     const isMatch= await bcryptjs.compare(password,user.password)

     if(!isMatch){
        return res.json({success:false,message:"Invalid Credentials"})
     }

     const token =createToken(user._id);
     res.json({success:true,token})

   } catch (error) {
    console.log(error);
    res.json({success:false,message:"error in login user"})
   }


}

 
// register user

const registerUser = async (req,res) =>{
const {name,password,email} = req.body;
try {
    // checking in db
    const exists = await userModel.findOne({email})
    if(exists){
        return res.json({success:false,message:"user already exist"})
    }

    // validating email format and strong password
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter valid email"})

    }

    if(password.length<8){
        return res.json({success:false,message:"Please enter a strong password"})

    }
    // hashing user password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password,salt)
   // new user
    const newUser = new userModel({
        name:name,
        email:email,
        password:hashedPassword,
    })

    // svae the user
         const user=await newUser.save()
        const token = createToken(user._id)
       res.json({success:true,token});

} catch (error) {
    res.json({success:false,message:"Error in register user"})
}
}

//export

export {loginUser,registerUser}


