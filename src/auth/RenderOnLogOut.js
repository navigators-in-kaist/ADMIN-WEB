import React from 'react';
import AuthService from "./service/AuthService";

const RenderOnLogOut = ({ children }) => (!AuthService.isLoggedIn()) ? children : null;
export default RenderOnLogOut;