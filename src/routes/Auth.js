import React from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  } from 'firebase/auth';
import { authService } from 'fbase';
import AuthForm from 'components/AuthForm';

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target:{ name },
    } = event;
    let provider;
    try {
      if(name === "google" ) {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService , provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      } else if(name ==="github") {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
      }
    } catch(error) {
      console.log(error);
    }
  };
  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name='google'>
          Continue with Google
        </button>
        <button onClick={onSocialClick} name='github'>
          Continue with Github
        </button>
      </div>
    </div>
  );
}

export default Auth;