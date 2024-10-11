import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProductApi } from "../../utils/api";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            try {
                const storedProductDetails = localStorage.getItem('productDetailsToBoost');
                if (storedProductDetails) {
                    const productDetails = JSON.parse(storedProductDetails);
                    for (const product of productDetails) {
                        await updateProductApi(product._id, {
                            boosted: true,
                            boostDays: product.boostDays,
                            reviewed: false
                        });
                    }
                    alert("Payment successful! Your Products will be boosted shortly");
                    localStorage.removeItem('productDetailsToBoost');
                    navigate("/myProducts");
                } else {
                    alert("No product details found. Please contact support.");
                    navigate("/myProducts");
                }
            } catch (error) {
                console.error("Error updating products:", error);
                alert("Payment successful, but there was an error updating products. Please contact support.");
                navigate("/myProducts");
            } finally {
                setIsProcessing(false);
            }
        };

        handlePaymentSuccess();
    }, [navigate]);

    return (
        <div>
            <h2>Payment Successful</h2>
            {isProcessing ? <p>Processing your order...</p> : <p>Redirecting...</p>}
        </div>
    );
};

export default PaymentSuccess;