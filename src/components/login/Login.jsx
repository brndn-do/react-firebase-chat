import { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (event) => {
    if (event.target.files[0]) {
      setAvatar({
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!avatar.file) {
      toast.warn("Please upload an image!");
      return;
    }
    setLoading(true);
    const formData = new FormData(event.target);

    const {username, email, password} = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      })

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      })

      toast.success("Account created! You can log in now!")
    }
    catch(error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const {email, password} = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);  
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <h6>(Try signing in with example below)</h6>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" defaultValue="example@gmail.com"/>
          <input type="text" placeholder="Password" name="password" defaultValue="password"/>
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url ? avatar.url : "/avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="text" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
