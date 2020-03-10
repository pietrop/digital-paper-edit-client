import React, { useState, useEffect,useRef } from "react";
import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
// import TranscriptEditor from "@pietrop/react-transcript-editor";
import ApiWrapper from '../../ApiWrapper/index.js';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import CustomBreadcrumb from '../lib/CustomBreadcrumb/index.js';
import CustomAlert from '../lib/CustomAlert/index.js';
// import Switch from "@material-ui/core/Switch";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Skeleton from "@material-ui/lab/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faSave,
  faBackspace,
  faRocket
} from "@fortawesome/free-solid-svg-icons";
// import CustomNotice from "../Shared/CustomNotice";
// import CustomNavbar from "../Shared/CustomNavbar";
// import CustomFooter from "../Shared/CustomFooter";
// import firebase, { db } from "../../ApiWrapper/Firebase.js";

// import  from '../index.js';
import MediaPlayer from "@pietrop/react-transcript-editor/MediaPlayer";

const diffsListAsHtml = require('stt-align-node').diffsListAsHtml;

function Diff(props) {
  const { projectId, transcriptId } = props.match.params;

  const [projectTitle, setProjectTitle] = useState("");
  const [transcriptTitle, setTranscriptTitle] = useState("");
  const [transcriptData, setTranscriptData] = useState(null);
  const [url, setUrl] = useState(null);
  const [guid, setGuid] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [user, setUser] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [sttTranscript,setSttTranscript] = useState(null);
  const [sttTranscriptOriginal,setSttTranscriptOriginal] = useState(null);
  const [resultHtml,setResultHtml] = useState(null);

  const transcriptEditorRef = React.createRef();

  const audioEl = useRef(null);

//   const videoRef = React.createRef();


  useEffect(() => {
    async function fetchData() {
      const result = await ApiWrapper.getTranscript(projectId, transcriptId);
      setProjectTitle(result.projectTitle);
      setTranscriptTitle(result.transcriptTitle);
      setTranscriptData(result);
      setGuid(result.guid);
      setUrl(result.url);
      const correctPlainText = result.transcript.words.map((word)=>{
          return word.text;
      }).join(' ')
          //   getOriginalSttTranscripts
    try{
              // otherwise say comparison not available on transcripts done before version 1.0.12
        const resultSttOriginalTranscript = await ApiWrapper.getOriginalSttTranscripts(projectId, result.id);
        console.log('resultSttOriginalTranscript', resultSttOriginalTranscript) 
        if(resultSttOriginalTranscript && resultSttOriginalTranscript.transcript){
            setSttTranscript(resultSttOriginalTranscript.transcript);
            const resultHtml = diffsListAsHtml(resultSttOriginalTranscript.transcript, correctPlainText);
            setResultHtml(resultHtml);
            setIsPublished(isPublished);
        }
        else{
          console.info('no transcript stt diff available')
        }
    }catch(e){
        console.error(e)
    }
    }
    fetchData();

    // unmounting component
    return () => {
      // TODO Review this logic 
      console.info('unmounting component', lastSaved)
      // if it has been edited, then save before unmounting the component
     if(lastSaved){
      this.handleBtnSaveTranscript()
     }
    };
  }, []);

  useEffect(() => {
      console.log(audioEl)
    if(audioEl.current !== null){
        audioEl.current.addEventListener("timeupdate", e => {
            console.log(e.target.currentTime)
            // this.setState({
            //   currentTime: e.target.currentTime,
            //   duration: e.target.duration
            // });
          });
    }

    return ()=>{
        console.info('unmounting component 2', lastSaved)
        audioEl.current.removeEventListener("timeupdate", () => {});
    }
  },[audioEl]);

  // TODO: remove this, by computing the json of the diff and then building the html part of the component
  const createMarkup =(html) =>{ 
      return {__html: html}; 
    };

  const handleUserChange = isUserSignedIn => {
    setUser(isUserSignedIn);
  };

  const handleClickedWords = (e)=>{
      if(e.target.classList.contains('word')){
        const startTime = e.target.dataset.start;
        audioEl.current.currentTime = startTime;
        audioEl.current.play();
      }
  }

  return (
    <>
        <>
          <Container  fluid >
            <br />
            <Row>
              <Col xs={12} sm={12} md={12} ld={12} xl={12}>
                <CustomBreadcrumb
                items={ [ {
                  name: 'Projects',
                  link: '/projects'
                },
                {
                  name: `Project: ${ projectTitle }`,
                  link: `/projects/${ projectId }`
                },
                {
                  name: 'Transcripts',
                },
                {
                  name: `${ transcriptTitle }`,
                  link: `/projects/${ projectId }/transcripts/${transcriptId}/correct`
                },
                {
                  name: 'Diff'
                }
                ] }
              />
              </Col>
              <Col xs={12} sm={2} md={2} ld={2} xl={2}>
                {lastSaved ? (
                  <p className={["text-success", "text-center"].join(" ")}>
                    Last saved: {lastSaved}
                  </p>
                ) : null}
              </Col>
              <Col xs={12} sm={2} md={2} ld={2} xl={2}>
              </Col>
              <Col xs={12} sm={1} md={1} ld={1} xl={1}>
              </Col>
            </Row>
            <Row>
                <video 
                 src={url} 
                 className={'videoPreview'} 
                 ref={audioEl} 
                 style={{
                     width:'100%', 
                     height: '300px',
                     backgroundColor: 'black',
                     boxShadow: 'none'
                    }} 
                 controls>
                 </video>
            </Row>
          </Container>
          <Container>
            {sttTranscript ? (
                <>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={2} xl={2}></Col>
                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>    
                        <div onClick={handleClickedWords} dangerouslySetInnerHTML={createMarkup(resultHtml)} />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={2} xl={2}></Col>
                  </Row>
              </>
            ) : (<>
            <br/>
                <CustomAlert
                dismissable={ false }
                variant={ 'warning' }
                heading={ 'No diff transcript available' }
                message={ <p>'No diff transcript available, Diff transcript has been introduced from version <code>1.0.13</code></p> }
              />
              </>
            )}
          </Container>
        </>
    {/*   )} */}
      {/* <CustomFooter /> */}
    </>
  );
}
export default Diff;