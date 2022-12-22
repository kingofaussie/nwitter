import app, { authService, dbService, } from 'fbase';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import classNames from 'classnames';
import defaultProfileImg from '../images/defaultProfileImg.png';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString, getStorage } from 'firebase/storage';
import styles from "./Profile.module.scss";


const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [proImg, setProImg] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    
    // 내 게시글만 불러오기
    const getMyNweets = async() => {
      const q = query(
        collection(dbService, "nweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt","desc"),
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };

    // 프로필창을 들어가면 호출되면서 내 게시글만 보임.
    useEffect(() => {
      getMyNweets();
    }, []);

    // 로그아웃
    const onLogOutClick = () => {
        authService.signOut();
        navigate('/');
    };

    // 계정삭제
    const onDeleteClick = async (event) => {
      event.preventDefault();
      if (!authService.currentUser) { // 본인 계정아닐시, 삭제불가능.
        return;
      }
      const ok = window.confirm( // 브라우제에 메세지 확인,취소 버튼으로 구성된 모달창 팝업
        "탈퇴 후 복구 불가능, 정말 탈퇴하시겠습니까?\n작성한 글은 삭제되지 않습니다."
      );
      if (ok) {
        await authService.currentUser.delete(); // currentUser 빼먹어서 메소드호출 안됐음...
        navigate("/");
      }
    };

    // 프로필 닉네임 변경
    const onchange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
    }

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
        setProImg(result);
      };

      reader.readAsDataURL(file);
    }
    const onSubmitImg = async (event) => {
      event.preventDefault();
      let newProfileImgUrl = "";

      if (!authService.currentUser) {
        return;
      }

      // 프로필 이미지 변경시
      if(proImg !== '') {
        const storage = getStorage(app);
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(storageRef, proImg, 'data_url');
        newProfileImgUrl = await getDownloadURL(ref(storage, response.ref));
      }
      await updateProfile(authService.currentUser, {
        photoURL: newProfileImgUrl,
      });
      setProImg('');
      refreshUser();
    }
    const onSubmit = async (event) => {
      event.preventDefault();
      if (!authService.currentUser) {
        return;
      }
      // 닉네임 변경시
      if(userObj.displayName !== newDisplayName) {
        await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        });
      }
      setNewDisplayName('');
      refreshUser();
      };
    
    return (
        <div>
          <div>
            <img src={proImg ? proImg : userObj.photoURL} alt="Profile" />
          </div>
          <form onSubmit={onSubmitImg}>
            <div>
                <label htmlFor="profileImg" className={styles["input--img"]}>
                  사진 변경
                </label>
                <input
                  id="profileImg"
                  onChange={onProImgChange}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
            </div>
          </form>

          <form onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="displayName"
                className={classNames(
                  styles["input--name__label"],
                  styles["edit__label"]
                )}
              >
                닉네임
              </label>
            <input 
              onChange={onchange}
              type="text" 
              placeholder='Display name' 
              value={newDisplayName}
            />
            </div>
            <input type="submit" value="Update Profile" />
            
          </form>
            <button onClick={onDeleteClick}>탈퇴하기</button>
            <button onClick={onLogOutClick}>로그아웃</button>
        </div>
    );
};

export default Profile;