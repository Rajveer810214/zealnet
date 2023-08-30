import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/addFriend.module.css';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';


const Addfriend = () => {
  const router=useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
      if(localStorage.getItem('auth-token')===null){
        router.push('/login');
      }
    else{
    const fetchAllUsers = async () => {
      const response = await axios.get('http://localhost:8000/api/auth/getallusers');
      setAllUsers(response.data.users);
    };

    const fetchAllFriends = async () => {
      const response = await axios.get('http://localhost:8000/api/auth/getallfriends', {
        headers: { 'auth-token': localStorage.getItem('auth-token') },
      });
      setFriends(response.data.addfriend);
    };
    fetchAllUsers();
    fetchAllFriends();
  }
  }, []);

  const handleAddFriend = async (name, email) => {
    console.log(name, email);
    try {
      // Send the POST request to the backend
      console.log(name);
      const response = await fetch('http://localhost:8000/api/auth/addfriend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
        body: JSON.stringify({ email: email, name: name }),
      });
      toast.error('Friend Added Successfully', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      // Handle the response from the backend
    } catch (error) {
      toast.error('Error Occured!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  // Filter out friends from allUsers to get non-friends
  const nonFriends = allUsers.filter(
    (user) => !friends.some((friend) => friend.email === user.email)
  );

  return (
    <div>
      {nonFriends.map((addFriend) => (
        <div key={addFriend.id}>
          <p className={styles.addFriend}>
            {addFriend.name}{' '}
            <i
              className="fa-sharp fa-solid fa-user-plus"
              style={{ float: 'right' }}
              onClick={() => handleAddFriend(addFriend.name, addFriend.email)}
            ></i>
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Addfriend;
