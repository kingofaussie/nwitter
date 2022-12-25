import classNames from 'classnames';
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./NweetFactory.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

const NweetFactory = ({ userObj }) => {
  const textareaRef = useRef();
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const resize = useCallback(() => {
    if(!textareaRef.current) {
      return;
    }

    const currentRef = textareaRef.current;
    currentRef.style.height = "52px";
    currentRef.style.height = `${currentRef.scrollHeight + 2}px`;
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (attachment === "" && nweet === "") {
      return;
    }

    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      displayName: userObj.displayName,
      profileImg: userObj.photoURL,
      attachmentUrl,
      like: [],
    };
    //트윗하기 누르면 nweetObj 형태로 새로운 document 생성하여 nweets 콜렉션에 넣기
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    let currenRows = event.target.value.split("\n").length;
    const maxRows = event.target.rows;

    if (currenRows === maxRows) {
      return;
    }

    const {
      target: { value },
    } = event;

    setNweet(value);
    resize();
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
    <div className={styles.container}>
      <div 
        className={styles["text-length-counter"]}
        style={{ color: nweet.length > 150 ? "red" : "inherit" }}  
      >
        {nweet.length} / 150
      </div>
      <form onSubmit={onSubmit} className={styles["input-wrapper"]}>
        <textarea 
          type='text'
          rows={15}
          ref={textareaRef}
          value={nweet}
          onChange={onChange}
          placeholder="spit"
          maxLength={150}
          className={styles["input--text"]}
        />
        <input
          type='file'
          id='uploading'
          accept='image/*'
          onChange={onFileChange}
          ref={fileInput}
          style={{display: "none"}}
        />
        {attachment? (
          <button
            onClick={onClearAttachment}
            className={classNames(styles["btn--delete"], styles.btn)}
          >
            <FontAwesomeIcon icon={faTrashCan} size="lg" />
            
          </button> 
        ) : (
          <label
            htmlFor='uploading'
            className={classNames(styles['input--file'], styles.btn)}
          >
            <FontAwesomeIcon icon={faCamera} size="lg" />
          </label>
        )}
        <label
          htmlFor='submit'
          className={classNames(styles["input--submit"], styles.btn)}
        >
          <FontAwesomeIcon icon={faPaperPlane} size="lg" />
        </label>
        <input id='submit' type='submit' style={{display: "none"}} />
      </form>
      {attachment && (
            <img 
              src={attachment} 
              alt='preview' 
              className={styles["preview-img"]}
            />
        )}
    </div>
  );
};
export default NweetFactory;
