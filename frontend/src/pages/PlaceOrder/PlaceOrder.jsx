// import React, { useState,useContext } from 'react'
// import "./PlaceOrder.css"
// import { StoreContext } from '../../context/StoreContext'
// const PlaceOrder = () => {

//   const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)
  
//   const [data,setData] = useState({
//        firstName:"",
//        lastName:"",
//        email:"",
//        street:"",
//        city:"",
//        state:"",
//        zipcode:"",
//        country:"",
//        phone:""
//   })

// const placeOrder = async (event) =>{
//   event.preventDefault();
//   let orderItems =[];
//   food_list.map((item) =>{
//     if(cartItems[item._id]>0){
//       let itemInfo = item;
//       itemInfo["quantity"] = cartItems[item._id];
//       orderItems.push(itemInfo);
//     }

//   })
//   console.log(orderItems);
// }




//   const onChangeHandler = (event) =>{
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data =>({...data,[name]:value}))
//   }

 

//   return (
//     <form onSubmit={placeOrder} className='place-order'>
//       <div className='place-order-left'>
//         <p className='title'> Delivery Information</p>
//         <div className='multi-fileds'>
//           <input name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First name'/>
//           <input name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last name'/>
//         </div>
//         <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='email address'/>
//         <input name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street'/>
//         <div className='multi-fileds'>
//           <input name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City'/>
//           <input  name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State'/>
//         </div>
//         <div className='multi-fileds'>
//           <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip Code'/>
//           <input name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country'/>

//         </div>
//         <input name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone'/>
//       </div>

//       <div className='place-order-right'>
//       <div className='cart-bottom'>
//        <div className='cart-total'> <h2>Cart Totals</h2>
//        <div>
//         <div className='cart-total-details'>
//           <p>SubTotal</p>
//           <p>${getTotalCartAmount}</p>
//         </div>
//         <div className='cart-total-details'>
//           <p>Delivery Fee</p>
//           <p>${getTotalCartAmount()===0?0:2}</p>
//         </div>
//         <div className='cart-total-details'>
//           <p>Total</p>
//           <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
//         </div>
//          <button type='submit'>PROCEED TO PAYMENT</button>
//         </div>
//         </div>
//       </div>
      

//       </div>
      
//     </form>
//   )
// }

// export default PlaceOrder

import React, { useState, useContext, useEffect } from 'react';
import "./PlaceOrder.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItem, url } = useContext(StoreContext);
  
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  // const placeOrder = async (event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.forEach((item) => {
  //     if (cartItem[item._id] > 0) {
  //       let itemInfo = { ...item, quantity: cartItem[item._id] };
  //       orderItems.push(itemInfo);
  //     }
  //   });
  //   //console.log(orderItems);
  //   // You can proceed to send the orderItems to the server here
  //   let orderData = {
  //     address:data,
  //     items:orderItems,
  //     amount:getTotalCartAmount()+2
  //   }
  //   let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
  //   if(response.data.success){
  //     const {session_url} = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else {
  //     alert("Error")
  //   }
  // };
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    
    food_list.forEach((item) => {
      if (cartItem[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItem[item._id] };
        orderItems.push(itemInfo);
      }
    });
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2 // Adding delivery fee
    };
  
    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
  
      if (response.data.success) {
        const { session_url } = response.data;
        if (session_url) {
          window.location.replace(session_url);
        } else {
          alert("Unable to redirect to payment. Please try again.");
        }
      } else {
        alert("Error placing order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };
  

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

const navigate = useNavigate()

  useEffect(()=>{
   if(!token){
    navigate('/cart')
   }
   else if(getTotalCartAmount() ===0){
    navigate('/cart')
   }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fileds'>
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last name'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address'/>
        <input name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street'/>
        <div className='multi-fileds'>
          <input required name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State'/>
        </div>
        <div className='multi-fileds'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip Code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone'/>
      </div>

      <div className='place-order-right'>
        <div className='cart-bottom'>
          <div className='cart-total'>
            <h2>Cart Totals</h2>
            <div>
              <div className='cart-total-details'>
                <p>SubTotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <div className='cart-total-details'>
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <div className='cart-total-details'>
                <p>Total</p>
                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
              </div>
              <button type='submit'>PROCEED TO PAYMENT</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
