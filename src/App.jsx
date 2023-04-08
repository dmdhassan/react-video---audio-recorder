import './App.css';
import { useState, useRef } from 'react';
import AudioRecorder from './AudioRecorder';
import VideoRecorder from './VideoRecorder';


function App() {
  const [ recordOption, setRecordOption] = useState("video");
 
  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type)
    }
  }

  return (
    <div className="App">
      <h1>React Media Recorder</h1>
      <div className="button-flex">
        <button onClick={toggleRecordOption("video")}>
          Record Video
        </button>
        <button onClick={toggleRecordOption("audio")}>
          Record Audio
        </button>
      </div>
      <div className=''>
          {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
      </div>
    </div>
  )
}

export default App
