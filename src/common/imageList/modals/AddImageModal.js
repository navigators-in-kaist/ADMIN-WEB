import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../modal/ModalCloseButton";
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
import Form from "react-bootstrap/Form";

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        color: 'black',
        width: '550px',
        height: '250px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    url : ""
};

const isValidMapInit = {
    url : false
};

const AddImageModal = ({ isOpen, setIsOpen, type, entityId, onRefresh }) => {

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isValid, setIsValid] = useState(false);

    const postImage = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/image/${type}/${entityId}`;
        await axiosService.sendPostRequest(path, requestBody, sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const handleUrlInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "url", value);
        await Utils.updateHelper(setIsValidMap, "url", !Utils.isEmptyStr(value));
    };

    useEffect(() => {
        /** init states */
        setRequestBody(requestBodyInit);
        setIsValidMap(isValidMapInit);
        setIsValid(false);
    }, [isOpen]);

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
                        title={"Add a new image to the " + type}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['officialCode']}
                            onChange={(e) => handleUrlInput(e.target.value)}
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
                                    postImage();
                                }}
                                disabled={!isValid}
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

export default AddImageModal;