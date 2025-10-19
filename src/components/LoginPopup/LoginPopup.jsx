import React, { useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {

    const {url, setToken} = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");

    const [data, setData] = useState({
        name:"",
        email:"",
        password:"",
    })

    const onChangeHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;

        setData(data => ({...data, [name]:value}));
    }

    const onLogin = async(e) =>{
        e.preventDefault();

        let newUrl = url;

        if(currState === "Login"){
            newUrl += "/api/user/login"
        }else{
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);

        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message)
            setShowLogin(false); // after login, login page will be hidden
        }else{
            toast.error(response.data.message)
        }


    }

    // to check the all input fields are working or not
    // useEffect(() => {
    //     console.log(data);
    // },[data]);

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} action="" className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input onChange={onChangeHandler} type="text" name="name" value={data.name} id="" placeholder='Your Name' required />}

                    <input onChange={onChangeHandler} type="email" name="email" value={data.email} id="" placeholder='Your Email' required />
                    <input onChange={onChangeHandler} type="password" name="password" value={data.password} id="" placeholder='Password' />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By contubuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }


            </form>
        </div>
    )
}

export default LoginPopup
