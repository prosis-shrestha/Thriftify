import { Link } from "react-router-dom"
import styles from "./topnav.module.css"
import {CiMobile3} from "react-icons/ci"
import { ThriftContext } from "../../context/Context"
import {useContext} from "react"
const TopNav = () => {

  const {state:{user}} = useContext(ThriftContext)
  return (
    <div className={styles.topNav}>
      <div className={styles.left_info}>
        <CiMobile3/>
        <p>download app</p>
      </div>
      <div className={styles.right_info}>
        <ul className={styles.nav_items}>
            {/* <li><a href="#">mitra beli</a></li>
            <li><a href="#">About beli</a></li>
            <li><a href="#">belibeli care</a></li> */}
            {/* <li><a href="#">promo</a></li> */}
            <Link to={"/upload"}>
            <li>Sell</li>
            </Link>
        </ul>
        {
          user ?
         ""
           : 
          <>
          
        <Link to={"/signup"}>
        <button className={`${styles.nav_btn} ${styles.sign_up_btn}`}>Sign Up</button>
        </Link>
        <Link to={"/login"}>
        <button className={styles.nav_btn}>Login</button>
        </Link>
        </>
        }
        
      </div>
    </div>
  )
}

export default TopNav
