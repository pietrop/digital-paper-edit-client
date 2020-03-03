import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faTag,
  faUser,
  faSearch,
  faFileAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import colourStyles from '../LabelsList/select-color-styles.js';
import speakersColorStyles from './select-speakers-color-styles.js';

class SearchBarTranscripts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingFilterOptions: false,
      showParagraphsMatchingSearch: false,
      showTextSearchPreferences: false,
      showSpeakersSearchPreferences: false,
      showLabelsSearchPreferences: false,
      selectedOptionTranscriptSearch: false
    };
  }

  handleSpeakersSearchChange = selectedOptionSpeakerSearch => {
    this.props.handleSpeakersSearchChange(selectedOptionSpeakerSearch);
    // this.setState({ selectedOptionSpeakerSearch });
  };

   handleLabelsSearchChange = selectedOptionLabelSearch => {
     this.props.handleLabelsSearchChange(selectedOptionLabelSearch);
    //  this.setState({ selectedOptionLabelSearch });
   };

   handleShowParagraphsMatchingSearch = () => {
     this.setState((state) => {
      this.props.handleShowParagraphsMatchingSearch( !state.showParagraphsMatchingSearch);
       return { showParagraphsMatchingSearch: !state.showParagraphsMatchingSearch };
     }, () => {
      
     });
   }

   handleTranscriptSearchChange = selectedOptionTranscriptSearch => {
    this.props.handleTranscriptSearchChange(selectedOptionTranscriptSearch);
    this.setState({ selectedOptionTranscriptSearch });
  };

   handleFilterResults = ()=>{
    this.props.handleFilterResults()
    this.setState((state) => {
      if(!state.isShowingFilterOptions){
        this.props.handleShowParagraphsMatchingSearch( true );
        return {
          isShowingFilterOptions: true,
          showTextSearchPreferences: true,
          showSpeakersSearchPreferences: true,
          showLabelsSearchPreferences: true,
          // defaults to show only matching paragraph to be checked
          showParagraphsMatchingSearch: true,
          selectedOptionTranscriptSearch: true
        };
      }else{
        this.props.handleShowParagraphsMatchingSearch( false );
        return {
          isShowingFilterOptions: false,
          showTextSearchPreferences: false,
          showSpeakersSearchPreferences: false,
          showLabelsSearchPreferences: false,
          // remove preferences for showing matching paragraphjs when removing filters
          showParagraphsMatchingSearch: false,
          selectedOptionTranscriptSearch: false
        };
      }
    
    });
   }



   /* TODO: move SearchBarTranscripts to a Search Toolbar component? */
   render() {

     return (
       <>
            {!this.state.showParagraphsMatchingSearch?
             <Button  
              onClick={this.handleFilterResults}
              variant={"outline-secondary"} 
              block
              title={'Search across transcripts in this project'}
              size={'sm'}
             > 
                <FontAwesomeIcon icon={faSearch}/> 
           </Button> :
           <>
           <InputGroup className="mb-3">
             <InputGroup.Prepend>
               <InputGroup.Text>
                 <FontAwesomeIcon icon={ faSearch } />
               </InputGroup.Text>
             </InputGroup.Prepend>
             {/* Search */}
             <FormControl
               //  TODO: pass labels, speakers, and paragraph pref
               onChange={ (e) => { this.props.handleSearch(e, {
                 showParagraphsMatchingSearch: this.state.showParagraphsMatchingSearch,
                 showLabelsSearchPreferences: this.state.showLabelsSearchPreferences,
                 showSpeakersSearchPreferences: this.state.showSpeakersSearchPreferences,
                 selectedOptionTranscriptSearch: this.state.selectedOptionTranscriptSearch
               });} }
               value={ this.props.searchValue }
               placeholder="Search text..."
               aria-label="search"
               aria-describedby="search"
             />
              <InputGroup.Append>
                <Button 
                  variant="outline-primary"
                  onClick={this.handleFilterResults}
                  title={"close search across transcript in a project"}
                >
                  <FontAwesomeIcon 
                   icon={ faTimes }
                  />
                </Button>
              </InputGroup.Append>
           </InputGroup>

           </> }

           { this.state.selectedOptionTranscriptSearch? 
          <>
               <Row className="mb-3">
                 <Col xs={ 1 } sm={ 1 } md={ 1 } ld={ 1 } xl={ 1 }>
                   <InputGroup.Prepend>
                     <InputGroup.Text>
                       <FontAwesomeIcon icon={ faFileAlt } />
                     </InputGroup.Text>
                   </InputGroup.Prepend>
                 </Col>
                 <Col xs={ 10 } sm={ 11 } md={ 11 } ld={ 11 } xl={ 11 }>
                   <Select
                     value={ this.state.selectedOptionTranscriptSearch }
                     onChange={ this.handleTranscriptSearchChange }
                     isMulti
                     isSearchable
                     options={ this.props.transcriptOptions }
                     styles={ speakersColorStyles }
                     placeholder={ 'Filter by transcripts...' }
                   />
                 </Col>
               </Row>
             </>
            : ''} 

          { this.state.showSpeakersSearchPreferences
             ? <>
               <Row className="mb-3">
                 <Col xs={ 1 } sm={ 1 } md={ 1 } ld={ 1 } xl={ 1 }>
                   <InputGroup.Prepend>
                     <InputGroup.Text>
                       <FontAwesomeIcon icon={ faUser } />
                     </InputGroup.Text>
                   </InputGroup.Prepend>
                 </Col>
                 <Col xs={ 10 } sm={ 11 } md={ 11 } ld={ 11 } xl={ 11 }>
                   <Select
                     value={ this.state.selectedOptionSpeakerSearch }
                     onChange={ this.handleSpeakersSearchChange }
                     isMulti
                     isSearchable
                     options={ this.props.speakersOptions }
                     styles={ speakersColorStyles }
                     placeholder={ 'Filter by speakers...' }
                   />
                 </Col>
               </Row>
             </>
             : ''}

           { this.state.showLabelsSearchPreferences
             ? <>
               <Row className="mb-3">
                 <Col xs={ 1 } sm={ 1 } md={ 1 } ld={ 1 } xl={ 1 }>
                   <InputGroup.Prepend>
                     <InputGroup.Text>
                       <FontAwesomeIcon icon={ faTag } />
                     </InputGroup.Text>
                   </InputGroup.Prepend>
                 </Col>
                 <Col xs={ 10 } sm={ 11 } md={ 11 } ld={ 11 } xl={ 11 }>
                   <Select
                     value={ this.state.selectedOptionLabelSearch }
                     onChange={ this.handleLabelsSearchChange }
                     isMulti
                     isSearchable
                     options={ this.props.labelsOptions }
                     styles={ colourStyles }
                     placeholder={ 'Filter by labels...' }
                   />
                 </Col>
               </Row>
             </>
             : ''}

          {/* In this type of search across transcript, it would always filter the result
          to show only matching paragraphs, so commenting this out for now, waiting to get
          a UX review on this and the overall "paper edit workspace" interace */}
           {/* { this.state.showTextSearchPreferences
             ? (<>
               <Form.Check
                 type="checkbox"
                 checked={ this.state.showParagraphsMatchingSearch }
                 onChange={ this.handleShowParagraphsMatchingSearch }
                 label={ <>
                   <Form.Text
                     className="text-muted"
                     title="Show only matching paragraphs"
                     onClick={ this.handleShowParagraphsMatchingSearch }
                   >
                       Show only matching paragraphs
                   </Form.Text>
                 </> }
               />
             </>)
             : ''} */}
       </>
     );
   }
}

export default SearchBarTranscripts;