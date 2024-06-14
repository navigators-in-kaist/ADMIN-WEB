import React, {useEffect, useState} from 'react';
import _ from "lodash";
import Utils from "../../utils/Utils";
import axiosService from "../../service/axiosService";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import Table from "../../common/table/Table";
import AddLocation from "./modals/AddLocation";

const LocationMain = () => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [locationList, setLocationList] = useState([]);

    const columnData = [
        {
            accessor: 'locationName',
            Header: "Name",
        },
        {
            accessor: 'locationCategoryName',
            Header: "Category",
        },
        {
            accessor: 'locationBuildingOfficialCode',
            Header: "Building",
        }
    ];

    const getLocationList = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let locationList = _.cloneDeep(res.data.item['locationResults']);
            let newLocationList = locationList.map(
                dataObj => Utils.replaceObjKey(dataObj, "locationId", "id")
            );
            await setLocationList(newLocationList);
        };
        const fCallback = async (e) => {
            await setLocationList([]);
        };
        let path = `/search?payload=${keyword}`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const enterEventHandler = (e) => {
        if (e.key === 'Enter') {
            getLocationList();
        }
    };

    useEffect(() => {
        getLocationList();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col
                    md={"8"}
                >
                    <Form.Control
                        type="text"
                        placeholder="Insert search keyword ..."
                        onChange={e => setKeyword(e.target.value)}
                        onKeyDown={(e) => enterEventHandler(e)}
                    />
                </Col>
                <Col
                    md={"2"}
                >
                    <Button
                        style={{
                            width: '100%'
                        }}
                        variant="secondary"
                        onClick={async () => {
                            await getLocationList();
                        }}
                    >
                        {
                            isLoading ?
                                <Spinner size={"sm"} />
                                :
                                <>Find</>
                        }
                    </Button>
                </Col>
                <Col
                    md={"2"}
                >
                    <Button
                        style={{
                            width: '100%'
                        }}
                        variant="success"
                        onClick={async () => {
                            await setIsAddModalOpen(true);
                        }}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
            <Row>
                <div
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        height: '650px',
                        overflow: 'auto'
                    }}
                >
                    {/* table */}
                    {
                        locationList.length > 0 ?
                            <Table columns={columnData} data={locationList} baseUrl={"/location"}/>
                            :
                            <Alert variant={"info"}>
                                No locations found.
                            </Alert>
                    }
                </div>
            </Row>
            <AddLocation
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
                onRefresh={getLocationList}
            />
        </Container>
    );
};

export default LocationMain;