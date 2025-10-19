import React, { useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const navigate = useNavigate();

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
  })

  const onChangeHandler = (e) => {

    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({ ...data, [name]: value }));

  }

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    // console.log(orderItems); For checking, above logic is working or not

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }

    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

    // if(response.data.success){
    //   toast.success(response.data.message);
    //   const {session_url} = response.data;
    //   window.location.replace(session_url);

    // }else{
    //   toast.error(response.data.message);
    // }

    if (response.data.success) {
      toast.success(response.data.message);

      const { session_url } = response.data;

      // Wait 1 second to show toast before redirect
      setTimeout(() => {
        window.location.replace(session_url);
      }, 2000);
    } else {
      toast.error(response.data.message);
    }

  }

  useEffect(() => {
    if (!token) {
      toast.error("You are not Logged in !")
      navigate('/cart')
    } else if (getTotalCartAmount() == 0) {
      toast.error("Please add some food to cart first !")
      navigate('/cart')
    }
  }, [token])

  // Instead of above, you can do it in cart page itself with below code by changing onClick event

  // const handleCheckout = () => {
  //   if (!token) {
  //     toast.error("You are not logged in!");
  //     navigate('/cart');
  //   } else if (getTotalCartAmount() === 0) {
  //     toast.error("Please add some food to cart first!");
  //     navigate('/cart');
  //   } else {
  //     navigate("/order");
  //   }
  // };


  return (
    <form onSubmit={placeOrder} className='place-order' >
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
          <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
        </div>
        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
        <div className="multi-fields">
          <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
          <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
          <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
        </div>
        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
