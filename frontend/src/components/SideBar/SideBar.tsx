import { useEffect, useState, FC } from "react";
import styles from "./sidebar.module.css";
import { allCategoryApi } from "../../utils/api";
import { CategoryType } from "../../utils/type";

// Define the Category type
// interface Category {
//   _id: string;
//   name: string;
//   categoryName: string;
//   // Add other properties your category might have
// }

// Define the props type for SideBar component
interface SideBarProps {
  setCurrentCategory: (category: string) => void;
  activeCat: string;
}

// const SideBar = ({ setCurrentCategory, activeCat }) => {
// const [allCategories, setAllCategories] = useState([]);
const SideBar: FC<SideBarProps> = ({ setCurrentCategory, activeCat }) => {
  // Define the type for allCategories
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const { status, data } = await allCategoryApi();

      if (status === 200) {
        setAllCategories(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.sideBar}>
      <ul className={styles.ul_sidebar}>
        <li
          onClick={() => setCurrentCategory("All")}
          className={`${activeCat === "All" ? styles.activeCat : ""} `}
        >
          <span className={styles.all}>All</span>
        </li>
        {allCategories.map((cat) => (
          <li
            key={cat._id}
            className={`${
              cat.categoryName === activeCat ? styles.activeCat : ""
            }`}
            onClick={() => setCurrentCategory(cat.categoryName)}
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
