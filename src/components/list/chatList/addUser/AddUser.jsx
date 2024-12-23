import { useState } from "react";
import "./addUser.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const handleSearch = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "/avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
