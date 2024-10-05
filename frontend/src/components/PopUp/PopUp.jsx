import styles from "./popUp.module.css";
import React from "react";

const PopUp = ({ onConfirm, onCancel, selectedProducts = [] }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                {(selectedProducts.length) > 0 ? (
                    <>
                        <h1>⚠️</h1>
                        <p>Are you sure you want to mark these items as sold?</p>
                        <p>You cannot revert back the changes</p>
                        <hr />
                        <button className={styles.myBtn} onClick={onConfirm}>Confirm</button>
                        <button className={styles.myBtn2} onClick={onCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <p>Please, select a product first.</p>
                        <button className={styles.myBtn} onClick={onCancel}>Ok</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PopUp;
