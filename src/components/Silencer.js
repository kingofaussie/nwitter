import React, { useCallback, useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import ImgModal from "./ImgModal";
import styles from "./Silencer.module.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// 클래스네임 중복 참고 https://ji-u.tistory.com/16

const Silencer = ({ silencerObj, isOwner }) => {
  const textareaRef = useRef();
  // 수정 모드 토글
  const [editing, setEditing] = useState(false);
  const [newSilencer, setNewSilencer] = useState(silencerObj.text);
  // 이미지 모달
  const [modalActive, setModalActive] = useState(false);

  // 글 삭제
  const SilencerTextRef = doc(dbService, "silencers", `${silencerObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this silencer?");
    if (ok) {
      //delete silencer
      await deleteDoc(SilencerTextRef);
      await deleteObject(ref(storageService, silencerObj.attachmentUrl));
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewSilencer(silencerObj.text);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    await dbService
      .doc(`silencers/${silencerObj.id}`)
      .update("text", newSilencer, "edited", new Date().getTime());
    setEditing((prev) => !prev);
  };

  // 포스팅 글 높이 제한

  const resize = useCallback(() => {
    if (!textareaRef.current) {
      return;
    }

    const currentRef = textareaRef.current;
    currentRef.style.height = "54px";
    currentRef.style.height = `${currentRef.scrollHeight + 4}px`;
  }, []);

  // textarea 입력,줄 제한

  const onChange = (event) => {
    let currentRows = event.target.value.split("\n").length;
    const maxRows = event.target.rows;

    if (currentRows === maxRows) {
      return;
    }

    const {
      target: { value },
    } = event;
    setNewSilencer(value);
    resize();
  };
  return (
    <div className={styles.container}>
      {modalActive !== false && (
        <ImgModal
          photoURL={
            modalActive === "post"
              ? silencerObj.attachmentUrl
              : silencerObj.displayProfile
              ? silencerObj.displayProfile
              : "https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800"
          }
          setModalActive={setModalActive}
        />
      )}
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            className={styles["text-length-counter"]}
            style={{ color: newSilencer.length >= 150 ? "red" : "inherit" }}
          >
            {newSilencer.length} / 150
          </div>
          {isOwner && (
            <form onSubmit={onSubmit}>
              <textarea
                className={styles["edit__text-input"]}
                rows={15}
                ref={textareaRef}
                placeholder='내용을 입력하세요.'
                value={newSilencer}
                required
                maxLength={150}
                onChange={onChange}
                onFocus={resize}
              />
              <div className={styles["edit__btn-wrapper"]}>
                <input
                  id='edit-submit'
                  type='submit'
                  value='완료'
                  className={classNames(styles["edit__submit"])}
                />
                <button
                  className={classNames(styles["edit__cancel"])}
                  onClick={toggleEditing}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className={classNames(styles["silencer-box"])}>
          <div className={styles["responsive-wrapper"]}>
            <div className={styles["silencer-box__user"]}>
              <span
                className={styles["profile-img"]}
                onClick={() => {
                  setModalActive("profile");
                }}
              >
                {silencerObj.displayProfile ? (
                  <img src={silencerObj.displayProfile} alt='profile' />
                ) : (
                  <div className={styles["profile-img"]}>
                    <img src='https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800' />
                  </div>
                )}
              </span>
              <span className={styles["username"]}>
                {`${silencerObj.displayName}`}
              </span>
            </div>
            {/* 자신의 작성 트윗 */}
            <div className={styles["middle-section-wrapper"]}>
              <div className={styles["silencer-box__text"]}>
                {silencerObj.text}
              </div>
              <div className={styles["silencer-box__date"]}>
                {`${new Date(silencerObj.createdAt).getFullYear()}/${
                  new Date(silencerObj.createdAt).getMonth() + 1 < 10 ? "0" : ""
                }${new Date(silencerObj.createdAt).getMonth() + 1}/${
                  new Date(silencerObj.createdAt).getDate() < 10 ? "0" : ""
                }${new Date(silencerObj.createdAt).getDate()} ${
                  new Date(silencerObj.createdAt).getHours() < 10 ? "0" : ""
                }${new Date(silencerObj.createdAt).getHours()}:${
                  new Date(silencerObj.createdAt).getMinutes() < 10 ? "0" : ""
                }${new Date(silencerObj.createdAt).getMinutes()}`}
                {silencerObj.edited && " (수정됨)"}
              </div>
            </div>
          </div>
          {silencerObj.attachmentUrl && (
            <div className={styles["silencer-box__img"]}>
              <img
                src={silencerObj.attachmentUrl}
                alt={silencerObj.attachmentUrl}
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
                >
                  <FontAwesomeIcon icon={faTrashCan} size='lg' />
                </button>

                <button
                  onClick={toggleEditing}
                  className={classNames(styles["btn--edit"], styles.btn)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} size='lg' />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Silencer;
