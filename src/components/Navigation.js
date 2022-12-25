import classNames from "classnames";
import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";

const Navigation = ({ userObj }) => (
  <ul className ={styles.nav}>
      <li
        className={classNames(styles["nav__item"], styles["nav__item--home"])}
      >
        <Link to='/' className={styles.Link}>
          <span className={styles["logo-text"]}>Spit</span>
        </Link>
      </li>

      <li
        className={classNames(
          styles['nav__item'],
          styles['nav__item--profile']
        )}
      >
        {userObj && (
          <Link to='/profile' className={styles.Link}>
            <span className={styles["profile-text"]}>
              {userObj.displayName}의 Profile
            </span>
            <span className={styles["profile-img"]}>
            <img
              src={userObj.photoURL}
              alt='Profile 위'
            />
            </span>
          </Link>
        )}
      </li>
  </ul>
);
export default Navigation;
