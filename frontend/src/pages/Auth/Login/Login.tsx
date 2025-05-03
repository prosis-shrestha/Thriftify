import { Link, useNavigate } from "react-router-dom";
import styles from "../auth.module.css";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { loginApi } from "../../../utils/api";
import { useThriftContext } from "../../../context/Context";
import { useAlert } from "../../../hooks/useAlert";

const Login = () => {
  const { dispatch } = useThriftContext();
  const nagivate = useNavigate();

  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
  });
  const { alert } = useAlert();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmailData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const { data, status } = await loginApi(emailData);
      if (status === 200) {
        alert("success", "You logged in successfully");
        dispatch({ type: "addUser", payload: data.message });

        if (data.message.isAdmin) {
          nagivate("/admin");
        } else {
          nagivate("/");
        }
      } else {
        throw data.message;
      }
    } catch (error: any) {
      console.log(error);
      alert(
        "error",
        error?.response?.data?.message ?? "Check credentials and try again "
      );
    }
  };
  return (
    <div className={styles.AuthWrapper}>
      <img
        onClick={() => nagivate("/")}
        src="/src/assets/logo.png"
        className={styles.logo}
      />

      <div className={styles.login_main_box}>
        <h1 className={styles.comapany_name}>THRIFTIFY</h1>
        <div className={styles.login_welcome_text}>Login</div>
        <form className={styles.form_wrapper} onSubmit={handleLogin}>
          <div className={styles.auth_input_item}>
            <label>Email</label>
            <input
              onChange={handleChange}
              className={styles.input_element}
              type="email"
              placeholder="Enter  your email address"
              name="email"
            />
          </div>
          <div className={styles.auth_input_item}>
            <label>Password</label>
            <input
              onChange={handleChange}
              className={styles.input_element}
              type="password"
              placeholder="Enter  your  password"
              name="password"
            />
          </div>
          <button className={styles.login_button} type="submit">
            Login
          </button>
          <div className={styles.bottom_other_options}>
            <Link
              to={"/account/verify_email"}
              className={`${styles.no_account_text} ${styles.verify_account_text}`}
            >
              Verify Account Now !!
            </Link>
            <Link to={"/signup"}>
              <p className={styles.no_account_text}> don't have account ? </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
