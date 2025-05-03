import CategoryItem from "./CategoryItem/CategoryItem.tsx";
import styles from "./category.module.css";
// import {products} from "../../utils/Data"
import { allCategoryApi } from "../../utils/api";
import { useState, useEffect } from "react";

const Category = () => {
  const [allCategory, setAllCategory] = useState([]);
  useEffect(() => {
    categoryFetching();
  }, []);
  const categoryFetching = async () => {
    try {
      const { data, status } = await allCategoryApi();
      if (status === 200) {
        setAllCategory(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className={styles.Category}>
      {allCategory.map((product, index) => {
        return <CategoryItem key={index} product={product} />;
      })}
    </div>
  );
};

export default Category;
