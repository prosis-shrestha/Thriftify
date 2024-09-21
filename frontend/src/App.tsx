import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import Buy from "./pages/buy/Buy";
import Signup from "./pages/Auth/SignUp/SignUp";
import Login from "./pages/Auth/Login/Login";
import Upload from "./pages/upload/Upload";
import { useContext } from "react";
import { ThriftContext } from "./context/Context";
import axiosInstance from "./utils/axios";
import { getSessionUser } from "./utils/api";
import { useEffect } from "react";
import Transaction from "./pages/transaction/Transaction";
import AllProducts from "./pages/AllProducts/allProducts";
import Confirmation from "./pages/confirmation/Confirmation";
import Confirmation_email_send from "./pages/confirmation_email_send/Confirmation_email_send";
import Verify from "./pages/verify/Verify";
import Profile from "./pages/profile/Profile";
import ChatList from "./pages/Chatlist/chatList";
import MyProducts from "./pages/MyProducts/MyProducts";
import Admin from "./pages/Admin/Admin";
import BoostCheckout from "./pages/BoostCheckout/BoostCheckout";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";

function App() {
  const { state, dispatch } = useContext(ThriftContext);
  // console.log(state)

  useEffect(() => {
    fetchSessionUser();
  }, []);
  const fetchSessionUser = async () => {
    try {
      const { data, status } = await getSessionUser();
      if (status === 200) {
        dispatch({ type: "addUser", payload: data.message });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="app_container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/product/:id" element={<Buy />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route
            path="/account/email-confirmation"
            element={<Confirmation />}
          />
          <Route
            path="/account/confirmation_email_sent"
            element={<Confirmation_email_send />}
          />
          <Route path="/account/verify_email" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/myProducts" element={<MyProducts />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/boostCheckout" element={<BoostCheckout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
