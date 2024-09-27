import styles from "./allProductCard.module.css"

const AllProductCard = () => {
  return (
    <div className={styles.productItem}>
    <div className={styles.imgWrapper}>
        <img className={styles.productImg} src="/images/jeans_pant.png" alt="productImg" />
    </div>
    <div className={styles.productInfo}>
        <div className={styles.productName}>
            <p className={styles.name}>pant hot</p>
            <p className={styles.desc}>this is summer pant for boys</p>
        </div>
        <div className={styles.productPrice}>
            <h2>Rs. 1299</h2>

        </div>
    </div>
     </div>
  )
}

export default AllProductCard
