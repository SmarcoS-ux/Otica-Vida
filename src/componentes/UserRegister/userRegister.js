import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isCpf } from 'iscpf';
import { isValidEmail } from 'is-valid-email';
import $ from 'jquery';
import "./style-user-register.css"
import { backend_port, backend_server, frontend_port, frontend_server } from '../../Services/Server/server.config';

export default function UserRegister(){
    const navigate = useNavigate();

    const img_success = "/assets/sucesso.png";
    const img_error = "/assets/fechar.png";
    const img_warning = "/assets/atencao.png";
    const ico_loading = "/assets/loading2.gif";

    const[textBtnRegister, setTextBtnRegister] = useState("Registrar");
    const[isLoadingRegister, setIsLoadingRegister] = useState(false);
    const[openMessage, setOpenMessage] = useState(false);
    const[message, setMessage] = useState("");
    const[styleMessage, setStyleMessage] = useState("");
    const[icoMessage, setIcoMessage] = useState();

    const[telefone, setTelefone] = useState();
    const numberPhone = (phone) => {
        var phoneF = phone.replace(/\D/g, "");
        setTelefone(phoneF);
    }

    const[cpf, setCpf] = useState();
    const numberCpf = (cpf) => {
        var cpfF = cpf.replace(/\D/g, "");
        setCpf(cpfF);
    }

    const[styleInputPasswords, setStyleInputPasswords] = useState("container-password");
    const[showPassword1, setShowPassword1] = useState('/assets/hidden.png');
    const[showPassword2, setShowPassword2] = useState('/assets/hidden.png');
    const showHiddenPassword1 = () => {
        if(showPassword1 === '/assets/hidden.png'){
            setShowPassword1('/assets/show.png');
            document.getElementById("password1").setAttribute('type', 'text');

        } else{
            setShowPassword1('/assets/hidden.png');
            document.getElementById("password1").setAttribute('type', 'password');
        }
    }
    const showHiddenPassword2 = () => {
        if(showPassword2 === '/assets/hidden.png'){
            setShowPassword2('/assets/show.png');
            document.getElementById("password2").setAttribute('type', 'text');

        } else{
            setShowPassword2('/assets/hidden.png');
            document.getElementById("password2").setAttribute('type', 'password');
        }
    }

    const validarRegistro = async () => {
        try {   
            setTextBtnRegister("");
            setIsLoadingRegister(true);
            setStyleInputPasswords("");

            let nome = $("#inp-nome").val();
            let email = $("#inp-email").val();
            let telefone = $("#inp-telefone").val();
            let dt_nascimento = $("#inp-dt-nascimento").val();
            let cpf = $("#inp-cpf").val();
            let tipo_logradouro = $("#opt-logradouro").val();
            let nome_logradouro = $("#nome-logradouro").val();
            let numero_logradouro = $("#numero-logradouro").val();
            let password1 = $("#password1").val();
            let password2 = $("#password2").val();

            if(nome === null || nome == "" || nome.trim() === ""){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-warning");
                setMessage("Preencha o campo Nome.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else if(!isValidEmail(email)){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-error");
                setMessage("Digite um E-mail válido.");
                setIcoMessage(img_error);
                setOpenMessage(true);

            } else if(telefone.trim().length !== 11){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-warning");
                setMessage("Digite um telefone válido");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else if(!isCpf(cpf)){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-warning");
                setMessage("Digite um CPF válido.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else if(password1 !== password2){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);

                setStyleMessage("container-message-warning");
                setMessage("Os campos Senhas estão diferentes.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

                setStyleInputPasswords("password-different");

            } else {
                await registrarUsuario(nome, email, telefone, dt_nascimento, cpf, tipo_logradouro, nome_logradouro, numero_logradouro, password1);
            }

        } catch {
            console.log("Erro no formulário.");
        }
    }

    const registrarUsuario = async (nome, email, telefone, dt_nascimento, cpf, tipo_logradouro, nome_logradouro, numero_logradouro, password) => {
        try {
            const connection = await fetch(backend_server + backend_port + "/newUser", {
                origin: frontend_server + frontend_port,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    dt_nascimento: dt_nascimento,
                    cpf: cpf,
                    tipo_logradouro: tipo_logradouro,
                    nome_logradouro: nome_logradouro,
                    numero_logradouro: numero_logradouro,
                    password: password
                })
            });

            const response = await connection.json();
            if(response.status === 201){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-success");
                setMessage("Usuário registrado com sucesso.");
                setIcoMessage(img_success);
                setOpenMessage(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } else if(response.status === 409){
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-error");
                setMessage("Este E-mail já está cadastrado.");
                setIcoMessage(img_error);
                setOpenMessage(true);

            } else {
                setTextBtnRegister("Registrar");
                setIsLoadingRegister(false);
                setStyleMessage("container-message-error");
                setMessage("Ocorreu uma falha. Tente novamente.");
                setIcoMessage(img_error);
                setOpenMessage(true);
            }
        
        } catch(error) {
            console.log("Erro FrontEnd ao registrar usuário. " + error.message);
            setTextBtnRegister("Registrar");
            setIsLoadingRegister(false);
            setStyleMessage("container-message-error");
            setMessage("Ocorreu um erro. Tente novamente.");
            setIcoMessage(img_error);
            setOpenMessage(true);
        }
    }

    return (
        <div className='container-user-register'>
            <div className='line'></div>
            <form 
                id='form-profile'
                onSubmit={(e) => e.preventDefault()}> 
                <div className='container-img'>
                    <a 
                        id="link-home"
                        onClick={() => navigate("/")}>
                        <img src="/assets/logo.png" alt=""/>
                    </a>
                    <button
                        id="btn-user">
                        <img src="/assets/user.png" alt=""/>
                    </button>
                </div>
                <div className='container-logout'>
                    <button id='btn-logout'>
                        <img id='img-logout' src="/assets/logout.png" alt=""/>    
                    </button>
                </div>             
                <div className='container-dados'>
                    {(openMessage) ?
                        <div className={styleMessage}>
                            <img
                                className="ico-message" 
                                src={icoMessage} 
                                alt=""
                            />
                            <p>{message}</p>
                        </div> :
                        <></>
                    }                    
                    <fieldset id="fieldset_dados">
                        <legend>Dados pessoais</legend>
                        <div className='container-nome'>
                            <label>Nome:</label>
                            <input 
                                id="inp-nome" 
                                type='text' 
                                name='nome'
                                required
                            />
                        </div>
                        <div className='container-email-telefone'>
                            <div className='container-email'>
                                <label>E-mail:</label>
                                <input 
                                    id="inp-email" 
                                    type='email' 
                                    name='email'
                                    required
                                />
                            </div> 
                            <div className='container-telefone'>
                                <label>Telefone</label>
                                <input 
                                    id="inp-telefone" 
                                    type='text' 
                                    name='telefone'
                                    value={telefone}
                                    onChange={(e) => numberPhone(e.target.value)}
                                />
                            </div>                       
                        </div>
                        <div className='container-nascimento-cidade'>
                            <div className='container-nascimento'>
                                <label>Nascimentos:</label>
                                <input 
                                    id="inp-dt-nascimento" 
                                    type="date" 
                                    name='dt-nascimento'
                                />
                            </div>
                            <div className='container-cidade'>
                                <label>CPF:</label>
                                <input 
                                    id="inp-cpf" 
                                    type='text' 
                                    name='cpf'
                                    value={cpf}
                                    onChange={(e) => numberCpf(e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="fieldset_endereco">
                        <legend>Endereço</legend>
                        <div className='container-rua-numero'>
                            <div className='container-logradouro'>
                                <select 
                                    id="opt-logradouro"
                                    name="opt-logradouro">
                                    <option 
                                        value="rua"
                                        selected>
                                        Rua
                                    </option>  
                                    <option value="avenida">Avenida</option>
                                    <option value="estrada">Estrada</option>
                                    <option value="acampamento">Acampamento</option>
                                    <option value="fazenda">Fazenda</option>
                                    <option value="beco">Beco</option>      
                                    <option value="corrego">Córrego</option>
                                    <option value="vila">Vila</option>
                                </select>
                                <input 
                                    id="nome-logradouro" 
                                    type="text" 
                                    placeholder=''
                                />
                                <input 
                                    id="numero-logradouro" 
                                    type='number' 
                                    placeholder='Nº'
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset id="fieldset_passwords">
                        <legend>Senha de acesso</legend>
                        <div className='container-passwords'>
                            <div className='container-password'>
                                <input 
                                    id="password1" 
                                    className={styleInputPasswords}
                                    type="password"
                                    placeholder='Senha'
                                />
                                <img 
                                    src={showPassword1} 
                                    alt=""
                                    onClick={() => showHiddenPassword1()}
                                />
                            </div>
                            <div className='container-password'>
                                <input 
                                    id="password2" 
                                    className={styleInputPasswords}
                                    type="password"
                                    placeholder='Repetir senha'
                                />
                                <img 
                                    src={showPassword2} 
                                    alt=""
                                    onClick={() => showHiddenPassword2()}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div className='container-buttons'>
                        <button 
                            id="btn-submit"
                            className={"btn-register"}
                            onClick={() => validarRegistro()}>
                            {(isLoadingRegister) ? 
                                <img 
                                    id="ico-loading" 
                                    src={ico_loading} 
                                    alt=""
                                /> :
                                <></>
                            }    
                            {textBtnRegister}
                        </button>
                        <button 
                            id='btn-limpar'
                            type='reset'
                            onClick={() => {
                                setCpf("");
                                setTelefone("");
                            }}>
                            Limpar
                        </button>
                        <button 
                            id='btn-voltar'
                            onClick={() => navigate("/login")}>
                            Voltar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}