import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import isValidEmail from 'is-valid-email';
import $ from 'jquery';
import "./style-login.css";

import { AuthContext } from '../Context/auth';

export default function Login(){
    const navigate = useNavigate();

    const { isAuth, verifyLogin } = useContext(AuthContext);

    const img_success = "/assets/sucesso.png";
    const img_error = "/assets/fechar.png";
    const ico_loading = "/assets/loading2.gif";

    const[isLoading, setIsLoading] = useState(false);
    const[isMessage, setIsMessage] = useState(false);
    const[message, setMessage] = useState("");
    const[styleMessage, setStyleMessage] = useState("");
    const[icoMessage, setIcoMessage] = useState();

    const validarLogin = async () => {
        const email = $("#inp-user").val();
        const password = $("#inp-password").val();

        if(!isValidEmail(email)){
            setIsLoading(false);
            setMessage("Preencha com E-mail válido.");
            setStyleMessage("messages-error");
            setIcoMessage(img_error);
            setIsMessage(true);

        } else if(password === "") {
            setIsLoading(false);
            setMessage("Preencha o campo Senha.");
            setStyleMessage("messages-error");
            setIcoMessage(img_error);
            setIsMessage(true);

        } else {
            await login(email, password);
        }
    }

    const login = async (email, password) => {
        try {
            setIsMessage(false);
            setIsLoading(true);

            const isAuthInternal = await isAuth(email, password);

            if(isAuthInternal.status === 200){               
                setIsLoading(false);
                setMessage("Logado com sucesso.");
                setStyleMessage("messages-success");
                setIcoMessage(img_success);
                setIsMessage(true);

                setTimeout(() => {
                    navigate("/profile");
                }, 2000);

            } else if(isAuthInternal.status === 401) {
                setIsLoading(false);
                setMessage("Usuário ou Senha incorretos.");
                setStyleMessage("messages-error");
                setIcoMessage(img_error);
                setIsMessage(true);

            } else if(isAuthInternal.status === 404){
                setIsLoading(false);
                setMessage("E-mail não cadastrado.");
                setStyleMessage("messages-error");
                setIcoMessage(img_error);
                setIsMessage(true);

            } else {
                setIsLoading(false);
                setMessage("Erro interno. Tente novamente.");
                setStyleMessage("messages-error");
                setIcoMessage(img_error);
                setIsMessage(true);
            }

        } catch {
            setIsLoading(false);
            console.log("Erro ao fazer login 1.");
        }
    }

    if(!verifyLogin()){
        return (
            <div className='container-login'>
                <div className='container-message'>
                    <p>Para acessar os registros de agendamentos é necessário o Login.</p>
                </div>
                <div className='container-form'>
                    <form
                        id="form-login"
                        onSubmit={(e) => e.preventDefault()}>
                        <h1>Login</h1>
                        {(isLoading) ? 
                            <div className='container-loading'>
                                <img 
                                    id="ico-loading" 
                                    src={ico_loading} 
                                    alt=''
                                />    
                            </div> : 
                            <></>
                        }
                        {(isMessage) ? 
                            <div className={styleMessage}>
                                <img 
                                    id="img"
                                    src={icoMessage} 
                                    alt=""
                                />
                                <p>{message}</p>
                            </div> :
                            <></>
                        }             
                        <div className='container-user'>
                            <label>Email:</label>
                            <input 
                                id="inp-user" 
                                type="text"
                                required
                            />    
                        </div>    
                        <div className='container-password'>
                            <label>Senha:</label>
                            <input 
                                id="inp-password" 
                                type="password"
                                required
                            />
                        </div>  
                        <div className='line1'></div>  
                        <div className='line2'></div>
                        <button 
                            id="btn-voltar"
                            onClick={() => navigate("/")}>
                            Voltar
                        </button>
                        <button 
                            id="btn-enviar"
                            onClick={() => validarLogin()}>
                            Acessar
                        </button>
                    </form>
                    <div className='container-link-register'>
                        <span>Não possui cadastro?</span><br/>
                        <Link 
                            id="link-register"
                            to="/register">
                            Cadastrar agora
                        </Link>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Navigate to="/"/>
    }
}