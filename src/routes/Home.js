import React, { useEffect, useState } from "react";
import { dbService } from 'fbase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { async } from '@firebase/util';


const Home = () => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
    const getNweets = async () => {
      const q = query(collection(dbService, "nweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const nweetObj = {
          ...doc.data(),
          id: doc.id,
        }
        setNweets(prev => [nweetObj,...prev]);
      });
    };
    useEffect(() => {
      getNweets();
    }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createdAt: Date.now(),
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
              <div key={nweet.id}>
                <h4>{nweet.nweet}</h4>
              </div>
            ))}
          </div>
      </div>
  );
};
export default Home;


// input 태그의 maxLength 는 글자수 제한