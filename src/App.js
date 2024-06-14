import './App.css';
import RenderOnLogIn from "./auth/RenderOnLogIn";
import RenderOnLogOut from "./auth/RenderOnLogOut";
import Login from "./auth/Login";
import {Slide, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from "./auth/service/AuthService";
import {Button} from "react-bootstrap";
import Home from "./Home";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
    return (
        <div className="App">
            <div className={"MainArea"}>
                <div
                    style={{
                        width: '100%',
                        padding: '10px',
                        display: 'inline-flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}
                >
                    <h3
                        style={{
                            fontWeight: 'bold',
                            color: '#727272'
                        }}
                    >
                        Trailblazer Admin Console
                    </h3>
                    {
                        AuthService.isLoggedIn() ?
                            <Button
                                style={{
                                    marginLeft: 'auto'
                                }}
                                variant="danger"
                                onClick={async () => {
                                    await window.localStorage.removeItem("k_auth_token");
                                    window.location.href = "/";
                                }}
                            >
                                Sign out
                            </Button>
                            :
                            <></>
                    }
                </div>
                <div
                    className={"InArea"}
                >
                    <RenderOnLogIn>
                        <Home />
                    </RenderOnLogIn>
                    <RenderOnLogOut>
                        <Login />
                    </RenderOnLogOut>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                draggable
                pauseOnHover
                theme="colored"
                transition={Slide}
                pauseOnFocusLoss={false}
            />
        </div>
    );
}

export default App;
