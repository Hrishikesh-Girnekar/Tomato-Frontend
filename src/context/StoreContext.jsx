import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from 'axios'
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [loading, setLoading] = useState(true);

    const [cartItems, setCartItems] = useState({});

    const [token, setToken] = useState("");

    const [food_list, setFoodList] = useState([]);

    // const url = "https://tomato-backend-i8yh.onrender.com";
    const url = "http://localhost:4000"


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
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

    // const fetchFoodList = async () => {
    //     const response = await axios.get(url + "/api/food/list");
    //     setFoodList(response.data.data);
    //     if (response.data.data) {
    //         setLoading(false);
    //     }

    // }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            const data = response.data?.data || [];

            setFoodList(data);

            // As soon as we get *any* response, hide skeleton
            if (data) {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            // optionally keep loading true or show error UI
        }
    };


    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    }

    // useEffect(() => {

    //     async function loadData() {
    //         let isCancelled = false;

    //         const poll = async () => {
    //             await fetchFoodList();
    //             if (isCancelled) return;
    //             setTimeout(poll, 1000); // schedule next poll only after previous finishes
    //         };

    //         poll();



    //         //On reloading, user was logging out, so this will stay user login even though we refresh or reload the page
    //         if (localStorage.getItem("token")) {
    //             setToken(localStorage.getItem("token"));

    //             // On reloading or refreshing, cart data was resetting. like if i added 2 items then by refreshing, data gone!
    //             await loadCartData(localStorage.getItem("token"))
    //         }

    //     }
    //     loadData();

    //     return () => {
    //         isCancelled = true; // stop loop
    //     };
    // }, [])

    useEffect(() => {
        let isCancelled = false;   // ✅ now in the effect scope
        let timeoutId;             // to clear the timeout on unmount

        const poll = async () => {
            if (isCancelled) return;

            await fetchFoodList();   // this will setLoading(false) when data comes

            if (isCancelled) return;

            // schedule next poll after 1 second
            timeoutId = setTimeout(poll, 1000);
        };

        const init = async () => {
            // 🔐 Keep user logged in + load cart
            const tokenFromStorage = localStorage.getItem("token");
            if (tokenFromStorage) {
                setToken(tokenFromStorage);
                await loadCartData(tokenFromStorage);
            }

            // 🚀 start polling
            poll();
        };

        init();

        // 🧹 cleanup on unmount
        return () => {
            isCancelled = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);


    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        loading,
        setLoading
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;