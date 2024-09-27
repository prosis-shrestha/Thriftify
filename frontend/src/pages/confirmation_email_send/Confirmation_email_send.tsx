import styles from "./confirmation_email_send.module.css"

const Confirmation_email_send = () => {
  return (
    <div className={styles.confirmation_email_send_container}>
      <div className={styles.emailSend_Wrapper}>
        <img src="/images/emailSent.png" alt="emailSent" className={styles.emailSentImg} />
        <h2>Check your mail</h2>
        <p className={styles.checkPara}>Please check your email. we have sent an email that contains a link to confirm your email address </p>
        <button className={styles.emailBtn}>RESEND EMAIL</button>
        <p className={styles.notReceivePara}>Did not receive the email? Check your spam filter or try again with another email</p>
      </div>
    </div>
  )
}

export default Confirmation_email_send
