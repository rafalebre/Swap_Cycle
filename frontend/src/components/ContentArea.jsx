import React from 'react';
import './ContentArea.css';

function ContentArea({ activeView }) {
    const renderContent = () => {
        switch (activeView) {
            case 'registerProduct':
                return <div>Formulário de registro de produto aqui</div>;
            case 'registerService':
                return <div>Formulário de registro de serviço aqui</div>;
            case 'search':
                return <div>Componente de busca aqui</div>;
            case 'onlineServices':
                return <div>Componente para serviços online aqui</div>;
            case 'myProducts':
                return <div>Lista de produtos/serviços do usuário aqui</div>;
            case 'trades':
                return <div>Componente de trocas aqui</div>;
            case 'favorites':
                return <div>Componente de favoritos aqui</div>;
            case 'wishlist':
                return <div>Componente de lista de desejos aqui</div>;
            default:
                return <div>Selecione uma opção da barra lateral</div>;
        }
    };

    return (
        <div className="content-area">
            {renderContent()}
        </div>
    );
}

export default ContentArea;
