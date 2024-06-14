import React, {useState} from 'react';
import {Image, Button, Spinner} from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import {toast} from "react-toastify";
import axiosService from "../../service/axiosService";
import {confirm} from "../../utils/confirm";

const ImageDataView = ({ url, imageId, onRefresh }) => {

    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const deleteImage = async () => {
        await setIsDeleteLoading(true);
        const sCallback = async (res) => {
            toast.success("Deleted!");
            await onRefresh();
        };
        const fCallback = async (e) => {
            // pass
        };
        let path = `/image/${imageId}`;
        await axiosService.sendDeleteRequest(path, sCallback, fCallback);
        await setIsDeleteLoading(false);
    }

    return (
        <div
            style={{
                display: 'inline-flex',
                width: '100px',
                margin: '0px 5px',
                alignItems: 'center'
            }}
        >
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <Image src={url} rounded fluid/>
                <Button
                    variant="danger"
                    style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        padding: '3px'
                    }}
                    onClick={async () => {
                        if (await confirm("Are you sure to delete the image?")) {
                            deleteImage();
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
        </div>
    );
};

export default ImageDataView;