import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
import _ from "lodash";
import Modal from "react-modal";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../../common/modal/ModalCloseButton";
import Form from "react-bootstrap/Form";

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        color: 'black',
        width: '550px',
        height: '350px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    categoryName : "",
    description : ""
};

const isValidMapInit = {
    categoryName : true,
    description : true
};

const EditLocationCategory = ({ isOpen, setIsOpen, givenRequestBody, givenId, onRefresh }) => {

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [fixedRequestBody, setFixedRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isEdited, setIsEdited] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const putCategory = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/location-category/${givenId}`;
        await axiosService.sendPutRequest(path, requestBody, sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const handleNameInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "categoryName", value);
        await Utils.updateHelper(setIsValidMap, "categoryName", !Utils.isEmptyStr(value));
    };

    const handleDescriptionInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "description", value);
        await Utils.updateHelper(setIsValidMap, "description", !Utils.isEmptyStr(value));
    };

    const initStates = async () => {
        await setRequestBody(_.cloneDeep(givenRequestBody));
        await setFixedRequestBody(_.cloneDeep(givenRequestBody));
        await setIsValidMap(_.cloneDeep(isValidMapInit));
        await setIsValid(true);
        await setIsEdited(false);
    };

    useEffect(() => {
        initStates();
    }, [isOpen, givenRequestBody, givenId]);

    useEffect(() => {
        setIsEdited(!_.isEqual(requestBody, fixedRequestBody));
    }, [requestBody]);

    useEffect(() => {
        setIsValid(Utils.checkIsAllTrue(isValidMap));
    }, [isValidMap]);

    return (
        <Modal
            style={modalStyle}
            isOpen={isOpen}
        >
            <Container fluid>
                <Row>
                    <ModalCloseButton
                        title={"Edit the location category"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['categoryName']}
                            onChange={(e) => handleNameInput(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={requestBody["description"]}
                            onChange={(e) => handleDescriptionInput(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row
                    style={{
                        marginTop: '15px'
                    }}
                >
                    <Col>
                        <div
                            style={{
                                width: '100%',
                                display: 'inline-flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Button
                                style={{
                                    marginLeft: 'auto'
                                }}
                                variant="success"
                                onClick={async () => {
                                    putCategory();
                                }}
                                disabled={!(isValid && isEdited)}
                            >
                                {
                                    isSaveLoading ?
                                        <Spinner size={"sm"} />
                                        :
                                        <>Save</>
                                }
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Modal>
    );
};

export default EditLocationCategory;