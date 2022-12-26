import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import styles from "./AuthForm.module.scss";
import classNames from "classnames";

const AuthForm = ({ alert, setAlert }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [findPw, setFindPw] = useState(false);
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    console.log();
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  // 위의 방법과 결과는 같지만 다른 방식의 코드
  //const [form, setForm] = useState({ email: "", password: "" });
  //const onChange = ({ target: { name, value } }) => setForm({ ...form, [name]: value });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      if (newAccount) {
        // create account
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (!newAccount && !findPw) {
        // log in
        await signInWithEmailAndPassword(auth, email, password);
      } else if (findPw) {
        await sendPasswordResetEmail(email).then(
          setAlert("메일이 발송되었습니다.")
        );
      }
    } catch (error) {
      setAlert(error.message); // 에러메세지
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
    setFindPw(false);
  };

  const toggleFindPw = () => {
    setFindPw((prev) => !prev);
    setNewAccount(false);
  };
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          value={email}
          onChange={onChange}
          autoComplete='username'
          className={classNames(styles.email, styles["input--text"])}
        />
        {!findPw && (
          <input
            name='password'
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={onChange}
            autoComplete='current-password'
            className={classNames(styles.password, styles["input--text"])}
          />
        )}
        <div className={styles.alert}>{alert}</div>

        <div className={styles["btn-group"]}>
          <input
            className={classNames(styles.submit, styles.btn)}
            type='submit'
            value={
              findPw
                ? "재설정 메일 발송"
                : newAccount
                ? "위 정보로 가입하기"
                : "로그인"
            }
          />
          <span
            onClick={toggleAccount}
            className={classNames(styles.create, styles.btn)}
          >
            {newAccount ? "기존 계정으로 로그인" : "새 계정 만들기"}
          </span>
          <span onClick={toggleFindPw} className={classNames(styles.btn)}>
            {findPw ? "돌아가기" : "비밀번호 재설정"}
          </span>
        </div>
      </form>
    </div>
  );
};
{
  /* <input
          type='submit'
          value={newAccount ? "Create Account" : "Sign in"}
        />
        {error && <span>{error}</span>} */
}

export default AuthForm;
