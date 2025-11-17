import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// service
import { searchService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import Loading from '../../components/Loading/Loading';

// css
import './Search.css';

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

const Search = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [filters, setFilters] = useState({
        mediaType: 'all', // 'all', 'movie', 'tv', 'person'
        sortBy: 'popularity' // 'popularity', 'rating', 'year'
    });
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const debouncedQuery = useDebounce(inputValue, 500);

    // 🎯 SYNC COM URL - useEffect 1
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q') || '';
        setSearchQuery(query);
        setInputValue(query);
        
        if (query) {
            performSearch(query);
        } else {
            setResults([]);
            setError(null);
        }
    }, [location.search]);

    // 🎯 BUSCA AUTOMÁTICA COM DEBOUNCE - useEffect 2
    useEffect(() => {
        if (debouncedQuery.trim()) {
            performSearch(debouncedQuery);
            // Atualiza URL sem recarregar a página
            navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`, { replace: true });
        } else if (debouncedQuery === '') {
            setResults([]);
            setError(null);
            navigate('/search', { replace: true });
        }
    }, [debouncedQuery, navigate]);

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
            
            // Busca específica por tipo se filtro aplicado
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
            
            // Filtra itens sem poster (para multi search)
            if (filters.mediaType === 'all') {
                filteredResults = filteredResults.filter(item => 
                    item.media_type !== 'person' && item.poster_path
                );
            } else if (filters.mediaType !== 'person') {
                filteredResults = filteredResults.filter(item => item.poster_path);
            }
            
            // Ordenação
            filteredResults = sortResults(filteredResults, filters.sortBy);
            
            setResults(filteredResults.slice(0, 20)); // Limita a 20 resultados
            setError(null);
            
        } catch (error) {
            console.error('Erro na busca:', error);
            setError('Erro ao carregar resultados. Tente novamente.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [filters.mediaType, filters.sortBy]);

    // 🎯 ORDENAÇÃO DE RESULTADOS
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

    // 🎯 MUDANÇA DE FILTROS
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // 🎯 MUDANÇA NO INPUT
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // 🎯 LIMPAR BUSCA
    const handleClearSearch = () => {
        setInputValue('');
        setSearchQuery('');
        setResults([]);
        setError(null);
        navigate('/search');
    };

    // 🎯 RE-TRY BUSCA
    const handleRetrySearch = () => {
        if (searchQuery) {
            performSearch(searchQuery);
        }
    };

    // 🎯 RENDERIZAÇÃO DE RESULTADOS
    const renderResults = () => {
        if (loading) {
            return (
                <div className="search-page__loading">
                    <Loading message={`Buscando "${searchQuery}"...`} />
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

        if (searchQuery && results.length > 0) {
            return (
                <>
                    <div className="search-page__results-info">
                        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''} para "{searchQuery}"
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

        if (searchQuery && results.length === 0) {
            return (
                <div className="search-page__empty">
                    <h3>🔍 Nenhum resultado encontrado</h3>
                    <p>Não encontramos resultados para "<strong>{searchQuery}</strong>"</p>
                    <p>Tente buscar com outras palavras-chave ou verifique a ortografia.</p>
                </div>
            );
        }

        return (
            <div className="search-page__initial">
                <h2>🎬 O que você quer assistir hoje?</h2>
                <p>Use a barra de pesquisa acima para buscar filmes, séries e muito mais.</p>
                <div className="search-page__suggestions">
                    <h4>Sugestões de busca:</h4>
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
            {/* Header com Input Local */}
            <div className="search-page__header">
                
                {/* Input de Busca Local */}
                <div className="search-page__input-container">
                    {inputValue && (
                        <button 
                            type="button"
                            className="search-page__clear"
                            onClick={handleClearSearch}
                            aria-label="Limpar busca"
                        >
                            ✕
                        </button>
                    )}
                </div>
                
                {/* Filtros - Mostrar apenas quando há resultados */}
                {searchQuery && results.length > 0 && !loading && (
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
            </div>
            
            {/* Conteúdo Principal */}
            <div className="search-page__content">
                {renderResults()}
            </div>
        </div>
    );
};

export default Search;