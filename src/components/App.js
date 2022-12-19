import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else { // 로그아웃시 즉시 로그인화면으로 돌려줌
        setUserObj(null);
      }
      setInit(true)
    })
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
  <>
    {init ? (
      <AppRouter 
        refreshUser={refreshUser}
        isLoggedIn={Boolean(userObj)} 
        userObj={userObj}
      />
    ) : (
      'Initailizing…'
      )}
   
  </>
  );
}

export default App;