import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import axiosService from "../../service/axiosService";
import {toast} from "react-toastify";
import Utils from "../../utils/Utils";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ImageListView from "../../common/imageList/ImageListView";
import Form from "react-bootstrap/Form";
import {confirm} from "../../utils/confirm";
import PasswordChangeModal from "./modals/PasswordChangeModal";

const requestBodyInit = {
    "userEmail" : "",
    "userName" : ""
};

const isValidMapInit = {
    "userEmail" : true,
    "userName" : true
};

const UserDetail = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [fixedRequestBody, setFixedRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isEdited, setIsEdited] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const formatRequestBody = (prevObj) => {
        let newObj = _.cloneDeep(prevObj);
        if (newObj['userEmail'] === "") {
            newObj['userEmail'] = null;
        }
        if (newObj['provenUser']) {
            delete newObj['userEmail'];
        }
        return newObj;
    };

    const getUserInfo = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let data = res.data.item;
            setRequestBody(_.cloneDeep(data));
            setFixedRequestBody(_.cloneDeep(data));
            setIsValidMap(_.cloneDeep(isValidMapInit));
            setIsEdited(false);
            setIsValid(false);
        };
        const fCallback = async (e) => {
            await setRequestBody(_.cloneDeep(requestBodyInit));
            await setFixedRequestBody(_.cloneDeep(requestBodyInit));
            await setIsValidMap(_.cloneDeep(isValidMapInit));
            await setIsEdited(false);
            await setIsValid(false);
        };
        let path = `/user/${userId}`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const putUser = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await getUserInfo();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/user/${userId}`;
        await axiosService.sendPutRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const deleteUser = async () => {
        await setIsDeleteLoading(true);
        const sCallback = async (res) => {
            toast.success("Deleted!");
            navigate("/user");
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/user/${userId}`;
        await axiosService.sendDeleteRequest(path, sCallback, fCallback);
        await setIsDeleteLoading(false);
    };

    const handleNameInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "userName", value);
        await Utils.updateHelper(setIsValidMap, "userName", !Utils.isEmptyStr(value));
    };

    const handleEmailInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "userEmail", value);
        await Utils.updateHelper(setIsValidMap, "userEmail", true);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        setIsEdited(!_.isEqual(requestBody, fixedRequestBody));
    }, [requestBody]);

    useEffect(() => {
        setIsValid(Utils.checkIsAllTrue(isValidMap));
    }, [isValidMap]);

    if (isLoading) {
        return (
            <div
                style={{
                    padding: '50px',
                    textAlign: 'center',
                    color: '#757575'
                }}
            >
                <Spinner />
            </div>
        );
    }
    return (
        <Container fluid>
            <Row>
                <Col>
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'left'
                        }}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate("/user")}
                        >
                            {"Go back to list"}
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row
                style={{
                    marginTop: '15px'
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
                    marginTop: '10px'
                }}
            >
                <Col>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={requestBody['userId']}
                        readOnly
                    />
                </Col>
            </Row>
            <Row
                style={{
                    marginTop: '10px'
                }}
            >
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={requestBody['userEmail']}
                        onChange={(e) => handleEmailInput(e.target.value)}
                        readOnly={requestBody['provenUser']}
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
                            variant="danger"
                            onClick={async () => {
                                if (await confirm("Are you sure to delete?")) {
                                    deleteUser();
                                }
                            }}
                        >
                            {
                                isDeleteLoading ?
                                    <Spinner size={"sm"} />
                                    :
                                    <>Delete</>
                            }
                        </Button>
                        <Button
                            style={{
                                marginLeft: '10px'
                            }}
                            variant="primary"
                            onClick={async () => {
                                await setIsPasswordModalOpen(true);
                            }}
                        >
                            Reset Password
                        </Button>
                        <Button
                            style={{
                                marginLeft: 'auto'
                            }}
                            variant="success"
                            onClick={async () => {
                                putUser();
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
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                setIsOpen={setIsPasswordModalOpen}
                userId={userId}
            />
        </Container>
    );
};

export default UserDetail;