import React, {useState} from 'react';
import _ from "lodash";
import axiosService from "../../service/axiosService";
import {Alert, Badge, Container, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import Table from "../../common/table/Table";
import CustomTable from "./custom/CustomTable";
import ContributionDetail from "./modals/ContributionDetail";
import {value} from "lodash/seq";


const ContributionMain = () => {

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contributionList, setContributionList] = useState(false);

    const [targetContributionId, setTargetContributionId] = useState("");
    const [targetContributionData, setTargetContributionData] = useState({});

    const StatusCell = (value) => {
        if (value.value === "WAIT_FOR_ACCEPT") {
            return (
                <Badge bg="secondary">Wait for acceptance</Badge>
            );
        } else if (value.value === "ACCEPTED") {
            return (
                <Badge bg="success">Accepted</Badge>
            );
        } else { /* REJECTED */
            return (
                <Badge bg="danger">Rejected</Badge>
            );
        }
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

    const DateView = (value) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        let newDate = new Date(value.value);
        return newDate.toLocaleTimeString("en-US", options);
    };

    const columnData = [
        {
            accessor: 'contributionType',
            Header: "Type",
            Cell: ({ cell: { value } }) => <TypeCell value={value} />
        },
        {
            accessor: 'contributionStatus',
            Header: "Status",
            Cell: ({ cell: { value } }) => <StatusCell value={value} />
        },
        {
            accessor: 'createdAt',
            Header: "Created At",
            Cell: ({ cell: { value } }) => <DateView value={value} />,
        },
        {
            accessor: 'name',
            Header: "Name",
        }
    ];

    const getContributionList = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let contributionList = _.cloneDeep(res.data.item['contributionList']);
            let newContributionList = contributionList.map(userInfo => {
                let newInfo = {...userInfo};
                newInfo['id'] = newInfo['contributionId'];
                return newInfo;
            });
            await setContributionList(newContributionList);
        };
        const fCallback = async (e) => {
            await setContributionList([]);
        };
        let path = `/contribution`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const onRowClick = async (id) => {
        /** set values */
        await setTargetContributionId(id);
        await setTargetContributionData(await Utils.findObjInList(id, contributionList));
        await setIsDetailModalOpen(true);
    };

    useState(() => {
        getContributionList();
    }, []);

    return (
        <Container fluid>
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
                        contributionList.length > 0 ?
                            <CustomTable columns={columnData} data={contributionList} onClickRow={onRowClick}/>
                            :
                            <Alert variant={"info"}>
                                No contributions exist.
                            </Alert>
                    }
                </div>
            </Row>
            {
                targetContributionId !== "" &&
                !_.isEqual(targetContributionData, {}) &&
                <ContributionDetail
                    isOpen={isDetailModalOpen}
                    setIsOpen={setIsDetailModalOpen}
                    data={targetContributionData}
                    targetId={targetContributionId}
                    onRefresh={getContributionList}
                />
            }
        </Container>
    );
};

export default ContributionMain;