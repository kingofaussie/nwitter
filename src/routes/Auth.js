import React, { useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fbase";
import AuthForm from "components/AuthForm";
import styles from "./Auth.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import googleIcon from "../icons/google-brands.svg";
import githubIcon from "../icons/github-brands.svg";
import classNames from "classnames";

const Auth = () => {
  const [alert, setAlert] = useState("");
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      } else if (name === "github") {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      }
    } catch (error) {
      setAlert(error.message);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <FontAwesomeIcon className={styles["logo-img"]} icon={faVolumeXmark} />
        <span className={styles["logo-text"]}>Silencer</span>
      </div>
      <AuthForm alert={alert} setAlert={setAlert} />
      <div className={styles.social}>
        <img
          src={googleIcon}
          alt='google'
          onClick={onSocialClick}
          name='google'
          className={classNames(styles.google, styles.btn)}
        />
        <img
          src={githubIcon}
          alt='github'
          onClick={onSocialClick}
          name='github'
          className={classNames(styles.github, styles.btn)}
        />
      </div>
    </div>
  );
};

export default Auth;
