// import orderModel from "../models/orderModel.js";
// import userModel from '../models/userModel.js'
// import Stripe from 'stripe'


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// // place user order for frontend

// const placeOrder = async(req,res) =>{

//     const frontend_url= "http://localhost:5173"

//     try {
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();
//         await userModel.findOneAndUpdate(req.body.userId,{cartData:{}})

//         const line_items=req.body.items.map((item)=>({

            
//            price_data:{
//             currency:"inr",
//             product_data:{
//                 name:item.name
//             },
//             unit_amount:item.price*100*80


//            },
//            quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80

//             },
//             quantity:1
//         })
//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//         })
//         res.json({success:true,session_url:session.url})


//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"error in payment"});
//     }

// }

// export{placeOrder}


import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173/";

    try {
        // Create a new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clear cart data for the user
        await userModel.findOneAndUpdate({ _id: req.body.userId }, { cartData: {} });

        // Prepare line items for Stripe
        const line_items = req.body.items.map(item => ({
            price_data: {
                currency: "usd", // Set currency to USD
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100) // Convert price to cents
            },
            quantity: item.quantity
        }));

        // Add delivery charges to line items
        line_items.push({
            price_data: {
                currency: "usd", // Set currency to USD
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 200 // Convert to cents (2 USD)
            },
            quantity: 1
        });

        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error in payment" });
    }
};

// const verifyOrder = async (req, res) => {
//     const { success, orderId } = req.body;
//     console.log('Verifying payment:', { success, orderId });
  
//     try {
//       if (success === 'true') {
//         const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { paymentStatus: 'paid' }, { new: true });
//         console.log('Order updated:', updatedOrder);
//         if (updatedOrder) {
//           return res.json({ success: true });
//         }
//       }
//       return res.json({ success: false });
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       return res.json({ success: false });
//     }
// }
const verifyOrder = async (req, res) => {
    const { success, orderId } = req.body;
  //  console.log('Verifying payment:', { success, orderId });
  
    try {
        // Convert `success` to a boolean
        const isSuccess = success === 'true';

        // If payment was successful, update the order's payment status
        if (isSuccess) {
            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId,
                { payment: true },  // Update the payment field to true
                { new: true }  // Return the updated document
            );

           // console.log('Order updated:', updatedOrder);

            if (updatedOrder) {
                return res.json({ success: true });
            }
        }

        // If payment was not successful or order update failed
        return res.json({ success: false });
    } catch (error) {
        //console.error('Error verifying payment:', error);
        return res.json({ success: false });
    }
}

// const verifyOrder = async (req, res) => {
//     const { success, orderId } = req.body;
  
//     try {
//       if (success === 'true') {
//         // Update the order to indicate successful payment
//         await orderModel.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
  
//         res.json({ success: true });
//       } else {
//         // Update the order to indicate payment failed
//         await orderModel.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
  
//         res.json({ success: false });
//       }
//     } catch (error) {
//       console.error("Error verifying payment:", error);
//       res.status(500).json({ success: false, message: 'Error verifying payment' });
//     }
//   };


// user orders for frontend

const userOrders = async(req,res) =>{
   try {
    const orders = await orderModel.find({userId:req.body.userId})
    //console.log(req.body.userId);
    res.json({success:true,data:orders})
    
   } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error in userOrders"})
   }
}


// listing order for admin panel
const listOrders = async (req,res) =>{
   try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
   } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error in listing order for adimn"})
   }
}

// api for updating order status

const updateStatus = async(req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error in status updating"})
    }

}




export { placeOrder ,verifyOrder,userOrders,listOrders,updateStatus};
