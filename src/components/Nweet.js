import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import ImgModal from "./ImgModal";
import styles from "./Nweet.module.scss";
import classNames from "classnames";
// 클래스네임 중복 참고 https://ji-u.tistory.com/16

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
                : (nweetObj.displayProfile ? nweetObj.displayProfile : 
                  'https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800')
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
        <div className={classNames(styles["nweet-box"])}>
          <div className={styles["nweet-box__user"]}>
          <span>
            {nweetObj.displayProfile ? (
              <img 
                src={nweetObj.displayProfile} 
                onClick={() => {
                  setModalActive("profile");
                }}
              />
            ) : (
              <div className={styles["profile-img"]}>
                <img 
                  src= 'https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800'
                  onClick={() => {
                    setModalActive("profile");
                  }}  
                />
              </div>
            )}
            <span>{`${nweetObj.displayName}`}</span>
          </span>
          </div>
          {/* 자신의 작성 트윗 */}  
          <div>{nweetObj.text}</div>
          {nweetObj.attachmentUrl && (
            <div className={styles["nweet-box__img"]}>
              <img
                src={nweetObj.attachmentUrl}
                onClick={() => {
                  setModalActive("post");
                }}
               />
            </div>
          )}
          <div className={styles["btn-wrapper"]}>
            {isOwner && (
            <>
              <button 
                onClick={onDeleteClick}
                className={classNames(styles["btn--delete"], styles.btn)}
              >Delete Nweet
              </button>

              <button 
                onClick={toggleEditing}
                className={classNames(styles["btn--edit"], styles.btn)}
              >Edit Nweet
              </button>
            </>
            )}
          </div>
        </div>
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