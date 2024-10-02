import { Link } from "react-router-dom";
import styles from "./categoryItem.module.css";

type CategoryItemProps = {
  product: {
    image: string;
    categoryName: string;
  };
};

const CategoryItem: React.FC<CategoryItemProps> = ({ product }) => {
  return (
    <Link
      to={`/allProducts`}
      state={{ category: product.categoryName }}
      className={styles.CategoryItem}
    >
      <div className={styles.imgWrapper}>
        <img src={product.image} alt="categoryItem" />
      </div>
      <p className={styles.categoryName}>{product.categoryName}</p>
    </Link>
  );
};

export default CategoryItem;
