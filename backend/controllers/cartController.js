import userModel from "../models/userModel.js"


// add  item to cart

// const addToCart = async (req,res)=>{
// try {
//     let userData = await userModel.findById({req.body.userId})
//     let cartData = await userData.cartData;
//     if(!cartData[req.body.itemId]){
//         cartData[req.body.itemId] =1
//     }
//     else{
//         cartData[req.body.itemId] +=1;
//     }
//     await userModel.findByIdAndUpdate(req.body.itemId,{cartData})
//     res.json({success:true,message:"Added To Cart"});
// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error in Adding to cart"})
// }
// }
const addToCart = async (req, res) => {
    try {
      const { userId, itemId } = req.body;
  
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Initialize cartData if it doesn't exist
      if (!user.cartData) {
        user.cartData = new Map();
      }
  
      // Update the cartData
      if (!user.cartData.has(itemId)) {
        user.cartData.set(itemId, 1); // Add item with quantity 1
      } else {
        user.cartData.set(itemId, user.cartData.get(itemId) + 1); // Increment quantity
      }
  
      // Save the updated user document
      await user.save();
  
      res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Error in adding to cart" });
    }
  };
  


// remove items from user cart

// const removeFromCart = async (req,res) =>{
// try {
//     let userData = await userModel.findById(req.body.userId)
//     let cartData = await userData.cartData;
//     if(cartData[req.body.itemId]>0){
//          cartData[req.body.itemId] -=1;

//     }
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//     res.json({success:true,message:"Removed from cart"})
// } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error in removing from cart"})
// }
// }


// fetch user cart data

const removeFromCart = async (req, res) => {
    try {
      // Log the entire request body
    //   console.log("Request body:", req.body);
  
      const { userId, itemId } = req.body;
  
      if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "userId and itemId are required" });
      }
  
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Log the current cartData
    //   console.log("Current cartData:", user.cartData);
  
      // Check if the item is in the cart
      if (user.cartData.has(itemId)) {
        const currentQuantity = user.cartData.get(itemId);
        if (currentQuantity > 1) {
          // Decrement the item quantity
          user.cartData.set(itemId, currentQuantity - 1);
        } else {
          // Remove the item from the cart if quantity is 1
          user.cartData.delete(itemId);
        }
  
        // Save the updated user document
        await user.save();
  
        // Log the updated cartData
        // console.log("Updated cartData:", user.cartData);
  
        return res.json({ success: true, message: "Removed from cart" });
      } else {
        // Log the case where item is not found
        // console.log("Item not found in cart:", itemId);
        return res.status(400).json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
    //   console.error("Error removing from cart:", error);
      return res.status(500).json({ success: false, message: "Error in removing from cart" });
    }
  };

const getCart = async (req,res) =>{
     try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error in getting Cart Detail"})
     }
}

export{addToCart,removeFromCart,getCart}