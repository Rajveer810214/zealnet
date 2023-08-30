import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { Sort } from '@mui/icons-material';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const sendReceive = () => {
    const router = useRouter();
    const { name } = router.query;

    // console.log(name)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currUser, setCurrUser] = useState('');
    // const [re, setCurrUserEmail] = useState(name);
    const recieverName=name;

    const [chatHistory, setChatHistory] = useState({});
    useEffect(() => {

        if(localStorage.getItem('auth-token')===null){
          router.push('/login');
        }
      }, [])
    useEffect(() => {
        const de = [name, currUser];
        let roomID = de.sort().join('');

        socket.emit('authenticate', roomID);
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            setChatHistory((prevChatHistory) => ({
                ...prevChatHistory,
                [data.sender]: [...(prevChatHistory[data.sender] || []), data],
            }));
            const receiverMessage = data.message;

  // Send notification to the current user when the receiver sends a message
  axios
    .get('http://localhost:8000/api/notify/getplayerid')
    .then((response) => {
      console.log(response.data.success);
      const playerData = response.data.success;
      const matchedPlayer = playerData.find((player) => player.name === recieverName);
console.log(recieverName)
      if (matchedPlayer) {
        sendNotification(matchedPlayer.playerid, receiverMessage,currUser); // Pass the playerid and receiver's message to the sendNotification function
      } else {
        // Handle the case when the email doesn't match any of the player emails
        // You can choose to do something or just leave it empty
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the API call
      console.error('Error fetching player ID:', error);
    });
           
        });

        return () => {
            socket.off('message');
        };
    }, [name, currUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://sidhu-coaching-center.onrender.com/api/auth/getUser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
                });
                const json = await response.json();
                setCurrUser(json.user.name);
                // setCurrUserEmail(json.user.email);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getChatHistory', {
                    params: {
                        currUser,
                        name,
                    },
                });

                // Filter the chat history to show messages with the common person (name)
                setChatHistory((prevChatHistory) => ({
                    ...prevChatHistory,
                    [name]: response.data.success.filter(msg => msg.sender === name || msg.receiver === name),
                }));

                console.log(response.data.success);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [currUser, name]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            // Emit the sendMessage event to the Socket.IO server with sender, receiver, and message
            socket.emit('sendMessage', { sender: currUser, receiver: name, message });
            setMessage('');
            // sendNotification();
           
                
        }
    };
    
    
      const sendNotification = async (playerid,receivermessage,sendername) => {
        // console.log(playerid+"hello")
        try {
          const appId = '016ffeea-943d-48c4-ac55-d391d4165570';
          const apiKey = 'YjY5YjAwZDAtZDM1My00ODM4LWEzYWQtYjU1ZDAzZjFiYWRi';
    
          const notification = {
            app_id: appId,
            include_player_ids: [playerid],
            contents: { en: `${sendername} \n${receivermessage}`  },
          };
    
          const response = await axios.post(
            'https://onesignal.com/api/v1/notifications',
            notification,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${apiKey}`,
              },
            }
          );
    
          console.log('Notification sent:', response.data);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      };
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
      
    return (
        <div>
            <h1  style={{textAlign: 'center'}}>Chat with {name}</h1>
            <div style={{marginBottom:'68px'}}>
            {chatHistory[name] &&
                chatHistory[name].map((msg,index) => (
                    <div
                    key={index}
                    style={{
                        display: "flex",
                        flexDirection: msg.sender === currUser ? "row-reverse" : "row",
                        alignItems: "center",
                        marginTop:'4px'
                    }}
                >
                    {/* <strong>{msg.sender}</strong> */}
                    <span
                        style={{
                            background: msg.sender === currUser ? "#e1f5fe" : "#f0f0f0",
                            padding: "5px",
                            borderRadius: "5px",
                            marginLeft: msg.sender === currUser ? "0" : "5px",
                            marginRight: msg.sender === currUser ? "5px" : "0",
                            maxWidth:'80%',
                                wordWrap: 'break-word',

                        }}
                    >
                            {msg.message}<span style={{fontSize:'10px', padding:'10px',position:'relative', top:'3px', left: '7px'}}>{formatTime(msg.timestamp)}</span>
                    </span>
                </div>
                ))}
                {/* <div style={{marginBottom:'74px'}}></div> */}
            <div >
                {/* <h2>Live Messages:</h2> */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: msg.sender === currUser ? "row-reverse" : "row",
                            alignItems: "center",
                            marginTop:'4px'

                        }}
                    >
                        {/* <strong>{msg.sender}</strong> */}
                        <span
                            style={{
                                background: msg.sender === currUser ? "#e1f5fe" : "#f0f0f0",
                                maxWidth:'86%',
                                wordWrap: 'break-word',
                                padding: "5px",
                                borderRadius: "5px",
                                marginLeft: msg.sender === currUser ? "0" : "5px",
                                marginRight: msg.sender === currUser ? "5px" : "0",
                                // bottom:'33px',
                                // marginBottom:'55px'
                            }}
                        >
                            {msg.message}<span style={{fontSize:'10px', padding:'10px',position:'relative', top:'3px', left: '7px'}}>{formatTime(msg.timestamp)}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* <div style={{marginBottom:'74px'}}></div> */}
            </div>
            <div style={{ display: 'flex',position:'fixed', bottom: '0', left: '0', right: '0', padding: '10px', background: '#fff',zIndex: '999' }}>
    <input
      type="text"
      value={message}
      style={{ padding: '9px', borderRadius: '33px', width: '100%' }}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message..."
    />
    <i
      onClick={handleSendMessage}
      style={{
        position: 'relative',
        top: '0px',
        border: '2px solid black',
        left: '3px',
        padding: '8px',
        borderRadius: '40px',
      }}
      class="fa-solid fa-paper-plane"
    ></i>
  </div>
        </div>
    );
};

export default sendReceive;
