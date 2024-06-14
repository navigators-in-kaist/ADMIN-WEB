import React from 'react';
import {Alert} from "react-bootstrap";

const NotFound = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                padding: '50px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center'
            }}
        >
            <Alert variant={"danger"}>
                404 NOT FOUND
            </Alert>
        </div>
    );
};

export default NotFound;