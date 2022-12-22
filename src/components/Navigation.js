import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";

const Navigation = ({ userObj }) => (
    <nav>
        <ul>
            <li>
                <Link to='/'>Home</Link>
            </li>
            <li>
              {userObj && (
                <Link to='/profile'>
                  <span>
                    {userObj.displayName}의 Profile
                  </span>
                  <span>
                    <img src={userObj.photoURL} alt="Profile 위" />
                  </span>
                </Link>
              )}
            </li>
        </ul>
    </nav>
);
export default Navigation;