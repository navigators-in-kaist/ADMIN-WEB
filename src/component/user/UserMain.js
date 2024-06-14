import React, {useEffect, useState} from 'react';
import _ from "lodash";
import Utils from "../../utils/Utils";
import axiosService from "../../service/axiosService";
import {Alert, Badge, Button, Col, Container, Row} from "react-bootstrap";
import Table from "../../common/table/Table";
import AddUser from "./modals/AddUser";

const UserMain = () => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);

    const columnData = [
        {
            accessor: 'id',
            Header: "User ID",
        },
        {
            accessor: 'userName',
            Header: "Name",
        },
        {
            accessor: 'provenUser',
            Header: "Is Proven",
            Cell: ({ cell: { value } }) => <UserProvenCell value={value} />
        }
    ];

    const UserProvenCell = (value) => {
        if (value.value) {
            return (
                <Badge bg="success">Proven</Badge>
            );
        } else {
            return (
                <Badge bg="secondary">Unproven</Badge>
            );
        }
    };

    const getUserList = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let userList = _.cloneDeep(res.data.item['userList']);
            let newUserList = userList.map(userInfo => {
                let newInfo = {...userInfo};
                newInfo['id'] = newInfo['userId'];
                return newInfo;
            });
            await setUserList(newUserList);
        };
        const fCallback = async (e) => {
            await setUserList([]);
        };
        let path = `/user`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    useEffect(() => {
        getUserList();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col>
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'right'
                        }}
                    >
                        <Button
                            variant="success"
                            onClick={async () => {
                                await setIsAddModalOpen(true);
                            }}
                        >
                            Add
                        </Button>
                    </div>
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
                        userList.length > 0 ?
                            <Table columns={columnData} data={userList} baseUrl={"/user"}/>
                            :
                            <Alert variant={"info"}>
                                No users exist.
                            </Alert>
                    }
                </div>
            </Row>
            <AddUser
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
                onRefresh={getUserList}
            />
        </Container>
    );
};

export default UserMain;