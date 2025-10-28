import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'

// css
import './SearchBar.css'

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            } else {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }

            setQuery('');
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
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
                <button type="submit" className="search-bar__button">
                    🔍
                </button>
            </div>
        </form>
    );
};

export default SearchBar;