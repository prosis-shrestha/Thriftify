import {
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styles from "./SearchModal.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { searchProductByInputApi } from "../../../utils/api";

type SearchModalPropsType = {
  children: React.ReactNode;
  full?: boolean | undefined;
};
const SearchModal: React.FC<SearchModalPropsType> = ({ children, full }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchedProduct, setSearchedProduct] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    handleSearachProductByInput();
  }, [searchInput]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearachProductByInput = async () => {
    try {
      const { status, data } = await searchProductByInputApi(searchInput);
      if (status === 200) {
        setSearchedProduct(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(searchedProduct);
  return (
    <>
      <span onClick={onOpen} style={{ width: full ? "100%" : "32%" }}>
        {children}
      </span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              onChange={handleInputChange}
              placeholder="Search in Thriftify"
              value={searchInput}
            />
            {searchInput.length > 0 &&
              searchedProduct.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  className={styles.searchBox}
                >
                  <img src={product.image} alt="" />
                  <div>
                    <h4>{product.name}</h4>
                    <p>Rs {product.price}</p>
                    <p>In stock {product.quantity}</p>
                  </div>
                </Link>
              ))}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SearchModal;
