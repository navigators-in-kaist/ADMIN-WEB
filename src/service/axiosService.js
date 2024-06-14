import axios from "axios";
import {toast} from "react-toastify";

const baseUrl = `http://121.184.96.94:7070/api/v1`

const sendLoginRequest = async (id, passwd, successCallback, failureCallback) => {
    let url = baseUrl + `/auth/login/admin`;
    let requestBody = {
        "adminId" : id,
        "password" : passwd
    };
    try {
        const response = await axios.post(url,
            JSON.stringify(requestBody),
            {
            headers: {
                "Content-Type" : "application/json"
            }
        });
        await successCallback(response);
    } catch (e) {
        await failureCallback(e);
    }
};


/**
 * All toasts for error are done here.
 * */
const sendGetRequest = async (path, successCallback, failureCallback) => {
    let url = `${baseUrl}${path}`;
    try {
        const response = await axios.get(url,
            {
                headers: {
                    "kauthorization" : localStorage.getItem("k_auth_token"),
                    "Content-Type" : "application/json"
                }
            });
        await successCallback(response);
    } catch (e) {
        console.log(e);
        let message = (e.response) ? (e.response.data ? (e.response.data.reason ? e.response.data.reason : "Failed to get!") : "Failed to get!") : "Failed to get!";
        toast.error(message);
        failureCallback(e);
    }
};

const sendPutRequest = async (path, requestBody, successCallback, failureCallback) => {
    let url = `${baseUrl}${path}`;
    try {
        const response = await axios.put(url,
            JSON.stringify(requestBody),
            {
                headers: {
                    "kauthorization" : localStorage.getItem("k_auth_token"),
                    "Content-Type" : "application/json"
                }
            });
        await successCallback(response);
    } catch (e) {
        console.log(e);
        let message = (e.response) ? (e.response.data ? (e.response.data.reason ? e.response.data.reason : "Failed to put!") : "Failed to put!") : "Failed to put!";
        toast.error(message);
        failureCallback(e);
    }
};

const sendPostRequest = async (path, requestBody, successCallback, failureCallback) => {
    let url = `${baseUrl}${path}`;
    try {
        const response = await axios.post(url,
            JSON.stringify(requestBody),
            {
                headers: {
                    "kauthorization" : localStorage.getItem("k_auth_token"),
                    "Content-Type" : "application/json"
                }
            });
        await successCallback(response);
    } catch (e) {
        console.log(e);
        let message = (e.response) ? (e.response.data ? (e.response.data.reason ? e.response.data.reason : "Failed to post!") : "Failed to post!") : "Failed to post!";
        toast.error(message);
        failureCallback(e);
    }
};

const sendDeleteRequest = async (path, successCallback, failureCallback) => {
    let url = `${baseUrl}${path}`;
    try {
        const response = await axios.delete(url,
            {
                headers: {
                    "kauthorization" : localStorage.getItem("k_auth_token"),
                    "Content-Type" : "application/json"
                }
            });
        await successCallback(response);
    } catch (e) {
        console.log(e);
        let message = (e.response) ? (e.response.data ? (e.response.data.reason ? e.response.data.reason : "Failed to delete!") : "Failed to delete!") : "Failed to delete!";
        toast.error(message);
        failureCallback(e);
    }
};


const axiosService = {
    sendLoginRequest,
    sendGetRequest,
    sendPutRequest,
    sendPostRequest,
    sendDeleteRequest
};

export default axiosService;