export const Modal = () => {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <i className="fa fa-exclamation-circle" aria-hidden="true" style={{fontSize: '28px'}}></i>
                        <h1 className="modal-title fs-5 p-2" id="exampleModalLabel" style={{fontWeight: '700'}}>Beta Release</h1>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className='modal-body v-application'>
                        <div data-v-b58a293a="" className="v-card__text pt-4 pb-0" style={{textAlign: 'justify'}}>
                            <p data-v-b58a293a=""> Este aplicativo está em estágio de <em data-v-b58a293a="">Beta Test</em>, ou seja, trata-se de um <strong data-v-b58a293a="">protótipo funcional</strong> ou <strong data-v-b58a293a="">mínimo produto viável</strong> (do inglês, <em data-v-b58a293a="">Minimum Viable Product</em> - MVP). </p><p data-v-b58a293a=""> A disponibilização pública neste estágio de desenvolvimento objetiva possibilitar o acesso antecipado dos usuários a resultados de pesquisa científica da Embrapa. Entretanto, devido a sua maturidade atual, o aplicativo pode eventualmente apresentar alguma instabilidade. <strong data-v-b58a293a="">Por favor, utilize-o com cautela!</strong></p>
                        </div>
                        <div data-v-b58a293a="" className="v-card__actions p-2 pb-4 justify-center">
                            <button type="button" className="btn btn-secondary v-btn" data-bs-dismiss="modal" style={{backgroundColor: '#4caf50', color: '#fff', borderColor: '#4caf50', fontSize: '14px', fontWeight: 'bold'}}><i className="fas fa-check p-1"></i> OK</button>
                        </div>
                        <div data-v-b58a293a="" className="v-card__text pt-4 blue-grey lighten-4" style={{textAlign: 'justify'}}>
                            <p data-v-b58a293a="" style={{textAlign: 'center'}}>
                                <i className="far fa-lightbulb" style={{color: '#fff', fontSize: '36px'}}></i>
                            </p>
                            <p data-v-b58a293a="" className="headline" style={{textAlign: 'center'}}> O agro precisa de você! </p>
                            <p data-v-b58a293a="" className="my-0"> Torne-se nosso parceiro no desenvolvimento desta e de outras tecnologias digitais para a agropecuária: </p>
                            <div className="d-grid p-3 gap-2 col-15 mx-auto">
                                <button className="btn" type="button" style={{backgroundColor: '#4caf50', padding: '15px', fontSize: '14px', fontWeight: 'bold'}}><a href="https://api.whatsapp.com/send?phone=556733682193" className='text-white p-3'><i className="fab fa-whatsapp" style={{fontSize: '18px', paddingRight: '8px'}}></i> Contacte-nos! </a></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };
