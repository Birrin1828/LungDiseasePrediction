import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

function AudioPlayer() {
  const [audioFile, setAudioFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [graphImage, setGraphImage] = useState(null); 
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); 
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const requestRef = useRef(null);

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    const reader = new FileReader();
    reader.onload = function(event) {
      const audio = new Audio();
      audio.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const sendAudioFile = async () => {
    try {
      const formData = new FormData();
      formData.append('audioFile', audioFile);

      const response = await fetch('http://127.0.0.1:5000/api/audio', {
        method: 'POST',   
        body: formData,
      });

      if (response.ok) {
        console.log('Audio file uploaded successfully.');
        const imageBlob = await response.blob();
        setGraphImage(URL.createObjectURL(imageBlob));
      } else {  
        console.error('Failed to upload audio file.');
      }
    } catch (error) {
      console.error('Error uploading audio file:', error);
    }
  };

  useEffect(() => {
    if (!audioFile) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    audioContextRef.current = audioContext;
    analyserRef.current = analyser; 

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (!audioFile || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const analyser = analyserRef.current;

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgba(255, 255, 255,0.1)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = 'rgb(255, 20, 0)';
      canvasCtx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height );
      canvasCtx.stroke();

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();


    return () => {
      cancelAnimationFrame(requestRef.current);
      analyser.disconnect();
      source.disconnect();
    };
  }, [audioFile]);

  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, value]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== value)); 
    }
  };

  return (
    <div style={{ background: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div style={{ textAlign: 'center', color: 'white' }}>
    <div style={{ marginBottom: '20px' }}>
      {audioFile && (
        <canvas ref={canvasRef} width={600} height={200} style={{ backgroundColor: 'black', marginBottom: '20px' }} />
      )}
    </div>
    <audio controls ref={audioRef} src={audioFile ? URL.createObjectURL(audioFile) : ''} />
    <div>
      {graphImage && <img src={graphImage} alt="Graph" style={{ justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '600px' }} />} 
    </div>
    <div style={{ marginTop: '20px'}}>
      <p style={{ color: 'white', fontSize: "2rem", fontWeight: 'lighter', fontFamily: "sans-serif", marginBottom: '40px' }}>Select an audio file:</p>
      <input className={'button-80'} type="file" accept="audio/*" onChange={handleAudioChange} />
      <p style={{ color: 'white', fontSize: "3rem", fontWeight: 'lighter', fontFamily: "sans-serif", marginBottom: '5px' }}>Upload the audio:</p>
      <div style={{ marginTop: '10rem' }}>
        <button className={'button-80'} onClick={sendAudioFile} id='uploadAudio'>Upload Audio</button> 
      </div>
    </div>
  </div>
</div>

  );
}

export default AudioPlayer;
