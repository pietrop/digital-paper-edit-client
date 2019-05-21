import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faStickyNote,
  faTrashAlt,
  faTag
} from '@fortawesome/free-solid-svg-icons';

class AnnotationOverlayTrigger extends Component {

  handleEditAnnotation = () => {
    let text;
    this.props.handleEditAnnotation(this.props.annotationId, text );
  }

  render() {
    const { annotationLabelId } = this.props;
    let label = this.props.labelsOptions.find((label) => {
      return label.id === annotationLabelId;
    });
    // console.log('label:: ', label, annotationLabelId, this.props.labelsOptions, 'this.props.words', this.props.words, this.props.annotationNote);
    // TODO: Quick fix - needs digging into why sometimes adding a new label crashes, and the `find` function above returns undefined
    if (!label) {
      label = this.props.labelsOptions[0];
    }

    return (
      <OverlayTrigger rootClose={ true } trigger="click" placement="bottom"
        overlay={
          <Popover id="popover-basic">
            <Row>
              <Col md={ 1 } style={ { backgroundColor: label.color, marginLeft:'1em' } }></Col>
              <Col >
                <FontAwesomeIcon icon={ faTag } />  {label.label}
              </Col>
              <Col md={ 1 } style={ { marginRight:'1em' } }
                onClick={ () => {this.props.handleDeleteAnnotation(this.props.annotationId);} }>
                <FontAwesomeIcon icon={ faTrashAlt } />
              </Col>
            </Row>
            <hr/>
            <FontAwesomeIcon icon={ faStickyNote }
              onClick={ this.handleEditAnnotation }
            />   { this.props.annotationNote }
            <br/>
            <FontAwesomeIcon icon={ faPen }
              onClick={ this.handleEditAnnotation }
            />
          </Popover>
        }
      >
        <span style={ { borderBottom: `0.1em ${ label.color } solid` } } className={ 'highlight' }>{this.props.words}</span>
      </OverlayTrigger>
    );
  }
}

export default AnnotationOverlayTrigger;