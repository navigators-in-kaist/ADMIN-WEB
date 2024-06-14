import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {toast} from "react-toastify";
import axiosService from "../../../service/axiosService";
import Utils from "../../../utils/Utils";
import Modal from "react-modal";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../../common/modal/ModalCloseButton";
import Form from "react-bootstrap/Form";
import {confirm} from "../../../utils/confirm";

const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        color: 'black',
        width: '550px',
        height: '520px',
        margin: 'auto'
    }
};

const requestBodyInit = {
    "locationName" : "",
    "locationFloor" : 0,
    "description" : "",
    "roomNumber" : "",
    "locationCategoryId" : "",
    "locationBuildingId" : ""
};

const isValidMapInit = {
    "locationName" : false,
    "locationFloor" : true,
    "description" : false,
    "roomNumber" : true,
    "locationCategoryId" : false,
    "locationBuildingId" : false
};

const AddLocation = ({isOpen, setIsOpen, onRefresh}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isValid, setIsValid] = useState(false);

    const [buildingList, setBuildingList] = useState([]);
    const [locationCategoryList, setLocationCategoryList] = useState([]);

    const formatRequestBody = (prevObj) => {
        let newObj = _.cloneDeep(prevObj);
        newObj['locationFloor'] = parseInt(newObj['locationFloor']);
        if (newObj['roomNumber'] === "") {
            newObj['roomNumber'] = null;
        }
        return newObj;
    };

    const postLocation = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/location`;
        await axiosService.sendPostRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const getBuildingList = async (callback) => {
        const sCallback = async (res) => {
            let data = res.data.item;
            await setBuildingList(data['buildingList']);
            await handleBuildingChange(data['buildingList'][0]['buildingId']);
            await callback();
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
        };
        let path = `/building`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
    };

    const getLocationCategoryList = async () => {
        const sCallback = async (res) => {
            let data = res.data.item;
            await setLocationCategoryList(data['locationCategoryList']);
            await handleLocationCategoryChange(data['locationCategoryList'][0]['categoryId']);
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
        };
        let path = `/location-category`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const updateData = async () => {
        await setIsLoading(true);
        await setRequestBody(_.cloneDeep(requestBodyInit));
        await setIsValidMap(_.cloneDeep(isValidMapInit));
        await setIsValid(false);
        await getBuildingList(() => getLocationCategoryList())
    };

    const handleNameInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "locationName", value);
        await Utils.updateHelper(setIsValidMap, "locationName", !Utils.isEmptyStr(value));
    };

    const handleFloorInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "locationFloor", value);
        await Utils.updateHelper(setIsValidMap, "locationFloor", !Utils.isEmptyStr(value) && !isNaN(parseInt(value)));
    };

    const handleDescriptionInput = async (value) => {
        await Utils.updateHelper(setRequestBody, "description", value);
        await Utils.updateHelper(setIsValidMap, "description", !Utils.isEmptyStr(value));
    };

    const handleRoomNumberInput = async (value) => {
        if (value === "") {
            await Utils.updateHelper(setRequestBody, "roomNumber", null);
        } else {
            await Utils.updateHelper(setRequestBody, "roomNumber", value);
        }
        await Utils.updateHelper(setIsValidMap, "roomNumber", true);
    };

    const handleLocationCategoryChange = async (value) => {
        await Utils.updateHelper(setRequestBody, "locationCategoryId", value);
        await Utils.updateHelper(setIsValidMap, "locationCategoryId", true);
    };

    const handleBuildingChange = async (value) => {
        await Utils.updateHelper(setRequestBody, "locationBuildingId", value);
        await Utils.updateHelper(setIsValidMap, "locationBuildingId", true);
    };

    useEffect(() => {
        /** init states */
        updateData();
    }, [isOpen]);

    useEffect(() => {
        setIsValid(Utils.checkIsAllTrue(isValidMap));
    }, [isValidMap]);

    if (isLoading) {
        return (
            <Modal
                style={modalStyle}
                isOpen={isOpen}
            >
                <Row>
                    <ModalCloseButton
                        title={"Add a new location"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '20px'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <Spinner />
                    </div>
                </Row>
            </Modal>
        )
    }
    return (
        <Modal
            style={modalStyle}
            isOpen={isOpen}
        >
            <Container fluid>
                <Row>
                    <ModalCloseButton
                        title={"Add a new location"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row
                    style={{
                        marginTop: '15px'
                    }}
                >
                    <Col>
                        <Form.Label>Building</Form.Label>
                        <Form.Select
                            value={requestBody["locationBuildingId"]}
                            onChange={e => handleBuildingChange(e.target.value)}
                        >
                            {
                                buildingList &&
                                buildingList.map((buildingInfo) => {
                                    return (
                                        <option value={buildingInfo['buildingId']}>
                                            {buildingInfo['officialCode']}
                                        </option>
                                    )
                                })
                            }
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={requestBody["locationCategoryId"]}
                            onChange={e => handleLocationCategoryChange(e.target.value)}
                        >
                            {
                                locationCategoryList &&
                                locationCategoryList.map((categoryInfo) => {
                                    return (
                                        <option value={categoryInfo['categoryId']}>
                                            {categoryInfo['categoryName']}
                                        </option>
                                    )
                                })
                            }
                        </Form.Select>
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
                            value={requestBody['locationName']}
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
                        <Form.Label>Floor</Form.Label>
                        <Form.Control
                            type="integer"
                            value={requestBody['locationFloor']}
                            onChange={(e) => handleFloorInput(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Room Number (optional)</Form.Label>
                        <Form.Control
                            type="text"
                            value={requestBody['roomNumber']}
                            onChange={(e) => handleRoomNumberInput(e.target.value)}
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
                                    postLocation();
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

export default AddLocation;