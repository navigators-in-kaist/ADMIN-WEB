import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../../common/modal/ModalCloseButton";
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
import Form from "react-bootstrap/Form";
import {confirm} from "../../../utils/confirm";
import _ from "lodash";

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        color: 'black',
        width: '550px',
        height: '560px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    officialCode: "",
    buildingName: "",
    buildingAlias: "",
    description: "",
    maxFloor: 0,
    latitude: 0.0,
    longitude: 0.0
};

const isValidMapInit = {
    officialCode: false,
    buildingName: false,
    buildingAlias: false,
    description: false,
    maxFloor: true,
    latitude: true,
    longitude: true
};

const AddBuilding = ({isOpen, setIsOpen, onRefresh}) => {

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isValid, setIsValid] = useState(false);

    const formatRequestBody = (prevObj) => {
        let newObj = _.cloneDeep(prevObj);
        newObj['maxFloor'] = parseInt(newObj['maxFloor']);
        newObj['latitude'] = parseFloat(newObj['latitude']);
        newObj['longitude'] = parseFloat(newObj['longitude']);
        return newObj;
    };

    const postBuilding = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/building`;
        await axiosService.sendPostRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const handleCodeInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "officialCode", value);
        await Utils.updateHelper(setIsValidMap, "officialCode", !Utils.isEmptyStr(value));
    };

    const handleNameInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "buildingName", value);
        await Utils.updateHelper(setIsValidMap, "buildingName", !Utils.isEmptyStr(value));
    };

    const handleAliasInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "buildingAlias", value);
        await Utils.updateHelper(setIsValidMap, "buildingAlias", !Utils.isEmptyStr(value));
    };

    const handleDescriptionInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "description", value);
        await Utils.updateHelper(setIsValidMap, "description", !Utils.isEmptyStr(value));
    };

    const handleMaxFloorInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "maxFloor", value);
        await Utils.updateHelper(setIsValidMap, "maxFloor", !Utils.isEmptyStr(value) && !isNaN(parseInt(value)));
    };

    const handleLatInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "latitude", value);
        await Utils.updateHelper(setIsValidMap, "latitude", !Utils.isEmptyStr(value) && !isNaN(parseFloat(value)));
    };

    const handleLonInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "longitude", value);
        await Utils.updateHelper(setIsValidMap, "longitude", !Utils.isEmptyStr(value) && !isNaN(parseFloat(value)));
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
                        title={"Add a new building"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Official Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['officialCode']}
                            onChange={(e) => handleCodeInput(e.target.value)}
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
                            value={requestBody['buildingName']}
                            onChange={(e) => handleNameInput(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Alias</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['buildingAlias']}
                            onChange={(e) => handleAliasInput(e.target.value)}
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
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Max Floor</Form.Label>
                        <Form.Control
                            type="integer"
                            value={requestBody['maxFloor']}
                            onChange={(e) => handleMaxFloorInput(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row
                    style={{
                        marginTop: '5px'
                    }}
                >
                    <Col>
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                            type="number"
                            value={requestBody['latitude']}
                            onChange={(e) => handleLatInput(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                            type="number"
                            value={requestBody['longitude']}
                            onChange={(e) => handleLonInput(e.target.value)}
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
                                    postBuilding();
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

export default AddBuilding;