import React, { createContext } from 'react';

import { backend_server, backend_port, frontend_server, frontend_port } from '../../Services/Server/server.config';

export const AuthContext = createContext();

export function Context({ children }){
    var valor = 10;

    const verifyLogin = () => {
        const internalAuth = sessionStorage.getItem("@InternalAuth");
        if(internalAuth) return true;
    }

    const isAuth = async (email, password) => {
        try {
            const connection = await fetch(backend_server + backend_port + "/login", {
                origin: frontend_server + frontend_port,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const response = await connection.json();

            if(response.hasOwnProperty("status") && response.status === 200){
                sessionStorage.setItem("@InternalAuth", JSON.stringify(response.userData));
                sessionStorage.setItem("@Token", JSON.stringify(response.token));
            }

            return response;

        } catch {
            console.log("Erro ao fazer login 2.");
        }
    }
    
    return (
        <AuthContext.Provider
            value = {{valor: valor, isAuth, verifyLogin}}>
            { children }
        </AuthContext.Provider>
    );
}
