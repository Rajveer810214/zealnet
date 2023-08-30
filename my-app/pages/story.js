  import React, { useState,useEffect } from 'react';
  import Stories, { WithSeeMore } from 'react-insta-stories';
  import Imageupload_new from './imageupload_new';
  import styles from '../styles/addstories.module.css';


  const Story = () => {
    const [stories, setStories] = useState([
    ]);
    useEffect(() => {

      if(localStorage.getItem('auth-token')===null){
        router.push('/login');
      }
    }, [])

    const handleImageUpload = (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        const newStory = {
          url: imageUrl,
          type: "image"
        };
        setStories([...stories, newStory]);
      };

      if (file) {
        
     
        reader.readAsDataURL(file); // This will read the selected image file
      }
    };
    if(stories.length==0){
   return <>   <Imageupload_new onUpload={handleImageUpload} />

       <h2 style={{textAlign: 'center'}}>You does not upload any story</h2>
       </>
    } 
    return (
      <div>
        <Imageupload_new onUpload={handleImageUpload} />
        <div className={styles.stories} style={{marginTop: '10px'}}>
        <div><h2 style={{textAlign: 'center'}}>You can view your story</h2>
        </div>

        <Stories
          stories={stories}
          width={432}
          seeMore={<WithSeeMore>Swipe up to see more</WithSeeMore>}
          header={{ heading: 'Username', subheading: 'Posted 5m ago', profileImage: 'https://placeimg.com/100/100/people' }}
          storyContentStyles={{ backgroundColor: '#333', borderRadius: 16, color: 'white', padding: 20 }}
          loop={true}
        />
        </div>
      </div>
    );
  };

  export default Story;
