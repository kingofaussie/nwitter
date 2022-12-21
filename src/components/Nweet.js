import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, updateDoc, deleteDoc} from "firebase/firestore"
import { deleteObject, ref } from 'firebase/storage';
import ImgModal from './ImgModal';
import classNames from 'classnames';
import styles from "./Nweet.module.scss";

const Nweet = ({ nweetObj, isOwner }) => {
  // 이미지 모달
  const [modalActive, setModalActive] = useState(false);
  // 수정 모드 토글
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  // 글 삭제
  const NweetTextRef = doc(dbService,"nweets",`${nweetObj.id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if(ok) {
      //delete nweet
      await deleteDoc(NweetTextRef);
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    } 
   };
   const toggleEditing = () => setEditing((prev) => !prev);
   const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text:newNweet, // newNweet: input에 있는 text
    });
    setEditing(false); // edit하고나서 더이상 edit모드 아니도록 하게한다.
   };
   const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
   };
  return (
    <div className={styles.container}>
      { modalActive !== false && (
        <ImgModal
          photoURL={
            modalActive === "post" ? nweetObj.attachmentUrl : nweetObj.profileImg
          }
          setModalActive={setModalActive}
      />)}
        {editing ? (
            <>
              {isOwner && ( 
                  <>
                    <form onSubmit={onSubmit}>
                      <input 
                        type="text" 
                        placeholder='Edit your nweet' 
                        value={newNweet} 
                        required 
                        onChange={onChange}
                      />
                      <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                  </>
                )}
            </> 
          ) : (
          <div>
            <h1>{nweetObj.text}</h1>          
            {nweetObj.attachmentUrl && (
              <div>
                <img 
                    src={nweetObj.attachmentUrl} 
                    alt={nweetObj.attachmentUrl}
                    width="50px" 
                    height="50px"
                    onClick={() => {
                      setModalActive("post");
                    }}
                  />
              </div>
            )}
            {isOwner && (
                <>
                  <button onClick={onDeleteClick}>Delete Nweet</button>
                  <button onClick={toggleEditing}>Edit Nweet</button>
                </>
            )}
          </div>
        )}
    </div>
  );
};

export default Nweet;

// <h1>{nweetObj.text}</h1> => 포스팅한글
