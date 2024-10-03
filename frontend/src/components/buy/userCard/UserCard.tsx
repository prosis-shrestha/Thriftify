import { useContext } from "react";
import styles from "./UserCard.module.css";
import { ThriftContext } from "../../../context/Context";
import Messaging from "../../messaging/messaging.jsx";

const UserCard = ({ userData }) => {
  const {
    state: { user },
  } = useContext(ThriftContext);
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
