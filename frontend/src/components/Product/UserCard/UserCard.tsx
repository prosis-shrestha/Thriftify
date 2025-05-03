// import { useContext } from "react";
import styles from "./user-card.module.css";
import { useThriftContext } from "../../../context/Context.js";
import Messaging from "../../Messaging/Messaging.jsx";
import { UserType } from "../../../utils/type.js";
import { FC } from "react";

interface UserCardProps {
  userData: UserType;
}

const UserCard: FC<UserCardProps> = ({ userData }) => {
  const {
    state: { user },
  } = useThriftContext();

  return (
    <div className={styles.userCard}>
      <div className={styles.profile_info}>
        <img width={"50"} src={userData.image} alt="" />
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{userData.username}</h4>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>
      <div className={styles.secondCard}>
        <div className={styles.addressItem}>
          <p>Contact:</p>
          <p>{userData.contact}</p>
        </div>
        <div className={styles.addressItem}>
          <p>City:</p>
          <p>{userData.city}</p>
        </div>

        {/* <div className={styles.bioBox}>
        <p className={styles.bioKey}>About seller</p>
        <p className={styles.bioTxt}>{userData.about}</p>
      </div> */}
        {/* {
    user?._id !== userData?._id && <button className={styles.messageBtn}>
    Message
    </button>
    }   
    */}
      </div>
      {user?._id !== userData?._id && (
        <div className={styles.thridCard}>
          <Messaging userData={userData} />
        </div>
      )}
    </div>
  );
};

export default UserCard;
