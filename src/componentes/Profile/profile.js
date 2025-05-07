import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from 'is-valid-email';
import { isCpf } from 'iscpf';
import $ from 'jquery';
import "./style-profile.css";
import { backend_port, backend_server, frontend_port, frontend_server } from '../../Services/Server/server.config';

export default function Profile(){
    const navigate = useNavigate();

    const[isUpdate, setIsUpdate] = useState(false);

    const[msgButtonEdit, setMsgButtonEdit] = useState("Editar");
    const[styleButtonEdit, setStyleButtonEdit] = useState("btn-edit");

    const img_success = "/assets/sucesso.png";
    const img_error = "/assets/fechar.png";
    const img_warning = "/assets/atencao.png";
    const ico_loading = "/assets/loading2.gif";

    const[isLoading, setIsLoading] = useState(false);
    const[openMessage, setOpenMessage] = useState(false);
    const[message, setMessage] = useState("");
    const[styleMessage, setStyleMessage] = useState("");
    const[icoMessage, setIcoMessage] = useState();

    useEffect(() => {
        let fieldset_dados = document.getElementById("fieldset_dados");
        let fieldset_endereco = document.getElementById("fieldset_endereco");

        fieldset_dados.setAttribute("disabled", "disabled");
        fieldset_endereco.setAttribute("disabled", "disabled");

        loadingUserData();
    }, []);

    const loadingUserData = () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem("@InternalAuth"));

            $("#inp-nome").val(userData.nome);
            $("#inp-email").val(userData.email);
            $("#inp-telefone").val(formatarTelefone(userData.telefone));
            $("#inp-dt-nascimento").val(userData.dt_nascimento.split("T")[0]);
            $("#inp-cpf").val(userData.cpf);
            $("#opt-logradouro").val(userData.tipo_logradouro);
            $("#nome-logradouro").val(userData.nome_logradouro);
            $("#numero-logradouro").val(userData.numero_logradouro);

        } catch {
            console.log("Erro ao carregar os dados de usuário.");
        }
    }
 
    const formatarTelefone = (phone) => {
        if(phone.length === 11){
            var phoneF = phone.trim();
            return `(${phoneF.slice(0,2)}) ${phoneF.slice(2,7)}-${phoneF.slice(7,11)}`;

        } else{
            return false;
        }   
    }

    function habitilarUpdate(){
        setMsgButtonEdit("Atualizar");
        setStyleButtonEdit("btn-update");

        let fieldset_dados = document.getElementById("fieldset_dados");
        let fieldset_endereco = document.getElementById("fieldset_endereco");

        fieldset_dados.removeAttribute("disabled");
        fieldset_endereco.removeAttribute("disabled");

        if(isUpdate === true){
            validarRegistro();
        }

        setIsUpdate(true);
    }
    function desabilitarUpdate(){
        setMsgButtonEdit("Editar");
        setStyleButtonEdit("btn-edit");

        let fieldset_dados = document.getElementById("fieldset_dados");
        let fieldset_endereco = document.getElementById("fieldset_endereco");

        fieldset_dados.setAttribute("disabled", "disabled");
        fieldset_endereco.setAttribute("disabled", "disabled");

        setIsUpdate(false);
    }

    const validarRegistro = async () => {
        try {   
            setMsgButtonEdit("");
            setIsLoading(true);

            let nome = $("#inp-nome").val();
            let email = $("#inp-email").val();
            let telefone = $("#inp-telefone").val().replace("(", "").replace(")", "").replace("-", "").replace(" ", "");
            let dt_nascimento = $("#inp-dt-nascimento").val();
            let cpf = $("#inp-cpf").val();
            let tipo_logradouro = $("#opt-logradouro").val();
            let nome_logradouro = $("#nome-logradouro").val();
            let numero_logradouro = $("#numero-logradouro").val();

            if(nome === null || nome == "" || nome.trim() === ""){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-warning");
                setMessage("Preencha o campo Nome.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else if(!isValidEmail(email)){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-error");
                setMessage("Digite um E-mail válido.");
                setIcoMessage(img_error);
                setOpenMessage(true);

            } else if(telefone.trim().length !== 11){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-warning");
                setMessage("Digite um telefone válido");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else if(!isCpf(cpf)){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-warning");
                setMessage("Digite um CPF válido.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else {
                await atualizarDados(nome, email, telefone, dt_nascimento, cpf, tipo_logradouro, nome_logradouro, numero_logradouro);
            }

        } catch {
            console.log("Erro no formulário.");
        }
    }

    async function atualizarDados(nome, email, telefone, dt_nascimento, cpf, tipo_logradouro, nome_logradouro, numero_logradouro){
        try {
            const connection = await fetch(backend_server + backend_port + "/atualizarDados", {
                origin: frontend_server + frontend_port,
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
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
                    token: sessionStorage.getItem("@Token").replaceAll('"', "")
                })
            });

            const response = await connection.json();
            if(typeof response === 'object' && response.status === 200){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-success");
                setMessage("Dados atualizados com sucesso.");
                setIcoMessage(img_success);
                setOpenMessage(true);

                sessionStorage.setItem("@InternalAuth", JSON.stringify(response.dataUserUpdated));

                setTimeout(() => {
                    desabilitarUpdate();
                }, 2000);

            } else if(typeof response === 'object' && response.status === 500){
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-error");
                setMessage("Ocorreu um erro ao tentar atualizar os dados.");
                setIcoMessage(img_error);
                setOpenMessage(true);

            } else {
                setMsgButtonEdit("Atualizar");
                setIsLoading(false);
                setStyleMessage("container-message-error");
                setMessage("Erro no servidor... Tente mais tarde.");
                setIcoMessage(img_error);
                setOpenMessage(true);
            }

        } catch {
            console.log("Erro ao atualizar os dados.");
            setMsgButtonEdit("Atualizar");
            setIsLoading(false);
            setStyleMessage("container-message-error");
            setMessage("Erro interno.");
            setIcoMessage(img_error);
            setOpenMessage(true);
        }
    }

    const logOut = () => {
        try {
            sessionStorage.removeItem("@InternalAuth");
            sessionStorage.removeItem("@Token");

        } catch {
            console.log("Erro ao fazer logout.");
        }
    }

    return (
        <div className='container-profile'>
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
                    <button 
                        id='btn-logout'
                        onClick={() => {
                            logOut();
                            navigate("/");
                        }}>
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
                            />
                        </div>
                        <div className='container-email-telefone'>
                            <div className='container-email'>
                                <label>E-mail:</label>
                                <input 
                                    id="inp-email" 
                                    type='email' 
                                    name='email'
                                    disabled
                                />
                            </div> 
                            <div className='container-telefone'>
                                <label>Telefone</label>
                                <input 
                                    id="inp-telefone" 
                                    type='text' 
                                    name='telefone'
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
                    <div className='container-buttons'>
                        <button 
                            id="btn-submit"
                            className={styleButtonEdit}
                            onClick={() => habitilarUpdate()}>
                            {(isLoading) ?
                                <img 
                                    id="ico-loading"
                                    src={ico_loading} 
                                    alt=""
                                /> :
                                <></>
                            }
                            {msgButtonEdit}
                        </button>
                        <button 
                            id='btn-limpar'
                            type='reset'>
                            Limpar
                        </button>
                        <button 
                            id='btn-voltar'
                            onClick={() => navigate("/")}>
                            Voltar
                        </button>
                    </div>
                </div>
            </form>
            <form 
                id="form-agendamentos"
                onSubmit={(e) => e.preventDefault()}>
                <div className='container-agendamentos'>
                    <table id="tabela-agendamentos">
                        <caption><b>Meus agendamentos</b></caption>
                        <thead>
                            <tr>
                                <th>Registro</th>
                                <th>Data</th>
                                <th>Horário</th>
                                <th>Dia</th>
                            </tr>
                        </thead> 
                        <tbody>
                            <tr>
                                <td>02/06/2021 : 23:11</td>
                                <td>02/07/2021</td>
                                <td>10:00h</td>
                                <td>Terça-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            <tr>
                                <td>01/07/2023 : 02:11</td>
                                <td>03/07/2023</td>
                                <td>16:00h</td>
                                <td>Sexta-Feira</td>
                            </tr>
                            
                        </tbody>                                          
                    </table>
                </div>
            </form>
        </div>
    );
}