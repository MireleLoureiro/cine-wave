import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// service
import { movieService, tvService, genreService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import Loading from '../../components/Loading/Loading';

// css
import './CategoryResults.css';

const CategoryResults = () => {
    const { type, genreId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genreName, setGenreName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('popularity');
    const [yearFilter, setYearFilter] = useState('');

    // 🎯 Buscar resultados da categoria
    useEffect(() => {
        const fetchCategoryResults = async () => {
            try {
                setLoading(true);
                console.log(`🎯 Buscando ${type} da categoria ${genreId}, página ${currentPage}`);

                let response;
                const params = {
                    page: currentPage,
                    sort_by: `${sortBy}.desc`
                };

                // 🎯 Filtro por ano
                if (yearFilter) {
                    if (type === 'movie') {
                        params.primary_release_year = yearFilter;
                    } else {
                        params.first_air_date_year = yearFilter;
                    }
                }

                if (type === 'movie') {
                    response = await movieService.getByGenre(parseInt(genreId), currentPage);
                } else {
                    response = await tvService.getByGenre(parseInt(genreId), currentPage);
                }

                setResults(response.data.results);
                setTotalPages(Math.min(response.data.total_pages, 20)); // Limitar a 20 páginas
                
                // 🎯 Buscar nome do gênero
                const genreMap = {
                    movie: {
                        28: 'Ação', 35: 'Comédia', 18: 'Drama', 27: 'Terror',
                        14: 'Fantasia', 16: 'Animação', 99: 'Documentário'
                    },
                    tv: {
                        28: 'Ação', 35: 'Comédia', 18: 'Drama', 27: 'Terror',
                        14: 'Fantasia', 16: 'Animes', 99: 'Documentário'
                    }
                };
                
                const name = genreMap[type]?.[parseInt(genreId)] || 'Desconhecido';
                setGenreName(name);

            } catch (error) {
                console.error('Erro ao buscar categoria:', error);
            } finally {
                setLoading(false);
            }
        };

        if (type && genreId) {
            fetchCategoryResults();
        }
    }, [type, genreId, currentPage, sortBy, yearFilter]);

    // 🎯 Gerar anos para filtro (últimos 30 anos)
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= currentYear - 30; year--) {
            years.push(year);
        }
        return years;
    };

    // 🎯 Navegação de páginas
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 🎯 Voltar para categorias
    const handleBackToCategories = () => {
        navigate('/categories');
    };

    if (loading && currentPage === 1) {
        return <Loading message={`Carregando ${type === 'movie' ? 'filmes' : 'séries'}...`} />;
    }

    const getGenreEmoji = (name) => {
        const emojiMap = {
            'Ação': '💥',
            'Comédia': '😂',
            'Drama': '🎭',
            'Terror': '👻',
            'Fantasia': '🐉',
            'Animação': '🎬',
            'Animes': '🎌',
            'Documentário': '📝'
        };
        return emojiMap[name] || '🎬';
    };

    return (
        <div className="category-results">
            {/* 🎯 Botão Voltar */}
            <button 
                className="category-results__back-button"
                onClick={handleBackToCategories}
            >
                ← Voltar para Categorias
            </button>

            {/* 🎯 Header com Informações */}
            <div className="category-results__header">
                <h1>
                    {getGenreEmoji(genreName)} {genreName} 
                    <span className="category-results__type">
                        ({type === 'movie' ? 'Filmes' : 'Séries'})
                    </span>
                </h1>
                <p>{results.length} {type === 'movie' ? 'filmes' : 'séries'} encontrados na página {currentPage}</p>
            </div>

            {/* 🎯 Filtros e Ordenação */}
            <div className="category-results__filters">
                <div className="category-results__filter-group">
                    <label htmlFor="sort-select" className="category-results__filter-label">
                        Ordenar por:
                    </label>
                    <select 
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="category-results__filter-select"
                    >
                        <option value="popularity">Popularidade</option>
                        <option value="release_date">{type === 'movie' ? 'Data de Lançamento' : 'Data de Estreia'}</option>
                        <option value="vote_average">Avaliação</option>
                        <option value="title">Título (A-Z)</option>
                    </select>
                </div>

                <div className="category-results__filter-group">
                    <label htmlFor="year-select" className="category-results__filter-label">
                        Filtrar por ano:
                    </label>
                    <select 
                        id="year-select"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="category-results__filter-select"
                    >
                        <option value="">Todos os anos</option>
                        {generateYearOptions().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 🎯 Grid de Resultados */}
            {results.length > 0 ? (
                <>
                    <div className="category-results__grid">
                        {results.map(item => (
                            <MovieCard key={item.id} movie={item} />
                        ))}
                    </div>

                    {/* 🎯 Paginação */}
                    <div className="category-results__pagination">
                        <button 
                            className="category-results__pagination-button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            ← Anterior
                        </button>
                        
                        <span className="category-results__pagination-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        
                        <button 
                            className="category-results__pagination-button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Próxima →
                        </button>
                    </div>
                </>
            ) : (
                <div className="category-results__empty">
                    <h3>Nenhum resultado encontrado</h3>
                    <p>
                        Não encontramos {type === 'movie' ? 'filmes' : 'séries'} na categoria {genreName} 
                        {yearFilter ? ` do ano ${yearFilter}` : ''}.
                    </p>
                    <button 
                        className="category-results__empty-button"
                        onClick={() => {
                            setYearFilter('');
                            setCurrentPage(1);
                        }}
                    >
                        Limpar Filtros
                    </button>
                </div>
            )}

            {/* 🎯 Loading para páginas subsequentes */}
            {loading && currentPage > 1 && (
                <div className="category-results__loading-more">
                    <Loading message="Carregando mais resultados..." size="small" />
                </div>
            )}
        </div>
    );
};

export default CategoryResults;