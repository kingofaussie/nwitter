import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate('/');
    };
    const onchange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
    }
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
    useEffect(() => {
      getMyNweets();
    }, []);
    const onSubmit = async (event) => {
      event.preventDefault();
      if(userObj.displayName !== newDisplayName) {
        await updateProfile(userObj, { displayName: newDisplayName });
      }
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
          <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;