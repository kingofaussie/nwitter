import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  } from 'firebase/auth';
import { authService } from 'fbase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event) => {
    const {
      target: {name, value},
    } =event;
    console.log();
    if(name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value);
    }
  };
// 위의 방법과 결과는 같지만 다른 방식의 코드
//const [form, setForm] = useState({ email: "", password: "" });
//const onChange = ({ target: { name, value } }) => setForm({ ...form, [name]: value });
  
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
    let data;
    const auth = getAuth();
    if(newAccount) {
      // create account
      data = await createUserWithEmailAndPassword(auth, email, password);
    } else {
      // log in
      data = await signInWithEmailAndPassword(auth, email, password);
    }
    console.log(data);
    } catch (error) {
      setError(error.message); // 에러메세지 
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
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
      <form onSubmit={onSubmit}>
        <input 
          name="email"
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={onChange}
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password" 
          required 
          value={password}  
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Sign in"} 
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign in' : 'Create Account'}
      </span>
      <div>
        <button onClick={onSocialClick} name='google'>Continue with Google</button>
        <button onClick={onSocialClick} name='github'>Continue with Github</button>
      </div>
    </div>
  );
}

export default Auth;