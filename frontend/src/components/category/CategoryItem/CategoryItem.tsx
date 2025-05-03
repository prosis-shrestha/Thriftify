import { Link } from "react-router-dom";
import styles from "./category-item.module.css";
import { CategoryType } from "../../../utils/type";
import { FC } from "react";
// type CategoryItemProps = {
//   product: {
//     image: string;
//     categoryName: string;
//   };
// };

interface CategoryItemProps {
  product: CategoryType;
}

const CategoryItem: FC<CategoryItemProps> = ({ product }) => {
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
