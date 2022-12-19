import React, { useEffect, useState } from "react";
import { dbService } from 'fbase';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { async } from '@firebase/util';
import Nweet from 'components/Nweet';


const Home = ({ userObj }) => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
    useEffect(() => {
      const q = query(
        collection(dbService, "nweets"),
        orderBy("createdAt","desc")
      );
      onSnapshot(q, (snapshot) => {
        const nweetArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArr);
      });
    }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (event) => {
    const { 
      target: {value},
    } = event;
    setNweet(value); 
  };
  console.log(nweets);
  return (
      <div>
          <form onSubmit={onSubmit}>
              <input 
                value={nweet} 
                onChange={onChange} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120} 
              /> 
              <input type="submit" value="POST" />
          </form>
          <div>
            {nweets.map((nweet) => (
              <Nweet
                key={nweet.id}
                nweetObj={nweet}
                isOwner={nweet.creatorId === userObj.uid}
              />
            ))}
          </div>
      </div>
  );
}; 
export default Home;


// input 태그의 maxLength 는 글자수 제한