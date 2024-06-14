import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Button, Container, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import axiosService from "../service/axiosService";

const Login = () => {

    const [inputId, setInputId] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const loginTry = async () => {
        await setIsLoading(true);
        const sCallback = async (data) => {
            let newToken = data.data.item['access_token'];
            await localStorage.setItem("k_auth_token", `Bearer ${newToken}`);
            window.location.href = "/";
        };
        const fCallback = async (e) => {
            console.log(e);
            let message = e.response ? (e.response.data.reason ? e.response.data.reason : "Failed to sign in.") : "Failed to sign in.";
            toast.error(message);
        };
        await axiosService.sendLoginRequest(inputId, inputPassword, sCallback, fCallback);
        await setIsLoading(false);
    };

    return (
        <div
            style={{
                padding: '150px'
            }}
        >
            <Container fluid>
                <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>PW</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                    />
                </Form.Group>
                <div
                    style={{
                        width: '100%',
                        textAlign: 'right',
                        marginTop: '10px'
                    }}
                >
                    <Button
                        variant="primary"
                        disabled={
                            isLoading || (inputId === "") || (inputPassword === "")
                        }
                        onClick={() => loginTry()}
                    >
                        {
                            isLoading ?
                                <Spinner size={"sm"} />
                                :
                                <>Sign In</>
                        }
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default Login;