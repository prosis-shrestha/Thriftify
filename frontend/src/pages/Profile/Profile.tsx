import Navbar from "../../components/Navbar/Navbar";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import ProfileCard from "../../components/Profile/Profile";
import styles from "./profile.module.css";
import { useThriftContext } from "../../context/Context";

const Profile = () => {
  const {
    state: { user },
  } = useThriftContext();
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
