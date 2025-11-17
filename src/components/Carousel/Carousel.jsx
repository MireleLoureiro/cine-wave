import React, { useRef, useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ title, children }) => {
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => {
        containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const handleWheel = (e) => {
        if (containerRef.current) {
            e.preventDefault();
            containerRef.current.scrollBy({
                left: e.deltaY < 0 ? -300 : 300,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            checkScroll(); // Check inicial
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    return (
        <div className="carousel">
            <h2 className="carousel__title">{title}</h2>
            <div className="carousel__container">
                <button 
                    className={`carousel__button carousel__button--left ${!showLeftArrow ? 'carousel__button--hidden' : ''}`}
                    onClick={scrollLeft}
                >
                    ‹
                </button>
                
                <div 
                    className="carousel__content" 
                    ref={containerRef}
                    onWheel={handleWheel}
                >
                    {children}
                </div>
                
                <button 
                    className={`carousel__button carousel__button--right ${!showRightArrow ? 'carousel__button--hidden' : ''}`}
                    onClick={scrollRight}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default Carousel;