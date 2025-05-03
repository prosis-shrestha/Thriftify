import React, { useEffect, useRef, useState } from "react";
import styles from "./profile.module.css";
import { BiUserCircle } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
// import { RiDeleteBin6Line } from "react-icons/ri";
import { useThriftContext } from "../../context/Context";
// import { ThriftContext } from "../../context/Context";
import { updateUserApi } from "../../utils/api";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useAlert } from "../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
// import { UserType } from "../../utils/Type";

const ProfileCard = () => {
  const {
    state: { user },
    dispatch,
  } = useThriftContext();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    image: "",
    city: "",
    contact: "",
    about: "",
  });

  // const [profileData, setProfileData]= useState<UserType | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { upload } = useUploadImage();
  const navigate = useNavigate();
  const { alert } = useAlert();

  useEffect(() => {
    if (!user) return;
    setProfileData({
      email: user?.email,
      username: user.username,
      image: user?.image ?? "",
      city: user?.city ?? "",
      contact: user?.contact ?? "",
      about: user?.about ?? "",
    });
  }, [user]);

  // useEffect(() => {
  //   if (!user) return;
  //   setProfileData({
  //     _id: user._id, // optional
  //     email: user.email,
  //     username: user.username,
  //     image: user.image ?? "",
  //     city: user.city ?? "",
  //     contact: user.contact ?? "",
  //     about: user.about ?? "",
  //     isAdmin: user.isAdmin, // ✅ required field
  //     isVerfied: user.isVerfied ?? false, // optional but safe default if needed
  //   });
  // }, [user]);

  // console.log(profileData)

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("inside change file");
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    // setProfileData((prev) => {
    //   if (!prev) return prev; // or throw an error if this should never happen

    //   return {
    //     ...prev,
    //     [name]: value,
    //   };
    // });
  };
  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setProfileData((prev) => ({ ...prev, country: e.target.value }));
  // };

  const handleUpdateUser = async () => {
    console.log("user", user);
    let image;
    if (imageFile) {
      const { url } = await upload(imageFile);
      image = url;
    }

    if (!user) return;
    const updatePayload = {
      ...profileData,
      image: image ?? profileData.image,
    };

    try {
      const { status, data } = await updateUserApi(updatePayload);
      if (status === 200) {
        dispatch({ type: "addUser", payload: data.message });
        alert("success", "Successfully user updated");
        navigate("/");
      }
    } catch (error) {
      alert("error", "error while upding profile");
      console.log(error);
    }
  };
  return (
    <div className={styles.profile_card}>
      <div className={styles.profile_header}>
        <BiUserCircle className={styles.header_icon} />
        <h2>Account Preferences</h2>
      </div>
      <div className={styles.avatar_box}>
        <input
          type="file"
          ref={imageRef}
          style={{ display: "none" }}
          onChange={handleChangeFile}
        />
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : user?.image}
          alt="avatar"
          className={styles.avatar_logo}
        />
        <div className={styles.avatar_btn}>
          <button
            className={styles.avatar_header_btns}
            onClick={() => imageRef.current?.click()}
          >
            <HiOutlinePhotograph />
            <p>Change</p>
          </button>
          {/* <button className={styles.avatar_header_btns}>
                <RiDeleteBin6Line/>
                Remove</button> */}
        </div>
      </div>
      <form className={styles.form}>
        <div className={styles.inputItem}>
          <label className={styles.labelName}>Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={handleInputChange}
            name="username"
          />
        </div>
        {/* <div className={styles.inputItem}>

<label className={styles.labelName}>Country</label>
<select value={profileData.country} onChange={handleSelectChange}  >
    <option value={""}>choose country</option>
    <option value={"Nepal"}>Nepal</option>
    <option value="India">India</option>
    <option value={"Bhutan"}>Bhutan</option>
    <option value="Bangladesh">Bangladesh</option>
</select>
</div> */}

        <div className={styles.inputItem}>
          <label className={styles.labelName}>City</label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputItem}>
          <label className={styles.labelName}>Contact</label>
          <input
            type="text"
            name="contact"
            value={profileData.contact}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputItem}>
          <label className={styles.labelName}>About You</label>
          <input
            type="text"
            name="about"
            value={profileData.about}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <div className={styles.btn_wrapper}>
        {/* <button className={styles.cancel_btn}>Cancel</button> */}
        <button className={styles.update_btn} onClick={handleUpdateUser}>
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
