import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import Utils from "../../utils/Utils";
import axiosService from "../../service/axiosService";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {toast} from "react-toastify";
import { confirm } from '../../utils/confirm';
import ImageListView from "../../common/imageList/ImageListView";

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
    officialCode: true,
    buildingName: true,
    buildingAlias: true,
    description: true,
    maxFloor: true,
    latitude: true,
    longitude: true
};

const BuildingDetail = () => {

    const { buildingId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [requestBody, setRequestBody] = useState(requestBodyInit);
    const [fixedRequestBody, setFixedRequestBody] = useState(requestBodyInit);
    const [isValidMap, setIsValidMap] = useState(isValidMapInit);
    const [isEdited, setIsEdited] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const formatRequestBody = (prevObj) => {
        let newObj = _.cloneDeep(prevObj);
        newObj['maxFloor'] = parseInt(newObj['maxFloor']);
        newObj['latitude'] = parseFloat(newObj['latitude']);
        newObj['longitude'] = parseFloat(newObj['longitude']);
        delete newObj['buildingId'];
        return newObj;
    };

    const getBuildingInfo = async () => {
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
        let path = `/building/${buildingId}`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const putBuilding = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await getBuildingInfo();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/building/${buildingId}`;
        await axiosService.sendPutRequest(path, formatRequestBody(requestBody), sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const deleteBuilding = async () => {
        await setIsDeleteLoading(true);
        const sCallback = async (res) => {
            toast.success("Deleted!");
            navigate("/building");
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/building/${buildingId}`;
        await axiosService.sendDeleteRequest(path, sCallback, fCallback);
        await setIsDeleteLoading(false);
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
        getBuildingInfo();
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
                            onClick={() => navigate("/building")}
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
                        type={"building"}
                        entityId={buildingId}
                        onRefresh={getBuildingInfo}
                    />
                </Col>
            </Row>
            <Row
                style={{
                    marginTop: '15px'
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
                            variant="danger"
                            onClick={async () => {
                                if (await confirm("Are you sure to delete?")) {
                                    deleteBuilding();
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
                                putBuilding();
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

export default BuildingDetail;