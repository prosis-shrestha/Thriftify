import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./my-products.module.css";
import { getAllProductApi, updateProductApi } from "../../utils/api";
import ProductItem from "../../components/ProductItem/ProductItem";
import { useThriftContext } from "../../context/Context";
import { ripples } from "ldrs";
import PopUp from "../../components/PopUp/PopUp";
import { ProductType } from "../../utils/type";

const MyProducts = () => {
  const navigate = useNavigate();

  ripples.register();
  const {
    state: { user },
  } = useThriftContext();
  const [myProducts, setMyProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [soldProducts, setSoldProducts] = useState<ProductType[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { status, data } = await getAllProductApi();
      if (status === 200) {
        const allProducts: ProductType[] = data.message;
        const userProducts = user
          ? allProducts.filter(
              (product) =>
                typeof product.owner === "object" &&
                product.owner._id === user._id
            )
          : [];
        setMyProducts(userProducts.filter((product) => !product.sold));
        setSoldProducts(userProducts.filter((product) => product.sold));
      } else {
        throw new Error("something went wrong");
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleConfirmSold = async () => {
    try {
      for (const productId of selectedProductIds) {
        const response = await updateProductApi(productId, { sold: true });
        console.log("Product updated:", response.data);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", (error as any).response?.data);
    } finally {
      setSelectedProductIds([]);
      setShowPopup(false);
    }
  };

  const handleBoostItems = () => {
    if (selectedProductIds.length === 0) {
      alert("Select any Product");
      return;
    }

    const productsToBoost = myProducts.filter(
      (product) =>
        product._id &&
        selectedProductIds.includes(product._id) &&
        !product.boosted
    );

    if (productsToBoost.length === 0) {
      alert("Selected products are already boosted");
    } else {
      navigate("/boostCheckout", { state: { productsToBoost } });
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <div className={styles.topPart}>
          <p>My Products</p>
          <div className={styles.tabs}>
            <button
              className={activeTab === "current" ? styles.activeTab : ""}
              onClick={() => setActiveTab("current")}
            >
              Current Listings
            </button>
            <button
              className={activeTab === "sold" ? styles.activeTab : ""}
              onClick={() => setActiveTab("sold")}
            >
              Sold
            </button>
          </div>
        </div>
        <div className={styles.currentListings}>
          {loading ? (
            <div className={styles.no}>
              <l-ripples size="100" speed="2" color="#7B76C5"></l-ripples>
            </div>
          ) : activeTab === "current" ? (
            myProducts.length > 0 ? (
              myProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  productItem={product}
                  handleSelectProduct={handleSelectProduct}
                  isSelected={
                    product._id
                      ? selectedProductIds.includes(product._id)
                      : false
                  }
                  showCheckbox={true}
                />
              ))
            ) : (
              <p className={styles.no}>No items</p>
            )
          ) : soldProducts.length > 0 ? (
            soldProducts.map((product) => (
              <ProductItem
                key={product._id}
                productItem={product}
                isSelected={false}
                handleSelectProduct={() => {}}
                showCheckbox={false}
              />
            ))
          ) : (
            <p className={styles.no}>No items</p>
          )}
        </div>
      </div>
      {activeTab === "current" && (
        <div className={styles.buttons}>
          <p className={styles.info}>
            Select Items to either Set as Sold or Boost and get verified.
          </p>
          <button
            className={styles.soldButton}
            onClick={() => setShowPopup(true)}
          >
            Set as Sold
          </button>
          <button onClick={handleBoostItems} className={styles.soldButton}>
            Boost Items
          </button>
        </div>
      )}
      {showPopup && (
        <PopUp
          onConfirm={handleConfirmSold}
          onCancel={() => setShowPopup(false)}
          selectedProducts={selectedProductIds as any}
        />
      )}
    </>
  );
};

export default MyProducts;
