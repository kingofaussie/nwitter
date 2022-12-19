import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
<<<<<<< Updated upstream
=======
  const [isLoggedIn, setIsLoggedIn] = useState(false);
>>>>>>> Stashed changes
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
<<<<<<< Updated upstream
        setUserObj(user);
      } 
=======
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
>>>>>>> Stashed changes
      setInit(true)
    })
  }, []);
  return (
  <>
<<<<<<< Updated upstream
    {init ? (
    <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/>
    ) : (
      'Initailizing...'
      )}
   
=======
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/>: 'Initailizing...'}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
>>>>>>> Stashed changes
  </>
  );
}

export default App;
