import { useEffect, useState } from "react";
import BlackSale from "../../components/AllProducts/AllProducts";
import Hero from "../../components/Hero/Hero";
import Navbar from "../../components/Navbar/Navbar";
import Chatbox from "../../components/Chatbox/Chatbox";
import NearestItems from "../../components/NearestItems/NearestItems";
import BoostedItems from "../../components/BoostedItems/BoostedItems";
import Category from "../../components/Category/Category";
import styles from "./homepage.module.css";
import { getAllProductApi } from "../../utils/api";
import { useThriftContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../../utils/type";

const Homepage = () => {
  const {
    state: { user },
  } = useThriftContext();
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin");
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { status, data } = await getAllProductApi();
      if (status === 200) {
        setAllProducts(data.message);
      } else {
        throw new Error("something went wrong");
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter out products where the owner's ID matches the user ID if user is not null
  const filteredProducts = user
    ? allProducts.filter(
        (product) =>
          typeof product.owner !== "object" ||
          (product.owner._id !== user._id && !product.sold)
      )
    : allProducts.filter((product) => !product.sold);

  return (
    <div className={styles.homepage_container}>
      <Navbar />
      <Hero />
      <Category />
      <BoostedItems
        allProducts={filteredProducts}
        loading={loading}
        user={user}
      />
      <hr className={styles.hr} />
      <NearestItems allProducts={filteredProducts} loading={loading} />
      <hr className={styles.hr} />
      <BlackSale allProducts={filteredProducts} loading={loading} />
      <Chatbox />
    </div>
  );
};

export default Homepage;
