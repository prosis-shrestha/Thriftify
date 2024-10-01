import { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import ProfileCard from "../../components/profileCard/ProfileCard";
import styles from "./profile.module.css";
import { ThriftContext } from "../../context/Context";

const Profile = () => {
  const {
    state: { user },
  } = useContext(ThriftContext);
  return (
    <>
      {user?.isAdmin ? <AdminNavbar /> : <Navbar />}
      <div className={styles.profile_container}>
        <ProfileCard />
      </div>
    </>
  );
};

export default Profile;
