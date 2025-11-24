import React from 'react';

// css
import './Loading.css';

const Loading = ({ 
    message = "Carregando...", 
    size = "medium" 
}) => {
    return (
        <div className="loading-container">
            <div className={`loading-spinner loading-spinner--${size}`}></div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default Loading;