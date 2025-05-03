import styles from "./nearest-items.module.css";
import { useEffect, useState, useRef } from "react";
// import { FaAngleRight } from "react-icons/fa";

import ProductItem from "../ProductItem/ProductItem";

import { ripples } from "ldrs";

const NearestItems = ({ allProducts, loading }) => {
  ripples.register();
  const [items, setItems] = useState([]);
  const productWrapperRef = useRef(null);
  // const [loading, setLoading] = useState(true);
  const [userposition, setUserPosition] = useState([])

  useEffect(() => {
    // setLoading(true);
    // if (allProducts.length > 0) { 
    if (userposition.length == 0) {
      console.log("Requesting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude])
          findNearestItems(userposition[0], userposition[1]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      findNearestItems(userposition[0], userposition[1]);
    }
    // }
  }, [allProducts, userposition]);

  const findNearestItems = (latitude, longitude) => {

    const maxDistance = 10000; // Maximum distance in meters
    const nearestItems = allProducts.filter((product) => {
      //
      if (!product.location || !product.location.coordinates) {
        console.warn(`Product ${product._id} has invalid location data`);
        return false;
      }
      //
      const [productLongitude, productLatitude] = product.location.coordinates;
      const distance =
        getDistanceFromLatLonInKm(
          latitude,
          longitude,
          productLatitude,
          productLongitude
        ) * 1000;
      // console.log(`Distance to product ${product._id}:`, distance);
      return distance <= maxDistance;

    });
    setItems(nearestItems);
    // console.log(`items: ${nearestItems}`)
    // nearestItems.length == 0 ? setLoading(false) : setLoading(true)
    // Don't modify the loading prop as it's controlled by the parent component

  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // const scrollRight = () => {
  //   if (productWrapperRef.current) {
  //     productWrapperRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  //   }
  // };

  return (
    <div className={styles.nearestItems} id="scrollProduct" >
      <h2 className={styles.nearestItems_header}>🌏 Nearest Items</h2>
      <div className={styles.productWrapper} ref={productWrapperRef}>
        {loading ? (
          <l-ripples size="100" speed="2" color="#7B76C5"></l-ripples>
        ) : items.length > 0 ? (
          items.map((productItem, index) => (
            <ProductItem productItem={productItem} key={index} />
          ))

        ) : (
          <p className={styles.no}>No items found nearby.</p>
        )}
      </div>
      {/* <button className={styles.rightButton} onClick={scrollRight}><FaAngleRight /></button> */}
    </div>
  );
};

export default NearestItems;
