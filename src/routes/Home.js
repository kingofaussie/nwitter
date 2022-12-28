import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Silencer from "components/Silencer";
import { onAuthStateChanged } from "firebase/auth";
import SilencerF from "components/SilencerF";

const Home = ({ userObj }) => {
  const [silencers, setSilencers] = useState([]);
  console.log(userObj);
  useEffect(() => {
    const q = query(
      collection(dbService, "silencers"),
      orderBy("createdAt", "desc")
    );
    const unSubscribe = onSnapshot(q, (snapshot) => {
      const silencerArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSilencers(silencerArr);
    });

    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        unSubscribe();
      }
    });
  }, []);

  return (
    <div>
      <SilencerF userObj={userObj} />
      <div>
        {silencers.map((silencer) => (
          <Silencer
            key={silencer.id}
            silencerObj={silencer}
            isOwner={silencer.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;

// input 태그의 maxLength 는 글자수 제한
