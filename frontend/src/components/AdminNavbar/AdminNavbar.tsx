import { useThriftContext } from "../../context/Context";
import styles from "./admin-navbar.module.css";
// import { useContext } from "react";
import SignOutPopUp from "../PopUp/SignOut/SignOutPopUp";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const {
    state: { user },
  } = useThriftContext();

  return (
    <div className={styles.navbar}>
      <Link to={"/"} className={styles.logo}>
        <img
          src="/src/assets/logo.png"
          alt="logo"
          className={styles.logo_img}
        />
      </Link>

      <div className={styles.others}>
        <div className={styles.usertype}>Admin</div>
        <SignOutPopUp>
          <div className={styles.profileImgWrapper}>
            <img
              className={styles.profileImg}
              src={user?.image}
              alt="profile"
            />
          </div>
        </SignOutPopUp>
      </div>
    </div>
  );
};

export default AdminNavbar;
