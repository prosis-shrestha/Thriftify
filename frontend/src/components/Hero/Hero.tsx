import styles from "./hero.module.css";
import { Link } from "react-scroll";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBg}></div>
      <img src="/src/assets/hero.png" className={styles.animation} />
      <div className={styles.hero_left}>
        <h1 className={styles.hero_heading}>THRIFTIFY</h1>
        <div className={styles.para}>
          <p>Explore Preloved Pieces from others and Share yours too.</p>
          <p>Trends, Fast fashion, Eco-Friendly and more.</p>
          <p>Join the Thrift revolution</p>
        </div>
        <Link
          to={"scrollProduct"}
          smooth={true}
          duration={500}
          className={styles.hero_btn}
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default Hero;
