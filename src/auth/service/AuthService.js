
const isLoggedIn = () => {
    return window.localStorage.getItem("k_auth_token") != null;
}

const AuthService = {
    isLoggedIn
};

export default AuthService;