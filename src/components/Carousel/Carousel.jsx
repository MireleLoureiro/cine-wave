import React from 'react';

// css
import './Carousel.css';

const Carousel = ({ title, children }) => {
    const scrollLeft = () => {  // 👈 CORRIGIDO: scrollLeft (um "f")
        const container = document.getElementById(`carousel-${title}`);
        container.scrollBy({ left: -300, behavior: 'smooth' });  // 👈 CORRIGIDO: scrollBy
    };

    const scrollRight = () => {
        const container = document.getElementById(`carousel-${title}`);
        container.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div className="carousel">
            <h2 className="carousel__title">{title}</h2>  {/* 👈 double underscore */}
            <div className="carousel__container">  {/* 👈 double underscore */}
                <button className="carousel__button carousel__button--left" onClick={scrollLeft}>  {/* 👈 double underscore */}
                    ‹
                </button>
                
                <div className="carousel__content" id={`carousel-${title}`}>  {/* 👈 MUDOU: carousel__content */}
                    {children}
                </div>
                
                <button className="carousel__button carousel__button--right" onClick={scrollRight}>  {/* 👈 double underscore */}
                    ›
                </button>
            </div>
        </div>
    );
};

export default Carousel;