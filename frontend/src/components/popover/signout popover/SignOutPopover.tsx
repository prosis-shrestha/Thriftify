import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Portal,
} from "@chakra-ui/react";
import styles from "./SignOutPopover.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { logOut } from "../../../utils/api";
import { ThriftContext } from "../../../context/Context";
import { useAlert } from "../../../hooks/useAlert";
type SignOutPopoverType = {
  children: React.ReactNode;
};
const SignOutPopover: React.FC<SignOutPopoverType> = ({ children }) => {
  const {
    state: { user },
    dispatch,
  } = useContext(ThriftContext);
  const navigate = useNavigate();
  const { alert } = useAlert();
  const handleLogout = async () => {
    console.log("state", user);
    try {
      const { status } = await logOut();
      if (status === 200) {
        alert("success", "successfully logged out");
        dispatch({ type: "removeUser" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger>{children}</PopoverTrigger>
        <Portal>
          <PopoverContent border={"none"}>
            <PopoverArrow />

            {/* <PopoverCloseButton /> */}
            <div className={styles.popBox}>
              <Link to={"/profile"} className={styles.account}>
                {user?.username}
                <span className={styles.link}>My Account</span>
              </Link>
              {user?.isAdmin === false && (
                <Link to={"/myProducts"} className={styles.myTransactions}>
                  My Products
                </Link>
              )}
              {/* <Link to={"/transactions"} className={styles.myTransactions}>
                My Transactions
              </Link> */}
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default SignOutPopover;
