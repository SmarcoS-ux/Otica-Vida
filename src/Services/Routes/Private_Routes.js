import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { AuthContext } from "../../componentes/Context/auth";

export default function PrivateRoutes(){
    const { verifyLogin } = useContext(AuthContext);

    return verifyLogin() ? <Outlet/> : <Navigate to="/login"/>
}