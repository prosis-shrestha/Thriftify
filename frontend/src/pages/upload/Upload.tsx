import React, { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./upload.module.css";
import { IoMdCloudUpload } from "react-icons/io";
import { AddProductApi, allCategoryApi } from "../../utils/api";
import { ThriftContext } from "../../context/Context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useAlert } from "../../hooks/useAlert";
import axios from "axios";
import { FaLocationCrosshairs } from "react-icons/fa6";

const Upload = () => {
  const navigate = useNavigate();
  const {
    state: { user },
  } = useContext(ThriftContext);
  const fileRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    desc: "",
    owner: user?._id,
    image: "",
    price: "",
    category: "",
    condition: "",
    gender: "",
    city: "",
    lat: 0,
    lon: 0,
    preciseLat: 0,
    preciseLon: 0,
  });
  const { upload } = useUploadImage();
  const { alert } = useAlert();

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUploadData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const fetchCoordinates = async (city: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: city,
            format: "json",
            limit: 1,
          },
        }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error("No coordinates found for the given city");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUploadData((prev) => ({
            ...prev,
            preciseLat: position.coords.latitude,
            preciseLon: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("error", "Could not get precise location");
        }
      );
    } else {
      alert("error", "Geolocation is not supported by this browser");
    }
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsUploading(true);

    // Fetch coordinates
    const { latitude, longitude } = await fetchCoordinates(uploadData.city);
    let uploadPayload = {
      ...uploadData,
      owner: user._id,
      lat: latitude,
      lon: longitude,
    };

    // upload image
    if (file) {
      await upload(file, (progress: number, url: string) => {
        console.log(progress);
        if (progress === 100 && url) {
          console.log("completed", url);
          uploadPayload.image = url;
        }
      });
    } else {
      alert("error", "image is required");
      setIsUploading(false);
      return;
    }

    try {
      const { data, status } = await AddProductApi(uploadPayload);
      if (status === 200) {
        alert("success", "Product added sucessfully for sale");
        setFile(null);
        setUploadData({
          name: "",
          desc: "",
          owner: user?._id,
          image: "",
          price: "",
          condition: "",
          gender: "",
          category: "",
          city: "",
          lat: 0,
          lon: 0,
          preciseLat: 0,
          preciseLon: 0,
        });
      }
      setIsUploading(false);
      navigate("/");
      console.log(data);
    } catch (error: any) {
      console.log(error.message);
      setIsUploading(false);
    }
  };

  const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUploadData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <Navbar />

      <div className={styles.uploadContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <IoMdCloudUpload />
            <p className={styles.uploadHeading}>Sell your item</p>
          </div>

          <div className={styles.inputItem}>
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={uploadData.name}
              required
            />
          </div>

          <div className={styles.inputItem}>
            <label htmlFor="desc">Desc*</label>
            <input
              type="text"
              name="desc"
              id="desc"
              placeholder="Enter desc"
              onChange={handleInputChange}
              value={uploadData.desc}
              required
            />
          </div>
          <div className={styles.priceInputItem}>
            <div className={styles.priceInput}>
              <label htmlFor="price">Price*</label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                onChange={handleInputChange}
                name="price"
                value={uploadData.price}
                required
              />
            </div>
            <div className={styles.genderInput}>
              <label htmlFor="price">Gender*</label>
              <select
                name="gender"
                id="gender"
                onChange={handleGenderChange}
                defaultValue="choose"
                required
              >
                <option className={styles.selectOption} value="choose" disabled>
                  gender
                </option>
                <option className={styles.selectOption} value="Male">
                  Male
                </option>
                <option className={styles.selectOption} value="Female">
                  Female
                </option>
                <option className={styles.selectOption} value="Both">
                  Both
                </option>
              </select>
            </div>
          </div>
          <div className={styles.priceInputItem}>
            <div className={styles.genderInput}>
              <label htmlFor="price">Condition*</label>
              <select
                name="condition"
                id="condition"
                onChange={handleGenderChange}
                defaultValue="choose"
                required
              >
                <option className={styles.selectOption} value="choose" disabled>
                  condition
                </option>
                <option className={styles.selectOption} value="New">
                  New
                </option>
                <option className={styles.selectOption} value="Like New">
                  Like New
                </option>
                <option className={styles.selectOption} value="used">
                  Used
                </option>
              </select>
            </div>
            <div className={styles.genderInput}>
              <label htmlFor="price">Category*</label>
              <select
                name="category"
                id="cateogory"
                onChange={handleSelectChange}
                required
              >
                <option
                  className={styles.selectOption}
                  value="choose"
                  selected
                  disabled
                >
                  category
                </option>
                {allCategories.map((cat) => (
                  <option
                    className={styles.selectOption}
                    value={cat.categoryName}
                  >
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputItem}>
            <label>Upload Image*</label>
            <div
              className={styles.uploadImage}
              onClick={() => fileRef.current?.click()}
            >
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileRef}
                onChange={handleFileChange}
                required
              />
              <IoMdCloudUpload className={styles.uploadIcon} />
              <p>Upload</p>
            </div>
          </div>
          <div className={styles.priceInputItem}>
            <div className={styles.inputItem}>
              <label>City*</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Enter City"
                onChange={handleInputChange}
                value={uploadData.city}
                required
              />
            </div>
            <div className={styles.inputItem}>
              <label>Precise Location</label>
              <div
                className={styles.locIcon}
                onClick={handleGetCurrentLocation}
              >
                <FaLocationCrosshairs className={styles.lIcon} />
              </div>
            </div>
          </div>
          <hr />
          <button type="submit" className={styles.uploadBtn}>
            {isUploading ? "Uploading" : "Upload"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Upload;
