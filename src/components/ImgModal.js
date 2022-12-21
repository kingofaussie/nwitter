import React from 'react';
import styles from "./ImgModal.module.scss";

const ImgModal = ({ photoURL, setModalActive }) => (
      <div
        onClick={() => {
          setModalActive(false);
        }}
      >
        <div>
          <img src={photoURL} alt={photoURL} />
        </div>
      </div>
);
export default ImgModal;