import React, { useState, useEffect, useCallback } from 'react';
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
    const [filters, setFilters] = useState({
        mediaType: 'all',
        sortBy: 'popularity'
    });
    const [error, setError] = useState(null);

    const location = useLocation();

    // 🎯 Obtém query da URL
    const getSearchQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('q') || '';
    };

    const currentQuery = getSearchQuery();

    // 🎯 FUNÇÃO DE BUSCA
    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            let response;
            
            if (filters.mediaType === 'movie') {
                response = await searchService.movies(query);
            } else if (filters.mediaType === 'tv') {
                response = await searchService.tvShows(query);
            } else if (filters.mediaType === 'person') {
                response = await searchService.people(query);
            } else {
                response = await searchService.multi(query);
            }
            
            let filteredResults = response.data.results || [];
            
            if (filters.mediaType === 'all') {
                filteredResults = filteredResults.filter(item => 
                    item.media_type !== 'person' && item.poster_path
                );
            } else if (filters.mediaType !== 'person') {
                filteredResults = filteredResults.filter(item => item.poster_path);
            }
            
            filteredResults = sortResults(filteredResults, filters.sortBy);
            setResults(filteredResults.slice(0, 20));
            setError(null);
            
        } catch (error) {
            console.error('Erro na busca:', error);
            setError('Erro ao carregar resultados. Tente novamente.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [filters.mediaType, filters.sortBy]);

    // 🎯 EFETUA BUSCA QUANDO QUERY MUDA
    useEffect(() => {
        if (currentQuery.trim()) {
            performSearch(currentQuery);
        } else {
            setResults([]);
            setError(null);
        }
    }, [currentQuery, performSearch]);

    // 🎯 ATUALIZAR BUSCA QUANDO FILTROS MUDAREM
    useEffect(() => {
        if (currentQuery.trim()) {
            performSearch(currentQuery);
        }
    }, [filters.mediaType, filters.sortBy]);

    // 🎯 ORDENAÇÃO
    const sortResults = (results, sortBy) => {
        const sorted = [...results];
        
        switch (sortBy) {
            case 'rating':
                return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            case 'year':
                return sorted.sort((a, b) => {
                    const dateA = a.release_date || a.first_air_date || '';
                    const dateB = b.release_date || b.first_air_date || '';
                    return dateB.localeCompare(dateA);
                });
            case 'popularity':
            default:
                return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleRetrySearch = () => {
        if (currentQuery.trim()) {
            performSearch(currentQuery);
        }
    };

    // 🎯 RENDERIZAÇÃO
    const renderResults = () => {
        if (loading) {
            return (
                <div className="search-page__loading">
                    <Loading message={`Buscando "${currentQuery}"...`} />
                </div>
            );
        }

        if (error) {
            return (
                <div className="search-page__error">
                    <h3>😕 Ocorreu um erro</h3>
                    <p>{error}</p>
                    <button 
                        className="search-page__retry-button"
                        onClick={handleRetrySearch}
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        if (currentQuery && results.length > 0) {
            return (
                <>
                    <div className="search-page__results-info">
                        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''} para "{currentQuery}"
                    </div>
                    
                    <div className="search-page__grid">
                        {results.map(item => (
                            <MovieCard 
                                key={`${item.id}-${item.media_type || 'movie'}`} 
                                movie={item} 
                            />
                        ))}
                    </div>
                </>
            );
        }

        if (currentQuery && results.length === 0) {
            return (
                <div className="search-page__empty">
                    <h3>🔍 Nenhum resultado encontrado</h3>
                    <p>Não encontramos resultados para "<strong>{currentQuery}</strong>"</p>
                    <p>Tente buscar com outras palavras-chave ou verifique a ortografia.</p>
                </div>
            );
        }

        return (
            <div className="search-page__initial">
                <h2>🎬 O que você quer assistir hoje?</h2>
                <p>Use a barra de pesquisa no cabeçalho para buscar filmes, séries e muito mais.</p>
                
                {/* 🎯 SUGESTÕES DE BUSCA (opcional) */}
                <div className="search-page__suggestions">
                    <h4>🎯 Sugestões de busca:</h4>
                    <div className="search-page__suggestion-tags">
                        <span>Ação</span>
                        <span>Comédia</span>
                        <span>Drama</span>
                        <span>Ficção Científica</span>
                        <span>Anime</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="search-page">
            {/* 🎯 REMOVIDO: O SearchBar duplicado */}
            
            {/* 🎯 APENAS FILTROS quando há resultados */}
            {currentQuery && results.length > 0 && !loading && (
                <div className="search-page__filters">
                    <div className="search-page__filter-group">
                        <label htmlFor="media-type" className="search-page__filter-label">
                            Tipo:
                        </label>
                        <select 
                            id="media-type"
                            value={filters.mediaType}
                            onChange={(e) => handleFilterChange('mediaType', e.target.value)}
                            className="search-page__filter"
                        >
                            <option value="all">Todos</option>
                            <option value="movie">Filmes</option>
                            <option value="tv">Séries</option>
                            <option value="person">Atores</option>
                        </select>
                    </div>
                    
                    <div className="search-page__filter-group">
                        <label htmlFor="sort-by" className="search-page__filter-label">
                            Ordenar por:
                        </label>
                        <select 
                            id="sort-by"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="search-page__filter"
                        >
                            <option value="popularity">Popularidade</option>
                            <option value="rating">Avaliação</option>
                            <option value="year">Ano</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="search-page__content">
                {renderResults()}
            </div>
        </div>
    );
};

export default Search;