import React, {useState, useEffect, useReducer} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import {anyInText} from '../../../Util/in-text';
import arrayMatch from '../../../Util/array-match';
import List from '@pietrop/digital-paper-edit-storybook/List';
import SearchBar from '@pietrop/digital-paper-edit-storybook/SearchBar';
import FormModal from '@pietrop/digital-paper-edit-storybook/FormModal';
import NewTranscriptFormModal from './NewTranscriptFormModal';

const initialFormState = {
    title: '',
    description: '',
    id: null
};

const ItemsContainer = (props) => {
    const type = props.type;
    const [items, setItems] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    // The form works both for new/create and edit/update
    const handleSaveForm = (item) => {
        props.handleSave(item);
        setShowModal(false);
        setFormData(initialFormState)
    };

    const handleEditItem = (id) => {
        const item = items.find((i) => i.id === id);
        setFormData(item)

        setShowModal(true);
    };

    const handleDeleteItem = (id) => {
        props.handleDelete(id);
    };

    const handleFilterDisplay = (item, text) => {
        if (anyInText([
            item.title, item.description
        ], text)) {
            item.display = true;
        } else {
            item.display = false;
        }

        return item;
    };

    const handleSearch = text => {
        const results = items.map(item => handleFilterDisplay(item, text));
        setItems(results);
    };

    const toggleShowModal = () => {
        console.log('toggle', !showModal);
        setShowModal(!showModal);
        // if form modal is closed then reset content
        if (!showModal) {
            setFormData(initialFormState)
        }
    };

    useEffect(() => {
        if (!arrayMatch(props.items, items)) {
            setItems(props.items);
        }

        return() => {};

    }, [items, props.items]);

    let searchEl;
    let showItems;

    if (items.length > 0) {
        searchEl = <SearchBar handleSearch={handleSearch}/>;
        showItems = (
            <List type={
                    props.type
                }
                items={items}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}/>
        );

    } else {
        showItems = (
            <i>There are no {type}s, create a new one to get started.</i>
        );
    }
    let formModal = (
        <FormModal { ...formData }
            modalTitle={
                formData.id ? `Edit ${type}` : `New ${type}`
            }
            showModal={showModal}
            handleOnHide={toggleShowModal}
            handleSaveForm={handleSaveForm}
            itemType={
                type.toLowerCase
            }/>
    )

    if (props.type === 'transcript') {
        if (formData.id === null) {
            formModal = (
                <NewTranscriptFormModal modalTitle={
                        `New ${type}`
                    }
                    handleCloseModal={toggleShowModal}
                    show={showModal}
                    handleSaveForm={handleSaveForm}
                    itemType={
                      type.toLowerCase
                  }/>
            )
        }
    }

    return (
        <>
            <Row>
                <Col sm={9}>
                    {searchEl} </Col>
                <Col xs={12}
                    sm={3}>
                    <Button onClick={toggleShowModal}
                        variant="outline-secondary"
                        size="sm"
                        block>
                        New {type} </Button>
                </Col>
            </Row>
            {showItems}
            {formModal} </>
    );
};
ItemsContainer.propTypes = {
    handleSave: PropTypes.any,
    handleDelete: PropTypes.any,
    items: PropTypes.array.isRequired,
    type: PropTypes.string
};
ItemsContainer.defaultProps = {
    type: 'Project'
};
export default ItemsContainer;
