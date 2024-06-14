import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Row, Form, Alert, Spinner} from "react-bootstrap";
import Table from "../../common/table/Table";
import authService from "../../auth/service/AuthService";
import axiosService from "../../service/axiosService";
import _ from "lodash";
import Utils from "../../utils/Utils";
import AddBuilding from "./modals/AddBuilding";

const BuildingMain = () => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buildingList, setBuildingList] = useState([]);

    const columnData = [
        {
            accessor: 'officialCode',
            Header: "Official Code",
        },
        {
            accessor: 'buildingName',
            Header: "Name",
        },
        {
            accessor: 'buildingAlias',
            Header: "Alias",
        }
    ];

    const getBuildingList = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let buildingList = _.cloneDeep(res.data.item['buildingResults']);
            let newBuildingList = buildingList.map(
                dataObj => Utils.replaceObjKey(dataObj, "buildingId", "id")
            );
            await setBuildingList(newBuildingList);
        };
        const fCallback = async (e) => {
            await setBuildingList([]);
        };
        let path = `/search?payload=${keyword}`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const enterEventHandler = (e) => {
        if (e.key === 'Enter') {
            getBuildingList();
        }
    };

    useEffect(() => {
        getBuildingList();
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
                            await getBuildingList();
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
                        buildingList.length > 0 ?
                            <Table columns={columnData} data={buildingList} baseUrl={"/building"}/>
                            :
                            <Alert variant={"info"}>
                                No buildings found.
                            </Alert>
                    }
                </div>
            </Row>
            <AddBuilding
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
                onRefresh={getBuildingList}
            />
        </Container>
    );
};

export default BuildingMain;