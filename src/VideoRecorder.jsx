import { useRef, useState } from "react";

const VideoRecorder = () => {
    const [ permission, setPermission ] = useState(false);
    const [ stream, setStream ] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const mediaRecorder = useRef(null);
    const liveVideoFeed = useRef(null);
    const mimeType = "video/webm";

    const getCamPermission = async () => {
        if ("MediaRecorder" in window) {
            try {

                 // create audio and video streams separately
                const videoConstraint = {
                    audio: false,
                    video: true
                }
                const audioConstraint = {
                    audio: true
                }

                const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraint);
                const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraint);

                //combine both audio and video streams
                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ]);

                setPermission(true);
                setStream(combinedStream);

                liveVideoFeed.current.srcObject = videoStream;
                console.log(videoStream)
            
            } catch(err) {
                alert(err.message);
            }
            
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localVideoChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localVideoChunks.push(event.data);
        };
        setVideoChunks(localVideoChunks);
    };

    const stopRecording = () => {
        setPermission(false);
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: mimeType });
            const videoUrl = URL.createObjectURL(videoBlob);
            setRecordedVideo(videoUrl);
            setVideoChunks([]);
        };
    };
    

    return ( 
        <div>
            <h2>Video Recorder</h2>
            <main>
                <div className="video-controls">

                    {!permission ? (
                        <button onClick={getCamPermission} type="button">
                            Get Camera
                        </button>

                    ):null}
                    {permission && recordingStatus === "inactive" ? (
                    <button onClick={startRecording} type="button">
                        Start Recording
                    </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                    <button onClick={stopRecording} type="button">
                        Stop Recording
                    </button>
                    ) : null}
                    {permission ? (
                        <button type="button">
                            Record
                        </button>
                    ):null}

                </div>
            </main>
            <div className="video-player">
                {!recordedVideo ? (
                        <video ref={liveVideoFeed} autoPlay className="live-player"></video>
                    ) : null}

                {recordedVideo ? (
					<div className="recorded-player">
						<video className="recorded" src={recordedVideo} controls></video>
						<a download href={recordedVideo}>
							Download Recording
						</a>
					</div>
				) : null}
            </div>
        </div>
     );
}
 
export default VideoRecorder;