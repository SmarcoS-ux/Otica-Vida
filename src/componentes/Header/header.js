import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style-header.css';

export default function Header(){
    const navigate = useNavigate();

    function scrollTo(local){
        let element = document.getElementsByTagName("a");
        for (let i=0; i< element.length; i++){
            //element[i].setAttribute("href", local);
            document.getElementById(local).scrollIntoView({behavior:'smooth'});
        }
    }

    return(
        <header id="header" className="Header">
            <div className="black-line"><p></p></div>
            <div class="header">
                <div className="Logo">
                    <a onClick={() => scrollTo("header")}><img src="/assets/logo.png" alt="Logo"/></a>
                </div>
                <div className="Navegation">
                    <a onClick={() => scrollTo("produtos_id")}>PRODUTOS</a>
                    <a onClick={() => scrollTo("section-agendamento")}>AGENDAMENTO</a>
                    <a onClick={() => scrollTo("sobre_id")}>SOBRE</a>
                    <a onClick={() => scrollTo("footer_id")}>CONTATO</a> 
                    <a id="btn-profile" onClick={() => navigate("/profile")}>
                        <img src="/assets/user.png" alt=""/>
                    </a>
                </div>
            </div>
        </header> 
    );
}     