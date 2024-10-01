import { useEffect, useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import TopNav from "../../components/TopNav/TopNav";
import AllProductCard from "../../components/allProductsCard/AllProductCard";
import SideBar from "../../components/allProductsCard/sidebar/SideBar";
import styles from "./allProducts.module.css";
import { BsSearch } from "react-icons/bs";
import { getAllProductApi, getProductsbyCategoryApi } from "../../utils/api";
import ProductItem from "../../components/productItem/ProductItem";
import { useLocation } from "react-router-dom";
// import SearchModal from "../../layouts/modal/SeachModal/SearchModal";
import { ThriftContext } from "../../context/Context";
import { ripples } from "ldrs";

const AllProducts = () => {
  ripples.register();
  const {
    state: { user },
  } = useContext(ThriftContext);
  const location = useLocation();
  const initialCategory = location.state?.category || "All";
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [productItem, setProductItem] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductsByCategory(currentCategory);
  }, [currentCategory]);

  const fetchProductsByCategory = async (category: string) => {
    setLoading(true);
    let res;
    try {
      if (category === "All") {
        res = await getAllProductApi();
      } else {
        res = await getProductsbyCategoryApi(category);
      }

      let products = res.data.message;
      setProductItem(products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const filteredProductItem = user
    ? productItem.filter(
        (product) => product.owner._id !== user._id && !product.sold
      )
    : productItem.filter((product) => !product.sold);

  return (
    <>
      <Navbar />
      <div className={styles.allProducts_container}>
        <div className={styles.topPart}>
          <p>🛒 Products</p>
        </div>
        <div className={styles.allProducts_box}>
          <div className={styles.product_sidebar}>
            <SideBar
              setCurrentCategory={setCurrentCategory}
              activeCat={currentCategory}
            />
          </div>
          <div className={styles.productCard_box}>
            {loading ? (
              <div className={styles.no}>
                <l-ripples size="100" speed="2" color="#7B76C5"></l-ripples>
              </div>
            ) : filteredProductItem.length > 0 ? (
              filteredProductItem.map((product) => (
                <ProductItem key={product._id} productItem={product} />
              ))
            ) : (
              <p className={styles.no}>No items</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;