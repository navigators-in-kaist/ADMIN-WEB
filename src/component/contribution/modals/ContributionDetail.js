import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {Badge, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import ModalCloseButton from "../../../common/modal/ModalCloseButton";
import _ from "lodash";
import axiosService from "../../../service/axiosService";
import Form from "react-bootstrap/Form";
import {confirm} from "../../../utils/confirm";
import {toast} from "react-toastify";


const ContributionDetail = ({ isOpen, setIsOpen, data, targetId, onRefresh }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    const [buildingList, setBuildingList] = useState([]);
    const [locationCategoryList, setLocationCategoryList] = useState([]);


    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            color: 'black',
            width: '550px',
            height: (data['contributionType'] === "BUILDING") ? '600px' : '530px',
            margin: 'auto'
        }
    };

    const postApprove = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/contribution/${targetId}/approve`;
        await axiosService.sendPostRequest(path, {}, sCallback, fCallback);
        await setIsSaveLoading(false);
    };

    const postReject = async () => {
        await setIsSaveLoading(true);
        const sCallback = async (res) => {
            toast.success("Saved!");
            await setIsOpen(false);
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/contribution/${targetId}/reject`;
        await axiosService.sendPostRequest(path, {}, sCallback, fCallback);
        await setIsSaveLoading(false);
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
        };
        let path = `/building`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
    };

    const getLocationCategoryList = async () => {
        const sCallback = async (res) => {
            let data = res.data.item;
            await setLocationCategoryList(data['locationCategoryList']);
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
            await setLocationCategoryList([]);
        };
        let path = `/location-category`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const prepareData = async () => {
        await setIsLoading(true);
        await getBuildingList(getLocationCategoryList);
    };

    const TypeCell = (value) => {
        if (value.value === "BUILDING") {
            return (
                <Badge bg="info">Building</Badge>
            );
        } else { /* LOCATION */
            return (
                <Badge bg="warning">Location</Badge>
            );
        }
    };

    useEffect(() => {
        prepareData();
    }, [isOpen]);

    return (
        <Modal
            style={modalStyle}
            isOpen={isOpen}
        >
            <Container fluid>
                <Row>
                    <ModalCloseButton
                        title={"Contribution details"}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row>
                    <TypeCell value={data['contributionType']} />
                </Row>
                {
                    isLoading &&
                    <Row>
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            <Spinner />
                        </div>
                    </Row>
                }
                {
                    (!isLoading) &&
                    (data['contributionType'] === "BUILDING") &&
                    <>
                        <Row
                            style={{
                                marginTop: '5px'
                            }}
                        >
                            <Col>
                                <Form.Label>Official Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data['officialCode']}
                                    readOnly
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
                                    value={data['name']}
                                    readOnly
                                />
                            </Col>
                            <Col>
                                <Form.Label>Alias</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data['alias']}
                                    readOnly
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
                                    value={data["description"]}
                                    readOnly
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
                                    value={data['maxFloor']}
                                    readOnly
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
                                    value={data['latitude']}
                                    readOnly
                                />
                            </Col>
                            <Col>
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={data['longitude']}
                                    readOnly
                                />
                            </Col>
                        </Row>
                    </>
                }
                {
                    (!isLoading) &&
                    (data['contributionType'] === "LOCATION") &&
                    <>
                        <Row
                            style={{
                                marginTop: '15px'
                            }}
                        >
                            <Col>
                                <Form.Label>Building</Form.Label>
                                <Form.Select
                                    value={data["contributionBuildingId"]}
                                    readOnly
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
                                    value={data["contributionLocationCategoryId"]}
                                    readOnly
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
                                    value={data['name']}
                                    readOnly
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
                                    value={data['floor']}
                                    readOnly
                                />
                            </Col>
                            <Col>
                                <Form.Label>Room Number (optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={data['roomNumber']}
                                    readOnly
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
                                    value={data["description"]}
                                    readOnly
                                />
                            </Col>
                        </Row>
                    </>
                }
                {
                    (!isLoading) &&
                    <Row
                        style={{
                            marginTop: '15px'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                display: 'inline-flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Button
                                style={{
                                    marginLeft: 'auto'
                                }}
                                variant="danger"
                                onClick={async () => {
                                    if (await confirm("Are you sure to reject the contribution?")) {
                                        postReject();
                                    }
                                }}
                                disabled={!(data['contributionStatus'] === "WAIT_FOR_ACCEPT")}
                            >
                                {
                                    isSaveLoading ?
                                        <Spinner size={"sm"} />
                                        :
                                        <>Reject</>
                                }
                            </Button>
                            <Button
                                style={{
                                    marginLeft: '10px'
                                }}
                                variant="primary"
                                onClick={async () => {
                                    if (await confirm("Are you sure to accept the contribution?")) {
                                        postApprove();
                                    }
                                }}
                                disabled={!(data['contributionStatus'] === "WAIT_FOR_ACCEPT")}
                            >
                                {
                                    isSaveLoading ?
                                        <Spinner size={"sm"} />
                                        :
                                        <>Accept</>
                                }
                            </Button>
                        </div>
                    </Row>
                }
            </Container>
        </Modal>
    );
};

export default ContributionDetail;