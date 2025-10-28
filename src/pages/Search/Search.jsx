import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// service
import { searchService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import Loading from '../../components/Loading/Loading';

// css
import './Search.css';

const Search = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    // Pega a query da URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q') || '';
        setSearchQuery(query);
        
        if (query) {
            performSearch(query);
        } else {
            setResults([]);
        }
    }, [location.search]);

    const performSearch = async (query) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await searchService.multi(query);
            setResults(response.data.results || []);
        } catch (error) {
            console.error('Erro na busca:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <div className="search-page__header">
                <h1>Buscar</h1>
            </div>
            <div className="search-page__content">
                {loading ? (
                    <Loading message="Buscando..." />
                ) : searchQuery ? (
                    <>
                        <h2 className="search-page__results-title">
                            Resultados para "{searchQuery}"
                        </h2>
                        
                        {results.length > 0 ? (
                            <div className="search-page__grid">
                                {results.map(item => (
                                    <MovieCard key={item.id} movie={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="search-page__empty">
                                <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                                <p>Tente buscar com outras palavras-chave.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="search-page__initial">
                        <h2>O que você quer assistir hoje?</h2>
                        <p>Use a barra de pesquisa no topo da página para buscar filmes e séries.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;