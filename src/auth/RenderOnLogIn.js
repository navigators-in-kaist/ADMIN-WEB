import React from 'react';
import AuthService from "./service/AuthService";

const RenderOnLogIn = ({ children }) => (AuthService.isLoggedIn()) ? children : null;

export default RenderOnLogIn;