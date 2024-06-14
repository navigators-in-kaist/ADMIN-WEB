import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
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
        height: '460px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    "userId" : "",
    "userEmail" : "",
    "userName" : "",
    "password" : ""
};

const isValidMapInit = {
    "userId" : false,
    "userEmail" : true,
    "userName" : false,
    "password" : false
};

const AddUser = ({isOpen, setIsOpen, onRefresh}) => {

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isValid, setIsValid] = useState(false);

    const formatRequestBody = (prevObj) => {
        let newObj = _.cloneDeep(prevObj);
        if (newObj['userEmail'] === "") {
            newObj['userEmail'] = null;
        }
        return newObj;
    };

    const postUser = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/auth/sign-up/user`;
        await axiosService.sendPostRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const handleIdInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "userId", value);
        await Utils.updateHelper(setIsValidMap, "userId", !Utils.isEmptyStr(value));
    };

    const handleNameInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "userName", value);
        await Utils.updateHelper(setIsValidMap, "userName", !Utils.isEmptyStr(value));
    };

    const handleEmailInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "userEmail", value);
        await Utils.updateHelper(setIsValidMap, "userEmail", true);
    };

    const handlePasswordInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "password", value);
        await Utils.updateHelper(setIsValidMap, "password", true);
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
                        title={"Add a new user"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['userId']}
                            onChange={(e) => handleIdInput(e.target.value)}
                        />
                    </Col>
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
                            value={requestBody['userName']}
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
                        <Form.Label>Email (optional)</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['userEmail']}
                            onChange={(e) => handleEmailInput(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={requestBody['password']}
                            onChange={(e) => handlePasswordInput(e.target.value)}
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
                                    postUser();
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

export default AddUser;