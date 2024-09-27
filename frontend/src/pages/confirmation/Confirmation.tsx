import { useLocation, useNavigate } from "react-router-dom";
import styles from "./confirmation.module.css"
import queryString from 'query-string';
import { useContext, useEffect, useState } from "react";
import { confirmEmailApi, sentConfirmationlinkApi, verfiyUserApi, verifyIfEmailConfirmationTokenIsValidApi } from "../../utils/api";
import { ThriftContext } from "../../context/Context";
import { useAlert } from "../../hooks/useAlert";
const Confirmation = () => {

   const location = useLocation();
   const {dispatch} = useContext(ThriftContext)
  const {alert} = useAlert()
  const queryParams = queryString.parse(location.search);
  const hashValue = queryParams.hash;
  const [ hashCode,setHashCode]=useState<any>("")
  const [email,setEmail] = useState("")
  const [loading,setLoading] =useState(false)
  const navigate =useNavigate()
  const [isExpired,setIsExpired] =useState(false)
  const [invalidLink,setInvalidLink] =useState(false)

  useEffect(()=>{
    if(hashValue){
      setHashCode(hashValue)
    }
  },[hashValue])

  useEffect(()=>{
    if(hashCode){
      handleCheckIfHasIsValid(hashCode)
    }
  },[hashCode])
  const handleCheckIfHasIsValid=async(code:string)=>{
      if(!code)return;
      setLoading(true)
    try {
      const {data,status} =  await verifyIfEmailConfirmationTokenIsValidApi(code)
      if(status===200){
        console.log(data)
        const {email}  = data.message;
        setEmail(email)
        setLoading(false)

      }else{
        throw new Error(data.message)
      }
    } catch (error:any) {
      setLoading(false)
      console.log("error",error?.response?.data?.message)
      if(error?.response?.data?.message==="Link is expired"){
        setIsExpired(true)
      }else{
        setInvalidLink(true)
      }
      alert("error",error?.response?.data?.message)
    }
  }
  
  
  const handleConfirmAccount=async()=>{
    if(email && hashCode){
      try {
        const {status,data } = await confirmEmailApi(email,hashCode);
        if(status===200){
          dispatch({type:"addUser",payload:data.message})
          navigate("/");
        }else{
          throw new Error(data.message)
        }
      } catch (error:any) {
        alert("error",error?.response?.data?.message ?? "something went wrong")
        // console.log(error)
        // alert(error.message)
      }
    }
  }


  const handleResendLink=async()=>{
    console.log(email)
    if(!email)return;
    try {
    const {status} = await   sentConfirmationlinkApi(email)
    if(status===200){
      alert("success","Confirmation link has been sent ")
    }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.confirmation_container}>
        <div className={styles.confirmation_box}>
            <img src="/images/confirm.png" alt="confirm" className={styles.confirm_img} />
            <p>Great!! Confirm your email and unlock the power of Thrift Treasure </p>
            {
              (isExpired || invalidLink) ? <button className={styles.confirmBtn} onClick={()=>navigate("/account/verify_email")}>Verify Now.</button> : <button className={styles.confirmBtn} onClick={handleConfirmAccount}>{loading ? "CONFIRMING":"CONFIRM NOW"}</button>
            }
            {
              isExpired ? <p className={styles.warning}>your email confirmation link has been expired . </p>:""
            }
            {
                      invalidLink ? <p className={styles.warning}>your confirmatin link is invalid . </p>:""
            }

        </div>

      
    </div>
  )
}

export default Confirmation
