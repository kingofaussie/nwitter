import { dbService, storageService } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl ="";
    if(attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    //트윗하기 누르면 nweetObj 형태로 새로운 document 생성하여 nweets 콜렉션에 넣기
    await addDoc(collection(dbService, "nweets"),nweetObj);
    setNweet(""); 
    setAttachment("");
  };
  const onChange = (event) => {
    const { 
      target: {value},
    } = event;
    setNweet(value); 
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event; // event안에서 target안으로 가서 파일을 받아오는 것을 의미
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  }; 
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = null;
  };
  const fileInput = useRef(); //  useRef() hook

  return (
    <form onSubmit={onSubmit}>
      <input 
        value={nweet} 
        onChange={onChange} 
        type="text" 
        placeholder="What's on your mind?" 
        maxLength={120} 
      />
      <input type="file" accept='image/*' onChange={onFileChange} ref={fileInput}/>
      <input type="submit" value="POST" />
      {attachment && (
        <div>
          <img src={attachment} alt="preview" width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;