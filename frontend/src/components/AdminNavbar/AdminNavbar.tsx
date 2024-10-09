import { ThriftContext } from "../../context/Context";
import styles from "./adminNavbar.module.css";
import { useContext } from "react";
import SignOutPopover from "../popover/signout popover/SignOutPopover";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const {
    state: { user },
  } = useContext(ThriftContext);

  return (
    <div className={styles.navbar}>
      <Link to={"/"} className={styles.logo}>
        <img src="/images/logo.png" alt="logo" className={styles.logo_img} />
      </Link>

      <div className={styles.others}>
        <div className={styles.usertype}>Admin</div>
        <SignOutPopover>
          <div className={styles.profileImgWrapper}>
            <img
              className={styles.profileImg}
              src={user?.image}
              alt="profile"
            />
          </div>
        </SignOutPopover>
      </div>
    </div>
  );
};

export default AdminNavbar;
