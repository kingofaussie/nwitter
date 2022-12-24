import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import ImgModal from "./ImgModal";
import styles from "./Nweet.module.scss";


const Nweet = ({ nweetObj, isOwner, }) => {
  // 수정 모드 토글
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  // 이미지 모달
  const [modalActive, setModalActive] = useState(false);

  // 글 삭제
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      //delete nweet
      await deleteDoc(NweetTextRef);
      await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet, // newNweet: input에 있는 text
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
      {modalActive !== false && (
          <ImgModal
            photoURL={
              modalActive === "post"
                ? nweetObj.attachmentUrl
                : nweetObj.displayProfile
            }
            setModalActive={setModalActive}
          />
      )}
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type='text'
                  placeholder='Edit your nweet'
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                <input type='submit' value='Update Nweet' />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <span>
            {nweetObj.displayProfile ? (
              <img 
                src={nweetObj.displayProfile} 
                onClick={() => {
                  setModalActive("profile");
                }}
              />
            ) : (
              <i
                className='far fa-user-circle fa-3x fa fa-quote-left fa-pull-left fa-border'
              >
                
              </i>
            )}
            {/* 자신의 작성 트윗 */}
            <span>{`${nweetObj.displayName}`}</span>
          </span>
          <div>{nweetObj.text}</div>
          {nweetObj.attachmentUrl && (
            <>
              <img
                src={nweetObj.attachmentUrl}
                onClick={() => {
                  setModalActive("post");
                }}
               />
            </>
          )}
         
            {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
            )}
        </>
      )}
    </div>
  );
};

export default Nweet;

// <h1>{nweetObj.text}</h1> => 포스팅한글


          {/* <h1>{nweetObj.text}</h1>
          {nweetObj.attachmentUrl && (
            <div>
              <img
                src={nweetObj.attachmentUrl}
                alt={nweetObj.attachmentUrl}
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
          )} */}