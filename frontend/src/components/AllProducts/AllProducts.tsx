import styles from "./all-products.module.css";
import { FC } from "react";
import ProductItem from "../ProductItem/ProductItem";

import { Link } from "react-router-dom";
import { ripples } from "ldrs";
import { ProductType } from "../../utils/type";

export interface AllProductsProps {
  allProducts: ProductType[];
  loading: boolean;
}

const BlackSale: FC<AllProductsProps> = ({ allProducts, loading }) => {
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
          allProducts.map((productItem, index: number) => (
            <ProductItem
              productItem={productItem}
              key={index}
              isSelected={false}
              handleSelectProduct={() => {}}
              showCheckbox={false}
            />
          ))
        ) : (
          <p>No items</p>
        )}
      </div>
    </div>
  );
};

export default BlackSale;
