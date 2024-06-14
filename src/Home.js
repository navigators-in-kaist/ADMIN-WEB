import React from 'react';
import {Container, Nav, Navbar, Row} from "react-bootstrap";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import BuildingMain from "./component/building/BuildingMain";
import ContributionMain from "./component/contribution/ContributionMain";
import LocationMain from "./component/location/LocationMain";
import UserMain from "./component/user/UserMain";
import NotFound from "./component/etc/NotFound";
import TopMenu from "./layout/TopMenu";
import BuildingDetail from "./component/building/BuildingDetail";
import LocationDetail from "./component/location/LocationDetail";
import UserDetail from "./component/user/UserDetail";
import LocationCategoryMain from "./component/locationCategory/LocationCategoryMain";

const Home = () => {
    return (
        <BrowserRouter>
            <div>
                <TopMenu />
                <div
                    style={{
                        width : '100%',
                        height: '730px',
                        padding: '10px'
                    }}
                >
                    {/* main data view */}
                    <Routes>
                        <Route path={"/"} exact element={<BuildingMain />} />
                        <Route path={"/building"} element={<BuildingMain />} />
                        <Route path={"/building/:buildingId"} element={<BuildingDetail />} />
                        <Route path={"/contribution"} element={<ContributionMain />} />
                        <Route path={"/location"} element={<LocationMain />} />
                        <Route path={"/location/:locationId"} element={<LocationDetail />} />
                        <Route path={"/-location-category"} element={<LocationCategoryMain />} />
                        <Route path={"/user"} element={<UserMain />} />
                        <Route path={"/user/:userId"} element={<UserDetail />} />
                        <Route path={"/*"} element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Home;