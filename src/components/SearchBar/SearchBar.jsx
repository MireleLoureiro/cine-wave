import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

// Hook de debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(handler);
    }, [value, delay]);
    
    return debouncedValue;
};

const SearchBar = ({ onSearch, instantSearch = false }) => {
    const [query, setQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (instantSearch && debouncedQuery.trim() && onSearch) {
            onSearch(debouncedQuery.trim());
            setIsTyping(false);
        }
    }, [debouncedQuery, instantSearch, onSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            } else {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
            setIsTyping(false);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (instantSearch) {
            setIsTyping(true);
        }
    };

    const handleClear = () => {
        setQuery('');
        setIsTyping(false);
        if (instantSearch && onSearch) {
            onSearch('');
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-bar__container">
                <input 
                    type="text" 
                    placeholder="Buscar filmes, séries..."
                    value={query}
                    onChange={handleChange}
                    className="search-bar__input"
                />
                {query && (
                    <button 
                        type="button"
                        className="search-bar__clear"
                        onClick={handleClear}
                        aria-label="Limpar busca"
                    >
                        ✕
                    </button>
                )}
                <button 
                    type="submit" 
                    className={`search-bar__button ${isTyping ? 'search-bar__button--loading' : ''}`}
                    disabled={isTyping}
                >
                    {isTyping ? '⌛' : '🔍'}
                </button>
            </div>
        </form>
    );
};

export default SearchBar;