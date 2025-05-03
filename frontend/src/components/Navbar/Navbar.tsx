import { useThriftContext } from "../../context/Context";
import styles from "./navbar.module.css";
import SignOutPopUp from "../PopUp/SignOut/SignOutPopUp";
import { Link } from "react-router-dom";
import SearchModal from "../../layouts/modal/SeachModal/SearchModal";
import { FaFacebookMessenger, FaSearch } from "react-icons/fa";

const Navbar = () => {
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
        <div>
          <SearchModal full={true}>
            <div className={styles.search}>
              <FaSearch />{" "}
            </div>
          </SearchModal>
        </div>
        {user ? (
          <>
            {user && (
              <Link to={"/chat"} className={styles.message}>
                <FaFacebookMessenger />
              </Link>
            )}
            <Link to={"/upload"} className={styles.sellButton}>
              Sell
            </Link>

            <SignOutPopUp>
              <div className={styles.profileImgWrapper}>
                <img
                  className={styles.profileImg}
                  src={user.image}
                  alt="profile"
                />
              </div>
            </SignOutPopUp>
          </>
        ) : (
          <Link to={"/login"}>
            <button className={styles.authButton}>Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
