import React, { useState } from "react";
import { dbService } from 'fbase';
import { collection, addDoc } from 'firebase/firestore';

const Home = () => {
    const[nweet, setNweet] = useState("");
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
  return (
      <div>
          <form onSubmit={onSubmit}>
              <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} /> 
              <input type="submit" value="POST" />
          </form>
      </div>
  );
};
export default Home;


// input 태그의 maxLength 는 글자수 제한