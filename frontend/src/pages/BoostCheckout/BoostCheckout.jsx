import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./boostCheckout.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { updateProductApi, createCheckoutApi } from "../../utils/api";

const stripePromise = loadStripe('pk_test_51PaBHtRv6GaYz57Z2UuuLgsLv18jlKGh0INJpLi3LF9ALMGu8ifjMWWN5QHx3gYdASu8TIqGlSoORaT9mwI9Pcrx00UwRucIIW');

const BoostCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productsToBoost = location.state?.productsToBoost || [];
  const [productDetails, setProductDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setProductDetails(productsToBoost.map(product => ({ ...product, boostDays: 1 })));
  }, [productsToBoost]);

  useEffect(() => {
    const newTotal = productDetails.reduce(
      (sum, product) => sum + product.boostDays * 100,
      0
    );
    setTotal(newTotal);
  }, [productDetails]);

  const handleDaysChange = (index, change) => {
    const newDetails = [...productDetails];
    newDetails[index].boostDays = Math.max(
      1,
      newDetails[index].boostDays + change
    );
    setProductDetails(newDetails);
  };

  // const handleCheckout = async () => {
  //   try {
  //     for (const product of productDetails) {
  //       await updateProductApi(product._id, {
  //         boosted: true,
  //         boostDays: product.boostDays,
  //         reviewed: false
  //       });
  //     }
  //     alert("Checkout successful! Products have been boosted.");
  //     navigate("/myProducts");
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     alert("An error occurred during checkout. Please try again.");
  //   }
  // };
  console.log(productDetails)

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      localStorage.setItem('productDetailsToBoost', JSON.stringify(productDetails));
      // Create a Checkout Session on your backend
      const response = await createCheckoutApi({
        products: productDetails,
      });

      const session = response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });


      if (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topPart}>
        <h2>Boost Checkout</h2>
      </div>
      <div className={styles.productList}>
        {productDetails.map((product, index) => (
          <div key={product._id} className={styles.productItem}>
            <div className={styles.productImage}>
              <img src={product.image} alt={product.name} />
            </div>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <div className={styles.boostDays}>
                <button onClick={() => handleDaysChange(index, -1)}>-</button>
                <span>{product.boostDays} days</span>
                <button onClick={() => handleDaysChange(index, 1)}>+</button>
              </div>
              <p>Cost: Rs.{product.boostDays * 100}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.checkoutSummary}>
        <h3>Total: Rs.{total}</h3>
        <button className={styles.checkoutButton} onClick={handleCheckout} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default BoostCheckout;
