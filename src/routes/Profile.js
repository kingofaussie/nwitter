import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import classNames from 'classnames';


const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [proImg, setProImg] = useState("");
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

    const onSubmit = async (event) => {
      event.preventDefault();
      if(userObj.displayName !== newDisplayName) {
        await updateProfile(authService.currentUser, {displayName: 
        newDisplayName });
        console.log(userObj.updateProfile);
      }
        refreshUser();
      
    };
    return (
        <>
        <form onSubmit={onSubmit}>
          <input 
            onChange={onchange}
            type="text" 
            placeholder='Display name' 
            value={newDisplayName}
          />
          <input type="submit" value="Update Profile" />
        </form>
          <button onClick={onDeleteClick}>탈퇴하기</button>
          <button onClick={onLogOutClick}>로그아웃</button>
        </>
    );
};

export default Profile;