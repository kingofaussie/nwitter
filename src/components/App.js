import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./App.module.scss";
import { Reset } from 'styled-reset';
// import { createGlobalStyle } from 'styled-components';


// const GlobalStyles = createGlobalStyle`
//     ${Reset};
// `;

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserObj({
          displayName: user.displayName
            ? user.displayName
            : "무명",
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
          photoURL: user.photoURL
            ? user.photoURL
            : "https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800",
        });
      } else {
        // 로그아웃시 즉시 로그인화면으로 돌려줌
        setIsSignedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
      photoURL: user.photoURL,
    });
  };
  return (
    <div className={styles.app}>
      <Reset />
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        <div className={styles.loading}>
        "Initailizing…"
        </div>
      )}
      <footer>
        &copy; {new Date().getFullYear()}. Spit-Out All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;

// push
