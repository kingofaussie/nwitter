import React from 'react';
import styles from "./ImgModal.module.scss";

const ImgModal = ({ photoURL, setModalActive }) => (
      <div
        className={styles.container}
        onClick={() => {
          setModalActive(false);
        }}
      >
        <div className={styles.modal}>
          <img src={photoURL} alt={photoURL} />
        </div>
      </div>
);
export default ImgModal;