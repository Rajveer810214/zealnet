// Message.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/addFriend.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Message = () => {
  const router = useRouter();
  const { name } = router.query;

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchAllfriends = async () => {
      if(localStorage.getItem('auth-token')===null){
        router.push('/login');
      }
      else{
      const response = await axios.get('http://localhost:8000/api/auth/getallfriends',
      {headers : {  'auth-token': localStorage.getItem('auth-token') },
    })
console.log(response.data)
      setFriends(response.data.addfriend);
    };
  }

    fetchAllfriends();
  }, []);
if(!friends){
  return <div style={{textAlign: 'center', fontSize: '26px'}}>You can not send message because you doesnt made any friend</div>
}
  return (
    <div>
      {friends && friends.map((addFriend) => (
        <div key={addFriend.id}>
          <p className={styles.addFriend}>
            {addFriend.name}
            <Link href={`/sendReciev?name=${addFriend.name}`} passHref>
              <i className="fa-solid fa-comments" style={{ float: 'right' }}></i>
            </Link>
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Message;
