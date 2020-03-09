import React, { useState, useEffect } from 'react';
import VideoContextProgressBar from './VideoContextProgressBar';
import Controls from '../Controls';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import VideoContext from 'videocontext';

const VideoContextPreview = (props) => {
  const [ videoContext, setVideoContext ] = useState();
  // const [videoContextCurrentTime, setVideoContextCurrentTime] = useState(0);
  const updateVideoContext = (media) => {
    media.forEach(({ type, sourceStart, start, duration, src }) => {
      const node = videoContext[type](src, sourceStart);
      node.startAt(start);
      node.stopAt(start + duration);
      node.connect(videoContext.destination);
    });
  };

  const handleStop = () => {
    videoContext.pause();
    setVideoContext(vc => {
      vc.currentTime = 0;

      return vc;
    });
  };

  useEffect(() => {
    if (props.canvasRef && props.canvasRef.current) {
      setVideoContext(new VideoContext(props.canvasRef.current));
    }

  }, [ props.canvasRef ]);

  if (videoContext) {
    updateVideoContext(props.playlist);
  }

  const secondsToHHMMSSFormat = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const setCurrentTime = (inPoint) =>{
    console.log('setCurrentTime', inPoint,videoContext.duration)
    if (videoContext) {
      if(inPoint<= videoContext.duration){
        console.log('about to  videoContext.currentTime ')
        videoContext.currentTime = inPoint;
      }
    }
  }

  if(props.newCurrentTime!==0){
    console.log('newCurrentTime', props.newCurrentTime)
    setCurrentTime(props.newCurrentTime)
  }
  // if (videoContext) {
  //   videoContext.registerCallback(VideoContext.EVENTS.UPDATE, () => {
  //     console.log("new frame"); 
  //     console.log(videoContext.currentTime);
  //     setVideoContextCurrentTime(videoContext.currentTime)
  //   });
  //   // ctx.unregisterCallback(updateCallback);
  // }
  // videoContext.currentTime = (offsetX / width) * videoContext.duration;
  // setCurrentTime(3)
  return (
    <>
      <Row
        className={ 'justify-content-center' }
        style={ { backgroundColor: 'black' } }
      >
        <canvas
          ref={ props.canvasRef }
          width={ props.width }
          height={ props.width * 0.5625 }
        />
      </Row>
      <Row
        className={ 'justify-content-center' }
        style={ { backgroundColor: 'lightgrey' } }
      >
        <VideoContextProgressBar videoContext={ videoContext }/>
      </Row>
      <Row style={ { marginTop: '0.4em' } }>
        <Controls
          handlePlay={ videoContext ? () => videoContext.play() : () => console.log('handlePlay') }
          handlePause={ videoContext ? () => videoContext.pause() : () => console.log('handlePause') }
          handleStop={ videoContext ? () => handleStop() : () => console.log('handleStop') }
        />
      </Row>
      <Row className={ 'justify-content-center' }>
        {/* Current Time: {videoContext ? secondsToHHMMSSFormat(videoContextCurrentTime) : '00:00:00'} */}
        Total duration: {videoContext ? secondsToHHMMSSFormat(videoContext.duration) : '00:00:00'}
      </Row>
    </>
  );
};

VideoContextPreview.propTypes = {
  canvasRef: PropTypes.any,
  playlist: PropTypes.array,
  videoContext: PropTypes.any,
  width: PropTypes.any
};

VideoContextPreview.defaultProps = {
  playlist: []
};

export default VideoContextPreview;
