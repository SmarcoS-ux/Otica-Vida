import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "../../componentes/Profile/profile";
import Home from "../../componentes/Home/home";
import Login from "../../componentes/Login/login";
import UserRegister from "../../componentes/UserRegister/userRegister";
import PrivateRoutes from './Private_Routes';

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>                
                <Route exact path="/profile" element={<PrivateRoutes/>}>
                    <Route exact path="/profile" element={<Profile/>}/>
                </Route>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/register" element={<UserRegister/>}/>
            </Routes>
        </BrowserRouter>
    );
}