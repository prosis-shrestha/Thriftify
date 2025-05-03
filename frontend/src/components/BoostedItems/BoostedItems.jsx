import styles from "./boosted-items.module.css";
import React, { useEffect, useState, useRef } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductItem from "../ProductItem/ProductItem";

import { ripples } from "ldrs";

const NearestItems = ({ allProducts, loading, user }) => {
  ripples.register();

  const boostedItems = allProducts.filter(product => product.reviewed && product.boosted);
  console.log(boostedItems);

  return (
    <div className={styles.nearestItems} id="scrollProduct" >
      <div className={styles.firstRow}>
        <h2 className={styles.nearestItems_header}>📈 Trending Now</h2>
        <Link to={user ? "/myProducts" : "/login"} className={styles.boostButton}>
          Trend yours too
        </Link>
      </div>
      <div className={styles.productWrapper}>
        {loading ? (
          <l-ripples size="100" speed="2" color="#7B76C5"></l-ripples>
        ) : boostedItems.length > 0 ? (
          boostedItems.map((productItem, index) => (
            <ProductItem productItem={productItem} key={index} />
          ))

        ) : (
          <p className={styles.no}>No Boosted Items.</p>
        )}
      </div>
      {/* <button className={styles.rightButton} onClick={scrollRight}><FaAngleRight /></button> */}
    </div>
  );
};

export default NearestItems;
