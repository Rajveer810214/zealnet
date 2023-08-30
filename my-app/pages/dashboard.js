import React, { useState, useEffect,useRef } from 'react';
import styles from '../styles/dash.module.css';
import axios from 'axios';
import Image from 'next/image';
import ViewStory from './viewStory';
import Router, { useRouter } from 'next/router';
import Sidebar from "./Sidebar"

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerid,setPlayerid]=useState('');
  const [currUserEmail, setCurrUserEmail] = useState('');
  const [currUser, setCurrUser] = useState('');
  const loadedUserImages = useRef({});

  const router = useRouter(); 
  useEffect(() => {

    if(localStorage.getItem('auth-token')===null){
      router.push('/login');
    }
  }, [])


  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('https://sidhu-coaching-center.onrender.com/api/auth/getUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
            });
            const json = await response.json();
            setCurrUserEmail(json.user.email);
            setCurrUser(json.user.name);
            console.log(json)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchData();
}, []);

  useEffect(() => {
    // Fetch stories data from the backend API and set it in the state
    axios
      .get('http://localhost:8000/api/query/getimageall',{
        headers:{'auth-token':localStorage.getItem('auth-token')}
      })
      .then(response => {
        setStories(response.data);
        setIsLoading(false); // Set loading state to false after data is fetched
        console.log(response.data);
      })
      .catch(error => {
        setIsLoading(false); // Set loading state to false if there's an error
        console.error('Error fetching stories:', error);
      });
  }, []);

  const handleUserCircleClick = (name) => {
    setSelectedUser(name);
    console.log(name);
  };

  // Create an object to store unique users based on their names
  const uniqueUsers = {};

  stories.forEach(story => {
    const { name, email } = story;
    if (!uniqueUsers[name]) {
      uniqueUsers[name] = { email };
    } else {
      // If user name already exists, check if the email is different
      if (uniqueUsers[name].email !== email) {
        // Treat as different users if emails are different
        uniqueUsers[name + email] = { email };
      }
    }
  });

  const Addstory = () => {
    router.push('/story');
  }

  const uniqueUsernames = Object.keys(uniqueUsers);
  useEffect(() => {
    const sendNotificationsToBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/notify/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currUserEmail, playerid: playerid,name:currUser }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    };
    
    sendNotificationsToBackend();
  }, [currUserEmail, playerid]);
  useEffect(() => {
    console.log("started");
    // Load the OneSignal SDK
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId: "016ffeea-943d-48c4-ac55-d391d4165570",
        safari_web_id: "web.onesignal.auto.3d5e9a66-9429-4fce-a7e3-61aa58d6c253",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        console.log("OneSignal initialized.");
  
        // Check if push notifications are enabled for the user
        window.OneSignal.isPushNotificationsEnabled(function (isEnabled) {
          if (isEnabled) {
            // User has subscribed
            window.OneSignal.getUserId(function (userId) {
                setPlayerid(userId)
              console.log('Player ID of the subscribed user is: ' + userId);
            //   console.log(name);
            });
          } else {
            // User has not subscribed
            console.log('User has not subscribed to push notifications.');
          }
        });
  
        // Subscribe to 'notificationOpened' event
    });
});
}, []);
const handleUserCircleIntersection = (name) => {
  loadedUserImages.current[name] = true;
};

  return (
    <div>
      <div className='addfriend' style={{ display: 'flex' }}>
        <div>
          <Image src="/story-plus.svg" onClick={Addstory} alt="Add Friend" width={100} height={100} className={styles.usericons} loading="lazy" />
          <p style={{ textAlign: 'center' }} className={styles.namestory}>Add Story</p>
          <Sidebar />
        </div>

        {isLoading ? ( // Conditional rendering for loading state
        <div>Loading...</div>
      ) : (
        uniqueUsernames.map((name) => (
          <div key={name} onClick={() => handleUserCircleClick(name)}>
            {loadedUserImages.current[name] ? (
              <Image
                src="/user-circle.svg"
                alt={`User ${uniqueUsers[name].email}`}
                width={100}
                height={100}
                className={styles.usericons}
                loading="lazy" // Lazy loading attribute
                ref={(element) => handleUserCircleIntersection(name)}
              />
            ) : (
              <Image
                src="/user-circle.svg"
                alt={`User ${uniqueUsers[name].email}`}
                width={100}
                height={100}
                className={styles.usericons}
                loading="lazy" // Lazy loading attribute
                ref={(element) => handleUserCircleIntersection(name)}
              />
             
            )}
            <p style={{ textAlign: 'center' }} className={styles.name}>
              {name}
            </p> {/* Display the name below the user circle */}
          </div>
        ))
      )}
      </div>

      {selectedUser && <ViewStory stories={stories} selectedUser={selectedUser} />}
    </div>
  );
};

export default Dashboard;
