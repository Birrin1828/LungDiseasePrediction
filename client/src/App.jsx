import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import Intro from './Intro';
function App() {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ '); 
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      console.log(blob);
      setImageSrc(URL.createObjectURL(blob)); 
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
  return (

    <>    
     <Intro/>
    <AudioPlayer/> 
    </>
  );
}

export default App;
