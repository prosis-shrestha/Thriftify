import styles from "./confirmation-email-send.module.css";
import { useNavigate } from "react-router-dom";
import EmailSent from "../../assets/emailSent.png";

const Confirmation_email_send = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.confirmation_email_send_container}>
      <div className={styles.emailSend_Wrapper}>
        <img src={EmailSent} alt="emailSent" className={styles.emailSentImg} />
        <h2>Check your mail</h2>
        <p className={styles.checkPara}>
          Please check your email. we have sent an email that contains a link to
          confirm your email address{" "}
        </p>
        <button className={styles.emailBtn}>RESEND EMAIL</button>
        <button className={styles.emailBtn} onClick={() => navigate("/login")}>
          GO TO LOGIN
        </button>
        <p className={styles.notReceivePara}>
          Did not receive the email? Check your spam filter or try again with
          another email
        </p>
      </div>
    </div>
  );
};

export default Confirmation_email_send;
