import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const imageupload_new = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  useEffect(() => {

    if(localStorage.getItem('auth-token')===null){
      router.push('/login');
    }
  }, [])
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
  
    try {
  
      const response = await axios.post('http://localhost:8000/api/query/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': localStorage.getItem('auth-token'),
        },
      });
  
      // The response will contain the user's data as an object with the key 'user'
      const user = response.data?.user;
      // console.log(response);
      const userEmail = user?.email;
      
      onUpload(image, userEmail);
            } catch (error) {
            }
  };
  

  return (
    <div>
      <h2>Image Upload</h2>
      {/* <ToastContainer /> */}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="image">Select an image:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default imageupload_new;
