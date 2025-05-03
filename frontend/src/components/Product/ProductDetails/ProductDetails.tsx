import styles from "./product-details.module.css";
import UserCard from "../UserCard/UserCard";
import { useState, useEffect } from "react";
// import { BuyModal } from "../../../layouts/modal/BuyModal";
// import { ThriftContext } from "../../../context/Context";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProductType } from "../../../utils/type";
import { FC } from "react";
// import { useThriftContext } from "../../context/Context";

interface ProductDetailsProps {
  productData: ProductType | null;
}

// const ProductDetails = ({ productData }) => {
const ProductDetails: FC<ProductDetailsProps> = ({ productData }) => {
  // const {
  //     state: { user },
  //   } = useThriftContext();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>();
  const [locationName, setLocationName] = useState("");

  // useEffect(() => {
  //   if (productData.preciseLat == null && productData.preciseLon == null) {
  //     setPosition([productData.lat, productData.lon]);
  //   } else {
  //     setPosition([productData.preciseLat, productData.preciseLon]);
  //   }
  //   console.log(position);

  // }, [productData]);

  useEffect(() => {
    if (!productData) return;

    const timer = setTimeout(() => {
      const lat = productData.preciseLat ?? productData.lat;
      const lon = productData.preciseLon ?? productData.lon;
      setPosition([lat, lon]);
    }, 2000);

    return () => clearTimeout(timer); // Optional cleanup
  }, [productData]);

  // const popupRef = useRef();

  useEffect(() => {
    if (!productData) return;
    if (productData.preciseLat != null && productData.preciseLon != null) {
      const fetchLocationName = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${productData.preciseLat}&lon=${productData.preciseLon}&zoom=10`
          );
          const data = await response.json();
          setLocationName(data.display_name);
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocationName("Location");
        }
      };
      fetchLocationName();
    } else {
      setLocationName(productData.city);
    }
  }, [position, productData]);

  // useEffect(() => {
  //   if (popupRef.current) {
  //     popupRef.current.openOn(popupRef.current._map);
  //   }
  // }, [locationName]);

  // const [quantity, setQuantity] = useState(1);

  // const handleChangeQuantity = (type: string) => {
  //   if (type === "sub") {
  //     if (quantity === 1) return;
  //     setQuantity((prev) => prev - 1);
  //   } else {
  //     if (quantity === +productData.quantity) return;
  //     setQuantity((prev) => prev + 1);
  //   }
  // };

  return (
    <div className={styles.productDetails}>
      <div className={styles.image_user}>
        <div className={styles.img_wrapper} onClick={() => setOpen(true)}>
          <img src={productData?.image} alt="" />
        </div>
        {typeof productData?.owner === "object" &&
          "email" in productData.owner && (
            <UserCard userData={productData.owner} />
          )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{productData?.name}</h3>
        <hr />
        <div className={styles.priceInfo}>
          <p className={styles.newPrice}>Rs {productData?.price}</p>
        </div>
        <p className={styles.productDesc1}>{productData?.desc}</p>
        <div className={styles.desc}>
          <div className={styles.desc1}>
            <p className={styles.productDesc}>
              Condition: {productData?.condition}
            </p>
            <p className={styles.productDesc}>Gender: {productData?.gender}</p>
          </div>
          <div className={styles.desc1}>
            <p className={styles.productDesc}>
              Category: {productData?.category}
            </p>
            <p className={styles.productDesc}>City: {productData?.city}</p>
          </div>
        </div>
        {/* {+productData.quantity <= 0 ? (
          <p className={styles.productDesc}>Out of stock </p>
        ) : (
          <p className={styles.productDesc}>In stock {productData.quantity}</p>
        )} */}
        {/* {+productData?.quantity !== 0 && (
         
              <div className={styles.quantityBox}>
                <p>Quantity</p>
                <button onClick={() => handleChangeQuantity("add")}>+</button>
                <p>{quantity}</p>
                <button onClick={() => handleChangeQuantity("sub")}>-</button>
              </div>
           
        {user?._id !== productData?.owner?._id &&   
        <BuyModal quantity={quantity} product={productData}>
       <button  className={styles.buyBtn}>Buy Now</button>
       </BuyModal>}
   
             
     
          )} */}

        {/* <div className={styles.trydiv}> */}
        <p>Location:</p>
        {position && position.length > 0 && (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className={styles.mapContainer}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Tooltip direction="top" offset={[-15, -10]} permanent>
                {locationName}
              </Tooltip>
              {/* <Popup permanent>{locationName}</Popup> */}
            </Marker>
          </MapContainer>
        )}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: `${productData?.image} ` }]}
      />
    </div>
  );
};

export default ProductDetails;
