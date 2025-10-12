import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from 'axios'
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});

    const [token, setToken] = useState("");

    const [food_list, setFoodList] = useState([]);

    const url = "https://tomato-backend-i8yh.onrender.com/";

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        if(token){
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}});
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

        if(token){
            await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}});
        }
    }

    // useEffect(() => {
    //     console.log(cartItems);
    // },[cartItems])   // To check how many items and quantity of that item is there

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async(token) => {
        const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(() => {

        async function loadData() {
            await fetchFoodList();
            //On reloading, user was logging out, so this will stay user login even though we refresh or reload the page
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));

                // On reloading or refreshing, cart data was resetting. like if i added 2 items then by refreshing, data gone!
                await loadCartData(localStorage.getItem("token"))
            }

        }
        loadData();
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;