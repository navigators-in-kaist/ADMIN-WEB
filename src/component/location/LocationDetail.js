import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import axiosService from "../../service/axiosService";
import {toast} from "react-toastify";
import Utils from "../../utils/Utils";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ImageListView from "../../common/imageList/ImageListView";
import Form from "react-bootstrap/Form";
import FormSelect from 'react-bootstrap/FormSelect'
import {confirm} from "../../utils/confirm";

const requestBodyInit = {
    "locationName" : "",
    "locationFloor" : 0,
    "description" : "",
    "roomNumber" : "",
    "locationCategoryId" : "",
    "locationBuildingId" : ""
};

const isValidMapInit = {
    "locationName" : true,
    "locationFloor" : true,
    "description" : true,
    "roomNumber" : true,
    "locationCategoryId" : true,
    "locationBuildingId" : true
};

const LocationDetail = () => {

    const { locationId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [fixedRequestBody, setFixedRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isEdited, setIsEdited] = useState(false);
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

    const getBuildingList = async (callback) => {
        const sCallback = async (res) => {
            let data = res.data.item;
            await setBuildingList(data['buildingList']);
            await callback();
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
            await setRequestBody(_.cloneDeep(requestBodyInit));
            await setFixedRequestBody(_.cloneDeep(requestBodyInit));
            await setIsValidMap(_.cloneDeep(isValidMapInit));
            await setIsEdited(false);
            await setIsValid(false);
        };
        let path = `/building`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
    };

    const getLocationCategoryList = async (callback) => {
        const sCallback = async (res) => {
            let data = res.data.item;
            await setLocationCategoryList(data['locationCategoryList']);
            await callback();
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
            await setRequestBody(_.cloneDeep(requestBodyInit));
            await setFixedRequestBody(_.cloneDeep(requestBodyInit));
            await setIsValidMap(_.cloneDeep(isValidMapInit));
            await setIsEdited(false);
            await setIsValid(false);
        };
        let path = `/location-category`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
    };

    const getLocationInfo = async () => {
        const sCallback = async (res) => {
            let data = res.data.item;
            setRequestBody(_.cloneDeep(data));
            setFixedRequestBody(_.cloneDeep(data));
            setIsValidMap(_.cloneDeep(isValidMapInit));
            setIsEdited(false);
            setIsValid(false);
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
            await setRequestBody(_.cloneDeep(requestBodyInit));
            await setFixedRequestBody(_.cloneDeep(requestBodyInit));
            await setIsValidMap(_.cloneDeep(isValidMapInit));
            await setIsEdited(false);
            await setIsValid(false);
        };
        let path = `/location/${locationId}`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const updateData = async () => {
        await setIsLoading(true);
        await getBuildingList(() => getLocationCategoryList(getLocationInfo))
    };

    const putLocation = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await updateData();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/location/${locationId}`;
        await axiosService.sendPutRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const deleteLocation = async () => {
        await setIsDeleteLoading(true);
        const sCallback = async (res) => {
            toast.success("Deleted!");
            navigate("/location");
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/location/${locationId}`;
        await axiosService.sendDeleteRequest(path, sCallback, fCallback);
        await setIsDeleteLoading(false);
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
        console.log(value);
        await Utils.updateHelper(setRequestBody, "locationBuildingId", value);
        await Utils.updateHelper(setIsValidMap, "locationBuildingId", true);
    };

    useEffect(() => {
        updateData();
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
                            onClick={() => navigate("/location")}
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
                    {/* for images */}
                    <ImageListView
                        imageDataList={requestBody["imageList"]}
                        type={"location"}
                        entityId={locationId}
                        onRefresh={updateData}
                    />
                </Col>
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
                            variant="danger"
                            onClick={async () => {
                                if (await confirm("Are you sure to delete?")) {
                                    deleteLocation();
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
                                marginLeft: 'auto'
                            }}
                            variant="success"
                            onClick={async () => {
                                putLocation();
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
    );
};

export default LocationDetail;