import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import Buy from "./pages/buy/Buy";
import Signup from "./pages/Auth/SignUp/SignUp";
import Login from "./pages/Auth/Login/Login";
import Upload from "./pages/upload/Upload";
import { useContext } from "react";
import { ThriftContext } from "./context/Context";
import { getSessionUser } from "./utils/api";
import { useEffect } from "react";
import AllProducts from "./pages/AllProducts/AllProducts";
import Confirmation from "./pages/confirmation/Confirmation";
import Confirmation_email_send from "./pages/confirmation_email_send/Confirmation_email_send";
import Verify from "./pages/verify/Verify";
import Profile from "./pages/profile/Profile";
import ChatList from "./pages/Chatlist/chatlist";
import MyProducts from "./pages/MyProducts/MyProducts";
import Admin from "./pages/Admin/Admin";
import BoostCheckout from "./pages/BoostCheckout/BoostCheckout";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const context = useContext(ThriftContext);

  if (!context) {
    throw new Error("App must be used within ThriftContextProvider");
  }

  const { dispatch } = context;

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
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/boostCheckout" element={<BoostCheckout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
