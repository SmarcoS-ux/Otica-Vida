import React from 'react';
import './style-footer.css';

export default function Footer(){
    return(
        <div id="footer_id" className="footer">
            <div className="topo_footer">
                <h2>Fale Conosco</h2>
                <p>Não perca tempo, venha conhecer uma de nossas lojas ou entre em contato através 
                   de nossas rede sociais ou da central de atendimento.</p>
            </div>
            <div className="contato_redes">
                <div className="contato">
                    <h3>Contato:</h3>
                    <div className="paragr_icons">
                        <div className="p_icons">
                            <img src="/assets/local.png" alt="icon_location" width='20' height='20'/>
                            <p id="localizacao">Governador Valadares, GV</p>
                        </div>
                        <div className="p_icons">
                            <img src="/assets/telefone.png" alt="icon_tel" width='20' height='20'/>
                            <p id="telefone">(33) 3082-3316</p>
                        </div>
                        <div className="p_icons">
                            <img src="/assets/email.png" alt="icon_email" width='20' height='20'/>
                            <p id="email">contato@oticaoriginal.com</p>
                        </div>
                    </div>
                </div> 
                <div className="redes_sociais">
                    <h3>Redes Sociais:</h3>
                    <div className="paragrafos">
                        <div className="p_icons">
                            <img src="/assets/fb.png" alt="icon_facebook" width='20' height='20'/>
                            <p id="facebook">/otica.original</p>
                        </div>
                        <div className="p_icons">
                            <img src="/assets/ig.png" alt="icon_instagram" width='20' height='20'/>
                            <p id="instagram">@oticaoriginal</p>
                        </div>
                        <div className="p_icons">
                            <img src="/assets/tt.png" alt="icon_twitter" width='20' height='20'/>
                            <p id="twitter">@otica.original</p>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="bottom_footer">
                <p>© 2025 Ótica Original - Todos os direitos reservados</p>
            </div>      
        </div> 
    );
}  