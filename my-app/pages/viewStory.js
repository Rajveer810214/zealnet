import React, { useEffect, useState } from 'react';
import Stories from 'react-insta-stories';
import styles from '../styles/addstories.module.css';
const ViewStory = ({ stories, selectedUser }) => {
  const [autoplay, setAutoplay] = useState(false);
  const [filteredStories, setFilteredStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [lastShownStoryIndex, setLastShownStoryIndex] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('auth-token') === null) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    // Check if stories array is not empty and has data
    if (stories && stories.length > 0) {
      // Filter stories based on the selected user's name
      const filtered = stories.filter((story) => story.name === selectedUser);
      setFilteredStories(filtered);

      // Reset the active story index when the user changes
      setActiveStoryIndex(lastShownStoryIndex);
    }
  }, [selectedUser, stories, lastShownStoryIndex]);

  const handleAutoplay = () => {
    setAutoplay(true);
  };

  // Function to convert buffer to base64 URL
  const bufferToBase64 = (buffer) => {
    const base64String = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64String}`;
  };

  // Handle the onAllStoriesEnd event to reset the active story index
  const handleAllStoriesEnd = () => {
    // Update the lastShownStoryIndex to the current activeStoryIndex
    setLastShownStoryIndex(activeStoryIndex);

    // Reset the activeStoryIndex to 0
    setActiveStoryIndex(0);
  };

  // Check if filteredStories array is not empty and has data
  if (!filteredStories || filteredStories.length === 0) {
    return <p>No stories available for selected user.</p>;
  }

  const storyItems = filteredStories.map((story, index) => ({
    url: bufferToBase64(story.image.data),
    header: { heading: story.name },
    key: story._id, // Use a unique identifier as the key (replace '_id' with your actual identifier field)
  }));

  return (
    <div>
      <div className={styles.stories}>
        <Stories
          loop
          stories={storyItems}
          // autoPlay
          defaultInterval={1500}
          currentIndex={activeStoryIndex}
          onAllStoriesEnd={handleAllStoriesEnd}
          autoplay={autoplay}
          onStoryEnd={() => setActiveStoryIndex((prevIndex) => prevIndex + 1)}
        />
      </div>
    </div>
  );
};

export default ViewStory;
