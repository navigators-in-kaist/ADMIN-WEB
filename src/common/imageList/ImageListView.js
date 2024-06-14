import React, {useState} from 'react';
import ImageDataView from "./ImageDataView";
import {confirm} from "../../utils/confirm";
import {Alert, Button, Spinner} from "react-bootstrap";
import AddImageModal from "./modals/AddImageModal";

const ImageListView = ({ imageDataList, type, entityId, onRefresh }) => {

    const [isImageAddModalOpen, setIsImageModalOpen] = useState(false);

    return (
        <div>
            <div
                style={{
                    width: '100%',
                    padding: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid #ebebeb',
                    borderRadius: '5px'
                }}
            >
                {
                    imageDataList.length > 0 &&
                    imageDataList.map(imageData =>  {
                        return (
                            <ImageDataView
                                key={imageData["id"]}
                                imageId={imageData["id"]}
                                url={imageData["imgUrl"]}
                                onRefresh={onRefresh}
                            />
                        );
                    })
                }
                {
                    imageDataList.length === 0 &&
                    <Alert
                        style={{
                            width: '100%'
                        }}
                        variant={"info"}
                    >
                        There is no image.
                    </Alert>
                }
            </div>
            <div
                style={{
                    marginTop: '5px',
                    width: '100%',
                    textAlign: 'right'
                }}
            >
                <Button
                    variant="primary"
                    onClick={async () => {
                        await setIsImageModalOpen(true);
                    }}
                >
                    Add a new image
                </Button>
                <AddImageModal
                    isOpen={isImageAddModalOpen}
                    setIsOpen={setIsImageModalOpen}
                    type={type}
                    entityId={entityId}
                    onRefresh={onRefresh}
                />
            </div>
        </div>
    );

};

export default ImageListView;