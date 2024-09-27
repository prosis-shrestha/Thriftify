import { ChangeEvent, useContext, useState } from "react"
import styles from "./verify.module.css"
import { ThriftContext } from "../../context/Context"
import { verifyAccountApi } from "../../utils/api"
import { useNavigate } from "react-router"
import { useAlert } from "../../hooks/useAlert"
const Verify = () => {

  const {dispatch } = useContext(ThriftContext) 
  const [email,setEmail] =useState("")
  const navigate =useNavigate()
  const {alert} =  useAlert()
  const [ isVerifying,setIsVerfying] = useState(false)
  const handleInputChange=(e:ChangeEvent<HTMLInputElement>)=>{
    setEmail(e.target.value)
  }

    const handleVerifyAccount=async()=>{
      if(!email){
        alert("error","Enter your email")
        return;
      }
      setIsVerfying(true)
      try {
       const {data,status}  = await verifyAccountApi(email);
       if(status===200){
        alert("success","Email verified successfully")
        dispatch({type:"addUser",payload:data.message});
        navigate("/")
        setIsVerfying(false)
       }else{
    
        throw new Error(data.message)
       }
      } catch (error:any) {

        setIsVerfying(false);
        alert("error",error?.response?.data?.message ?? "something went wrong")
      }
    }


  return (
    <div className={styles.verify_container}>
            <img src="/images/verify.png" alt="verify" className={styles.verifyImg} />

        <div className={styles.verify_box}>
            <h2 className={styles.verify_heading}>Verify your email</h2>
            <p className={styles.checkPara}>Check you email we will sent an email that contains a link to verify your email address.</p>
            <input type="text" placeholder="email address to verify" onChange={handleInputChange}/>
            <button className={styles.verifyBtn} onClick={handleVerifyAccount}>{isVerifying ? "VERIFYING...":"VERIFY"} </button>
            <p className={styles.para2}>Did not receive the email ? Check your spam filter or try again with another email.</p>
        </div>

    </div>
  )
}

export default Verify