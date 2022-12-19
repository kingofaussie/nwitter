import React, { useState } from "react";
import { dbService } from "fbase";
import { doc, updateDoc, deleteDoc} from "firebase/firestore"

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService,"nweets",`${nweetObj.id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    
    if(ok) {
      //delete nweet
      await deleteDoc(NweetTextRef);
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
    <div>
      {
        editing ? (
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
          <>
            <h4>{nweetObj.text}</h4>
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
