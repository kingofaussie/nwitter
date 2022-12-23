import app, { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import classNames from "classnames";
import defaultProfileImg from "images/defaultProfileImg.jpg";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadString,
  getStorage,
} from "firebase/storage";
import styles from "./Profile.module.scss";
import Nweet from "components/Nweet";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  const [myNs, setMyNs] = useState([]);
  const [doUpdate, setDoUpdate] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  // 내 게시글만 불러오기
  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
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

    if (userObj.displayName !== newDisplayName || attachment !== "") {
      let newProfileImgUrl = "";

      // 변경중에는 버튼이 비활성화되도록 useState 리액트 훅을 이용함.
      setUploading(true);

      // 닉네임 변경사항이 있을 경우
      if (newDisplayName !== "") {
        myNs.forEach((nweet) => {
          if (nweet.displayName !== newDisplayName) {
            dbService
              .doc(`nweets/${nweet.id}`)
              .update("displayName", newDisplayName);
          }
        });
      }

      //프사 변경사항
      if (attachment !== "") {
        if (userObj.photoURL !== defaultProfileImg) {
          await storageService
            .refFromURL(userObj.photoURL)
            .delete()
            .catch((error) => {
              console.log(error.message);
            });
        }
        const storage = getStorage(app);

        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);

        const response = await uploadString(storageRef, attachment, "data_url");

        newProfileImgUrl = await getDownloadURL(ref(storage, response.ref));

        // 작성한 모든글의 프사 변경

        myNs.forEach((nweet) => {
          if (nweet.profileImg !== newProfileImgUrl) {
            dbService
              .doc(`nweets/${nweet.id}`)
              .update("profileImg", newProfileImgUrl);
          }
        });
      }

      // 반영
      await userObj
        .updateProfile(authService.currentUser, {
          photoURL:
            newProfileImgUrl !== "" ? newProfileImgUrl : userObj.photoURL,
          displayName:
            newDisplayName !== "" ? newDisplayName : userObj.displayName,
        })
        .setUploading(false);

      // 리프레시
      refreshUser();
      setDoUpdate((prev) => prev + 1);
    }
  };

  // 프로필 사진 첨부
  const onProImgChange = (event) => {
    const {
      target: { files },
    } = event;

    const file = files[0]; // 첫번째로 등록된 사진을 할당

    const reader = new FileReader();

    reader.onloadend = (event) => {
      const {
        target: { result },
      } = event;
      setAttachment(result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div>
        <img src={attachment ? attachment : userObj.photoURL} alt='Profile' />
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor='profileImg' className={styles["input--img"]}>
            사진 변경
          </label>
          <input
            id='profileImg'
            onChange={onProImgChange}
            type='file'
            accept='image/*'
            style={{ display: "none" }}
          />
        </div>
        <div>
          <label
            htmlFor='displayName'
            className={classNames(
              styles["input--name__label"],
              styles["edit__label"]
            )}
          >
            닉네임
          </label>
          <input
            id='displayName'
            onChange={onChange}
            type='text'
            placeholder='Display name'
            value={newDisplayName}
          />
        </div>
        <div>
          <input
            id='submit'
            type='submit'
            value='프로필 업데이트'
            style={{ display: uploading ? "none" : "inline" }}
          />

          <div>{alert}</div>
        </div>
      </form>
      <button onClick={onDeleteClick}>탈퇴하기</button>
      <button onClick={onLogOutClick}>로그아웃</button>
    </div>
  );
};

export default Profile;
