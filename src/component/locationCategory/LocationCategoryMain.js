import React, {useEffect, useState} from 'react';
import {Badge, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import _ from "lodash";
import axiosService from "../../service/axiosService";
import {confirm} from "../../utils/confirm";
import {RxCross2} from "react-icons/rx";
import {toast} from "react-toastify";
import AddLocationCategory from "./modals/AddLocationCategory";
import EditLocationCategory from "./modals/EditLocationCategory";

const requestBodyInit = {

};

const LocationCategoryMain = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [targetCategoryId, setTargetCategoryId] = useState("");
    const [requestBody, setRequestBody] = useState(requestBodyInit);

    const [categoryList, setCategoryList] = useState([]);

    const getCategoryList = async () => {
        await setIsLoading(true);
        const sCallback = async (res) => {
            let data = res.data.item;
            await setCategoryList(data['locationCategoryList']);
        };
        const fCallback = async (e) => {
            await setCategoryList([]);
        };
        let path = `/location-category`;
        await axiosService.sendGetRequest(path, sCallback, fCallback);
        await setIsLoading(false);
    };

    const deleteCategory = async (id) => {
        await setIsDeleteLoading(true);
        const sCallback = async (res) => {
            toast.success("Deleted!");
            getCategoryList();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/location-category/${id}`;
        await axiosService.sendDeleteRequest(path, sCallback, fCallback);
        await setIsDeleteLoading(false);
    };

    useEffect(() => {
        /** init */
        setRequestBody(requestBodyInit);
        getCategoryList();
    }, []);


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
                            display: 'inline-flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {/* add button */}
                        <Button
                            style={{
                                marginLeft: 'auto'
                            }}
                            variant="success"
                            onClick={() => {
                                setIsAddModalOpen(true);
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </Col>
            </Row>
            {
                categoryList &&
                categoryList.map((categoryInfo) => {
                    if (categoryInfo['numberOfLocations'] > 0) {
                        return (
                            <Button
                                variant="primary"
                                key={categoryInfo['categoryId']}
                                style={{
                                    marginRight: '5px'
                                }}
                                onClick={async () => {
                                    let newReq = {
                                        categoryName : categoryInfo['categoryName'],
                                        description : categoryInfo['description']
                                    };
                                    await setRequestBody(newReq);
                                    await setTargetCategoryId(categoryInfo['categoryId']);
                                    await setIsEditModalOpen(true);
                                }}
                            >
                                {categoryInfo['categoryName']} <Badge bg="secondary">{categoryInfo['numberOfLocations']}</Badge>
                            </Button>
                        );
                    } else {
                        return (
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-end',
                                    position: 'relative',
                                    marginRight: '10px',
                                    marginTop: '15px',
                                    paddingRight: '15px',
                                }}
                            >
                                <Button
                                    variant="secondary"
                                    key={categoryInfo['categoryId']}
                                    onClick={async () => {
                                        let newReq = {
                                            categoryName : categoryInfo['categoryName'],
                                            description : categoryInfo['description']
                                        };
                                        await setRequestBody(newReq);
                                        await setTargetCategoryId(categoryInfo['categoryId']);
                                        await setIsEditModalOpen(true);
                                    }}
                                >
                                    {categoryInfo['categoryName']}
                                </Button>
                                <Button
                                    variant="danger"
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '0px',
                                        padding: '3px'
                                    }}
                                    onClick={async () => {
                                        if (await confirm("Are you sure to delete the category?")) {
                                            await deleteCategory(categoryInfo['categoryId']);
                                        }
                                    }}
                                >
                                    {
                                        isDeleteLoading ?
                                            <Spinner size={"sm"} />
                                            :
                                            <RxCross2 size={"15"} />
                                    }
                                </Button>
                            </div>
                        );
                    }
                })
            }
            <AddLocationCategory
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
                onRefresh={getCategoryList}
            />
            <EditLocationCategory
                givenRequestBody={requestBody}
                givenId={targetCategoryId}
                isOpen={isEditModalOpen}
                setIsOpen={setIsEditModalOpen}
                onRefresh={getCategoryList}
            />
        </Container>
    );
};

export default LocationCategoryMain;