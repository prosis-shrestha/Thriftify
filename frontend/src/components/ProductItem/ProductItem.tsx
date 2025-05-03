import { Link } from "react-router-dom";
import styles from "./product-item.module.css";
import { ProductType } from "../../utils/type";
import { FC } from "react";
// type ProductItemProps = {
//   productItem: {
//     image: string;
//     desc: string;
//     name: string;
//     price: number;
//     sale: string;
//     _id?: string;
//     condition: string;
//   };
//   isSelected: boolean;
//   handleSelectProduct: (id: string) => void;
// };

export interface ProductItemProps {
  productItem: ProductType;
  // key?: number | string;
  isSelected: boolean;
  showCheckbox: boolean;
  handleSelectProduct: (id: string) => void;
}

const ProductItem: FC<ProductItemProps> = ({
  productItem,
  isSelected,
  showCheckbox,
  handleSelectProduct,
}) => {
  return (
    <div className={styles.productItemWrapper}>
      <Link to={`/product/${productItem._id}`} className={styles.productItem}>
        <div className={styles.imgWrapper}>
          <img
            className={styles.productImg}
            src={productItem.image}
            alt="productImg"
          />
        </div>
        <hr className={styles.line} />
        <div className={styles.productInfo}>
          <div className={styles.productName}>
            <p className={styles.name}>{productItem.name}</p>
            <p className={styles.condition}>{productItem.condition}</p>
            <p className={styles.productPrice}>Rs. {productItem.price}</p>
          </div>
        </div>
      </Link>
      {showCheckbox && handleSelectProduct && (
        <label className={styles.ccontainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            onChange={() =>
              productItem._id && handleSelectProduct(productItem._id)
            }
          />
          Select
        </label>
      )}
    </div>
  );
};

export default ProductItem;
