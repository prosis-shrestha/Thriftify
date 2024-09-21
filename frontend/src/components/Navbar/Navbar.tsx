import { ThriftContext } from "../../context/Context";
import styles from "./navbar.module.css";
import { useContext } from "react";
import SignOutPopover from "../popover/signout popover/SignOutPopover";
import { Link } from "react-router-dom";
import SearchModal from "../../layouts/modal/SeachModal/SearchModal";

const Navbar = () => {
  const {
    state: { user },
  } = useContext(ThriftContext);

  // const {
  //   state: { user, notifications },
  // } = useContext(ThriftContext);

  return (
    <div className={styles.navbar}>
      <Link to={"/"} className={styles.logo}>
        <img src="/images/logo.png" alt="logo" className={styles.logo_img} />
      </Link>

      <div className={styles.others}>
        <div>
          <SearchModal full={true}>
            <div className={styles.search}>🔍 </div>
          </SearchModal>
        </div>
        {user ? (
          <>
            {user && (
              <Link to={"/chat"} className={styles.message}>
                💬
                {/* {notifications && notifications.mainUser !== user._id && (
                  <span className={styles.notification}></span>
                )} */}
              </Link>
            )}
            <Link to={"/upload"} className={styles.sellButton}>
              Sell
            </Link>

            <SignOutPopover>
              <div className={styles.profileImgWrapper}>
                <img
                  className={styles.profileImg}
                  src={user.image}
                  alt="profile"
                />
              </div>
            </SignOutPopover>
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
