import React, { useContext, useState } from 'react';
import "./style-capa.css";
import "./style-section-produtos.css";
import "./style-sobre.css";
import "./style-section-agendamento.css";
import $ from 'jquery';

import Header from '../Header/header';
import Footer from '../Footer/footer';

import { frontend_port, frontend_server, backend_port, backend_server } from '../../Services/Server/server.config';

import { AuthContext } from '../Context/auth';

export default function Home(){
    const { valor } = useContext(AuthContext);
    
    const img_success = "/assets/sucesso.png";
    const img_error = "/assets/fechar.png";
    const img_warning = "/assets/atencao.png";
    const ico_loading = "/assets/loading2.gif";

    const[isLoadingDisponibilidade, setIsLoadingDisponibilidade] = useState(false);
    const[isLoadingAgendamento, setIsLoadingAgendamento] = useState(false);
    const[openMessage, setOpenMessage] = useState(false);
    const[message, setMessage] = useState("");
    const[styleMessage, setStyleMessage] = useState("");
    const[icoMessage, setIcoMessage] = useState();

    const[messageBtnVerificar, setMessageBtnVerificar] = useState("Verificar disponibilidade");
    const[messageBtnAgendar, setMessageBtnAgendar] = useState("Agendar");

    
    const validarFormulario = async () => {
        setMessageBtnVerificar("");
        setIsLoadingDisponibilidade(true);

        let dt_agendamento = $("#inp-data").val();
        let horario = $("#select-time").val();
        let comentario = $("#comentario").val();

        if(dt_agendamento == "" || horario == ""){
            console.log("Preeencha todos os campos.");

            setIsLoadingDisponibilidade(false);
            setMessageBtnVerificar("Verificar disponibilidade");

            setStyleMessage("container-message-warning");
            setMessage("Preencha os campos Data e Horário.");
            setIcoMessage(img_warning);
            setOpenMessage(true);

            return 'empty';

        } else{
            setOpenMessage(false);

            if(await verificarDisponibilidade(dt_agendamento, horario, comentario)){
                return true;

            } else {
                return false;
            }       
        }
    }

    const verificarDisponibilidade = async (dt_agendamento, horario, comentario) => {
        console.log("verificando...");
        try {
            const connection = await fetch(backend_server + backend_port + "/verificarDisponibilidade", {
                origin: frontend_server + frontend_port,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dt_agendamento: dt_agendamento,
                    horario: horario,
                    comentario: comentario
                })
            });

            const response = await connection.json();
            console.log(response);

            if(response.status === 200){
                setIsLoadingDisponibilidade(false);
                setMessageBtnVerificar("Verificar disponibilidade");

                setStyleMessage("container-message-success");
                setMessage("Horário disponível. Clique em 'Agendar'");
                setIcoMessage(img_success);
                setOpenMessage(true);

                return true;

            } else if(response.status === 400){
                setIsLoadingDisponibilidade(false);
                setMessageBtnVerificar("Verificar disponibilidade");

                setStyleMessage("container-message-error");
                setMessage("Dia ou Horário indisponível.");
                setIcoMessage(img_error);
                setOpenMessage(true);

                return false;

            } else {
                setIsLoadingDisponibilidade(false);
                setMessageBtnVerificar("Verificar disponibilidade");

                setStyleMessage("container-message-error");
                setMessage("Ocorreu um erro. Tente novamente.");
                setIcoMessage(img_error);
                setOpenMessage(true);
            }

            /*if(typeof response.avail == 'boolean'){
                return response.available;
            }*/
            
        } catch {
            console.log("Erro ao verificar a disponibilidade.");
            setIsLoadingDisponibilidade(false);
            setMessageBtnVerificar("Verificar disponibilidade");

            setStyleMessage("container-message-error");
            setMessage("Ocorreu um erro. Tente novamente.");
            setIcoMessage(img_error);
            setOpenMessage(true);
        }
    }

    //console.log(JSON.parse(sessionStorage.getItem("@InternalAuth"))); 
    const agendar = async () => {
        try {
            setMessageBtnAgendar("Agendando...");
            setIsLoadingAgendamento(true);

            let id_user = JSON.parse(sessionStorage.getItem("@InternalAuth")).email;
            let dt_agendamento = $("#inp-data").val();
            let horario = $("#select-time").val();
            let comentario = $("#comentario").val();

            const verificarDisponibilidade = await validarFormulario();
            //console.log(verificarDisponibilidade);

            if(verificarDisponibilidade === true){
                const connection = await fetch(backend_server + backend_port + "/agendamento", {
                    origin: frontend_server + frontend_port,
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_user: id_user,
                        dt_agendamento: dt_agendamento,
                        horario: horario,
                        comentario: comentario
                    })
                });
                
                const response = await connection.json();

                if(response.status === 200){
                    setMessageBtnAgendar("Agendar");
                    setIsLoadingAgendamento(false);

                    setStyleMessage("container-message-success");
                    setMessage("Agendamento registrado com sucesso.");
                    setIcoMessage(img_success);
                    setOpenMessage(true);

                } else {
                    setMessageBtnAgendar("Agendar");
                    setIsLoadingAgendamento(false);

                    setStyleMessage("container-message-error");
                    setMessage("Ocorreu um erro ao registrar. Tente novamente.");
                    setIcoMessage(img_error);
                    setOpenMessage(true);
                }       

            } else if(verificarDisponibilidade === 'empty'){
                setMessageBtnAgendar("Agendar");
                setIsLoadingAgendamento(false);

                setStyleMessage("container-message-warning");
                setMessage("Preencha os campos Data e Horário.");
                setIcoMessage(img_warning);
                setOpenMessage(true);

            } else {
                setMessageBtnAgendar("Agendar");
                setIsLoadingAgendamento(false);

                setStyleMessage("container-message-warning");
                setMessage("Tente outra Data ou Horário.");
                setIcoMessage(img_warning);
                setOpenMessage(true);
            }

        } catch {
            console.log("Erro na requisição do Agendamento.");

            setMessageBtnAgendar("Agendar");
            setIsLoadingAgendamento(false);
            
            setStyleMessage("container-message-error");
            setMessage("Ocorreu um erro ao registrar. Tente novamente.");
            setIcoMessage(img_error);
            setOpenMessage(true);
        }
    }

    return (
        <> 
            <Header/>
            <div id="capa_id" className="section_capa">
                <h1>Preços baixos</h1>
            </div>         
            <section className="section_produtos">
                <div id="produtos_id" className="topo_section">
                    <h2>Nossos Produtos</h2>
                    <p>Trabalhamos com óculos de grau, óculos de sol, lentes transition nos modelos masculino, feminino e infantil.
                    Todos os nossos preços são acessíveis e contam com a melhor qualidade do mercado.</p>
                </div>
                <div className="vitrine_oculos">            
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Grau</h3>
                        <img src="/assets/oculos01.png" alt="Óculos de Grau"/>
                        <p>A partir de R$ 500,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div>                      
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos Transition</h3>
                        <img src="/assets/oculos02.png" alt="Óculos de Grau"/>
                        <p>A partir de R$ 750,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Sol</h3>
                        <img src="/assets/oculos03.png" alt="Óculos de Grau"/>
                        <p>A partir de R$ 700,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos Infantil</h3>
                        <img src="/assets/oculos04.png" alt="Óculos de Grau"/>
                        <p>A partir de R$ 350,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Luxo</h3>
                        <img src="/assets/oculos8.png" alt="Óculos de Luxo"/>
                        <p>A partir de R$ 1550,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Luxo</h3>
                        <img src="/assets/oculos9.png" alt="Óculos de Luxo"/>
                        <p>A partir de R$ 1100,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Luxo</h3>
                        <img src="/assets/oculos10.png" alt="Óculos de Luxo"/>
                        <p>A partir de R$ 1980,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                    <div className="apresentation_vitrine">
                        <h3>Óculos de Luxo</h3>
                        <img src="/assets/oculos11.png" alt="Óculos de Luxo"/>
                        <p>A partir de R$ 2250,00</p>
                        <div className='container-more'>
                            <img src="/assets/whatsapp.png"/>
                            <a href="https://web.whatsapp.com/" target="_blanck">Saiba mais...</a> 
                        </div> 
                    </div>
                </div>
                <div className="bottom-section">
                    <b>Todos os nossos produtos incluem:</b>
                    <ul type="none">
                        <li>Garantia de 1 ano;</li>
                        <li>Manutenção preventiva;</li>
                        <li>Descontos especiais na compra da segunda unidade;</li>
                        <li>Flexibilidade de pagamento;</li>
                    </ul>
                </div>  
            </section>
            <section id="sobre_id" className="sobre">
                <div className="intro_section">
                    <h2>Quem somo nós?</h2>
                    <p>Fundada em 2001, em Governador Valadares - MG, a Ótica Original iniciou suas atividades focada 
                    no atendimento ao público de renda mais baixa, sempre com o objetivo de proporcionar ao cliente
                    bom atendimento, qualidade e preço.</p>
                </div>
                <div className="exposicao">
                    <div id="img_farmacia1" className="img_farmacia"></div>
                    <div className="filiais_atendimento">
                        <h3>Nossas Filiais</h3>
                        <p>Hoje temos mais de 8 filiais pelo Brasil e na América</p>
                    </div>
                    <div className="filiais_atendimento">
                        <h3>Atendimento Flexível</h3>
                        <p>Nossa equipe é trienada para te atender</p>
                    </div>
                    <div id="img_farmacia2" className="img_farmacia"></div>
                </div>
                <div className="exposicao_2">
                    <div className="img_farmacia">
                        <img src="/assets/Banner1.png" alt="IMG-Prateleira"/>
                    </div>
                    <div className="filiais_atendimento">
                        <h3>Nossas Filiais</h3>
                        <p>Hoje temos mais de 20 filiais pelo Brasil e na América</p>
                    </div>
                    <div className="img_farmacia">
                        <img src="/assets/Banner2.png.png" alt="IMG-Prateleira"/>
                    </div>
                    <div className="filiais_atendimento">
                        <h3>Atendimento Flexível</h3>
                        <p>Nossa equipe é treinada para te atender</p>
                    </div>
                </div> 
            </section>
            <section id="section-agendamento" className='container-agendamento'>
                <form 
                    id="form-agendamento"
                    onSubmit={(e) => e.preventDefault()}>
                    <div className='container-subtitle-agendamento'>
                        <h3>Venha conversar com um especialista presencialmente.</h3>
                        <p>Agende sua visita abaixo:</p>
                    </div>    
                    {(openMessage) ? 
                        <div className={styleMessage}>
                            <img 
                                src={icoMessage} 
                                alt=""
                            />
                            <span>{message}</span>
                        </div> :
                        <></>  
                    }    
                    <div className='container-form-agendamento'>
                        <div className='container-dia-horario'>
                            <div className='container-data'>
                                <label>Data:</label>
                                <input 
                                    id="inp-data" 
                                    type='date'
                                    required
                                />
                            </div>
                            <div className='container-horario'>
                                <label>Horário:</label>
                                <select id="select-time">
                                    <option 
                                        value="08:00"
                                        selected
                                        required>
                                        08:00h
                                    </option>
                                    <option value="09:00">09:00h</option>
                                    <option value="10:00">10:00h</option>
                                    <option value="11:00">11:00h</option>
                                    <option value="13:00">13:00h</option>
                                    <option value="14:00">14:00h</option>
                                    <option value="15:00">15:00h</option>
                                    <option value="16:00">16:00h</option>
                                    <option value="17:00">17:00h</option>
                                    <option value="18:00">18:00h</option>
                                </select>
                            </div>
                            <div className='container-dia'>
                                <label>Dia:</label>
                                <select 
                                    id="select-dia"
                                    disabled>
                                    <option value="">Segunda-Feira</option>
                                    <option value="">Terça-Feira</option>
                                    <option value="">Quarta-Feira</option>
                                    <option value="">Quinta-Feira</option>
                                    <option value="">Sexta-Feira</option>
                                    <option value="">Sábado</option>
                                </select>
                            </div>
                        </div>
                        <div className='container-comentario-and-buttons'>
                            <textarea id="comentario" placeholder='Deixe uma observação aqui...'></textarea>
                            <div className='container-buttons'>
                                <button 
                                    id="btn-verificar"
                                    onClick={() => validarFormulario()}>
                                    {(isLoadingDisponibilidade) ? 
                                       <img 
                                            className='ico-loading'
                                            src={ico_loading}
                                            alt=""
                                        /> :
                                        <></>
                                    }    
                                    {messageBtnVerificar}
                                </button>
                                <button 
                                    id="btn-agendar"
                                    onClick={() => agendar()}>
                                    {(isLoadingAgendamento) ? 
                                        <img 
                                            className='ico-loading'
                                            src={ico_loading}
                                            alt=""
                                        /> :
                                        <></>
                                    }    
                                    {messageBtnAgendar}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            <a href="https://web.whatsapp.com/" target="_blank">
                <div className='popup-atendimento'>
                    <img src="/assets/whatsapp.png" alt=""/>
                    <p>Fale conosco</p>
                </div>
            </a>        
            <Footer/>
        </>      
    );
}      