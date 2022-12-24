import app, { authService, dbService, storageService } from "fbase";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import styles from "./Profile.module.scss";
import Nweet from "components/Nweet";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  const [newDisplayProfile, setNewDisplayProfile] = useState("");
  const [doUpdate, setDoUpdate] = useState(0);

  const navigate = useNavigate();

  // 내 게시글만 불러오기
  const getMyNweets = async () => {
    const q = query( // 원하는 조건으로 데이터를 가져올수있음.
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid), // 조건에 부합하는 글만 가져오도록함.
      orderBy("createdAt", "desc") // 게시글 순서
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  // 프로필창을 들어가면 호출되면서 내 게시글만 보임.
  useEffect(() => {
    getMyNweets();
  }, [doUpdate, getMyNweets]);

  // 로그아웃
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  // 계정삭제
  const onDeleteClick = async (event) => {
    event.preventDefault();
    if (!authService.currentUser) {
      // 본인 계정아닐시, 삭제불가능.
      return;
    }
    const ok = window.confirm(
      // 브라우제에 메세지 확인,취소 버튼으로 구성된 모달창 팝업
      "탈퇴 후 복구 불가능, 정말 탈퇴하시겠습니까?\n작성한 글은 삭제되지 않습니다."
    );
    if (ok) {
      await authService.currentUser.delete(); // currentUser 빼먹어서 메소드호출 안됐음...
      navigate("/");
    }
  };

  // 프로필 닉네임 변경
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  // 프네임, 프사 , 비밀번호 변경시
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!authService.currentUser) {
      return;
    }

    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);


    // 닉네임 
    if(userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, { displayName: newDisplayName });

      querySnapshot.forEach((document) => {
        updateDoc(doc(dbService, `nweets/${document.id}`), {
          displayName: newDisplayName,
        });
      });
    }
      // 프사
      let attachmentUrl = "";
      if (newDisplayProfile !== ""){
        const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const uploadFile = await uploadString(
          fileRef,
          newDisplayProfile,
          "data_url"
        );
        attachmentUrl = await getDownloadURL(uploadFile.ref);

        await updateProfile(authService.currentUser, { photoURL: attachmentUrl });

        querySnapshot.forEach((document) => {
          updateDoc(doc(dbService, `nweets/${document.id}`), {
            displayProfile: attachmentUrl,
          });
        });
      }
      fileInput.current.value = "";
      setNewDisplayProfile("");
      refreshUser();
    };

  // 프로필 사진 첨부
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const file = files[0]; // 첫번째로 등록된 사진을 할당

    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setNewDisplayProfile(result);
      setAttachment(result);
    };
    reader.readAsDataURL(file);
  };

  // 게시글마다 프로필
  const onClearAttachment = () => {
    fileInput.current.value = "";
    setAttachment("");
    setNewDisplayProfile("");
  };
  const fileInput = useRef();

  return (
    <div>
        <div>
          <form onSubmit={onSubmit}>
            {authService.currentUser.photoURL ? (
              // 기본 전제가 프로필 사진이 있는 조건 하에
              newDisplayProfile ? (
                <label
                  htmlFor='attach-file'
                >
                  <img src={newDisplayProfile} />
                </label>
              ) : (
                <label
                  htmlFor="attach-file"
                >
                  <div></div>
                  <img 
                    src={authService.currentUser.photoURL}
                    alt="currentPhoto"
                  />
                </label>
              )
            ) : 
            // 기본 전제가 프로필 사진이 없다. (거짓일 경우 내가 지정해둔 로니콜먼 사진이 기본프로필이됨.)
            newDisplayProfile ? (
              <label 
                htmlFor="attach-file"
              >
                <div>
                  <img
                    src={newDisplayProfile}
                    alt="newPhoto"
                  />
                </div>
              </label>
            ) : (
              <label 
                htmlFor="attach-file"
              >
                <div>
                  <img
                    src='https://mblogthumb-phinf.pstatic.net/MjAxNjExMjhfMTY4/MDAxNDgwMjk5NTg3MDk3.-DIKCA4JqC2khDyAcAaKZ3WDk6HyjW_gxNCV0v7OZ5Ig.lAJtlFPS1nQgFZUX2mvqH7NpikYg18GioJI0Q-V451Mg.JPEG.quadgym/2016-11-28_11-16-51.jpg?type=w800'
                    alt='noPhoto'
                  />
                </div>
              </label>
            )}

            <input
              id="attach-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{
                opacity: 0,
                height: 0,
              }}
              ref={fileInput}
              name="newDisplayProfile"
            />
            <input
              onChange={onChange}
              type="text"
              autoFocus
              placeholder="Display Name"
              value={newDisplayName}
              className="formInput profile"
              maxLength={30}
            />
            <input
              type="submit"
              value="Update Profile"
              className="formBtn profile"
              style={{
                marginTop: 10,
              }}
            />
          </form>
          <button onClick={onDeleteClick}>탈퇴하기</button>
          <button onClick={onLogOutClick}>로그아웃</button>
        </div>
    </div>
  );
};

export default Profile;
