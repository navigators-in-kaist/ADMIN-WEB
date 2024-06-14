import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../../common/modal/ModalCloseButton";
import Form from "react-bootstrap/Form";
import Modal from "react-modal";

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        color: 'black',
        width: '550px',
        height: '230px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    newPassword : ""
};

const isValidMapInit = {
    newPassword : false
};


const PasswordChangeModal = ({ isOpen, setIsOpen, userId }) => {

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isValid, setIsValid] = useState(false);

    const putPassword = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/user/${userId}/passwd`;
        await axiosService.sendPutRequest(path, requestBody, sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const handlePasswordInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "newPassword", value);
        await Utils.updateHelper(setIsValidMap, "newPassword", !Utils.isEmptyStr(value));
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
                        title={"Reset user password"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={requestBody['newPassword']}
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
                                    putPassword();
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

export default PasswordChangeModal;