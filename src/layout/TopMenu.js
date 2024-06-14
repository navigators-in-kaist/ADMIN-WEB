import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

const TopMenu = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        if (path === '/') {
            return (location.pathname === path);
        } else {
            return location.pathname.startsWith(path);
        }
    }

    return (
        <Navbar bg="light" data-bs-theme="light">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link
                        onClick={() => navigate("/building")}
                        style={(isActive("/building") || isActive("/")) ? {color: 'black'} : {}}
                    >
                        Buildings
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate("/-location-category")}
                        style={isActive("/-location-category") ? {color: 'black'} : {}}
                    >
                        Location Categories
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate("/location")}
                        style={isActive("/location") ? {color: 'black'} : {}}
                    >
                        Locations
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate("/user")}
                        style={isActive("/user") ? {color: 'black'} : {}}
                    >
                        Users
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate("/contribution")}
                        style={isActive("/contribution") ? {color: 'black'} : {}}
                    >
                        Contribution
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default TopMenu;