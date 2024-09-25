import {
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { ProductType } from "../../utils/Type";
import styles from "./BuyModal.module.css";
import { createTransactionApi } from "../../utils/api";
import { ThriftContext } from "../../context/Context";
import { useParams } from "react-router-dom";
import { useAlert } from "../../hooks/useAlert";
type BuyModalPropsType = {
  children: React.ReactNode;
  product: ProductType;
  quantity: number;
};

export const BuyModal: React.FC<BuyModalPropsType> = ({
  children,
  product,
  quantity,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    state: { user },
  } = useContext(ThriftContext);
  const { id } = useParams();
  const { alert } = useAlert();

  const handleBuy = async () => {
    if (!user?._id || !id) return;

    const trasactionPayload = {
      quantity,
      user: user._id,
      product: id,
      buyer: user._id,
      seller: product.owner._id,
      totalPrice: +product.price * quantity,
      buyerEmail: user.email,
      buyerUsername: user.username,
      sellerEmail: product.owner.email,
    };
    console.log(trasactionPayload);
    try {
      const { status, data } = await createTransactionApi(trasactionPayload);
      if (status === 200) {
        onClose();
        alert("success", "successfull transaction");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    if (user) {
      onOpen();
    } else {
      alert("error", "You need to login first ");
    }
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <div className={styles.buyBox}>
            <div className={styles.productBox}>
              <div className={styles.imageWrapper}>
                <img className="productImage" src={product.image} alt="" />
              </div>
              <div className={styles.productDetails}>
                <h4 className={styles.productName}> {product.name} </h4>
                <p>price : {product.price}</p>
                <p>Quantity : {quantity}</p>

                <p>Total Price : {+product.price * +quantity}</p>
              </div>
            </div>
            {/* <textarea  cols={10} rows={10} placeholder='type message it will go to sellers email'> </textarea> */}
            <button className={styles.confirButton} onClick={handleBuy}>
              {" "}
              Confirm Now{" "}
            </button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
