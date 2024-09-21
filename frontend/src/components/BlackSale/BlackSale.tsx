import styles from "./blacksale.module.css";

import ProductItem from "../productItem/ProductItem";

import { Link } from "react-router-dom";
import { ripples } from "ldrs";

const BlackSale = ({ allProducts, loading }) => {
  ripples.register();

  return (
    <div className={styles.blackSale}>
      <Link to={`/allProducts`} className={styles.blackSale_header}>
        🛒 All Products
      </Link>
      <div className={styles.productWrapper}>
        {loading ? (
          <l-ripples size="100" speed="2" color="#7B76C5"></l-ripples>
        ) : allProducts.length > 0 ? (
          allProducts.map((productItem, index) => (
            <ProductItem productItem={productItem} key={index} />
          ))
        ) : (
          <p>No items</p>
        )}
      </div>
    </div>
  );
};

export default BlackSale;
