import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { allCategoryApi } from "../../../utils/api";

const SideBar = ({ setCurrentCategory, activeCat }) => {
  const [allCategories, setAllCategories] = useState([]);

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
