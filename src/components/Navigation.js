import classNames from "classnames";
import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";

const Navigation = ({ userObj }) => (
  <ul className={styles.nav}>
    <li className={classNames(styles["nav__item"], styles["nav__item--home"])}>
      <Link to='/' className={styles.Link}>
        <span className={styles["logo-text"]}>Spit-out</span>
      </Link>
    </li>

    <li
      className={classNames(styles["nav__item"], styles["nav__item--profile"])}
    >
      {userObj && (
        <Link to='/profile' className={styles.Link}>
          <span className={styles["profile-text"]}>
            {userObj.displayName}의 Profile
          </span>
          <span className={styles["profile-img"]}>
            <img
              src={userObj.photoURL}
              alt='https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800'
            />
          </span>
        </Link>
      )}
    </li>
  </ul>
);
export default Navigation;
