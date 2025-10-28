import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// service
import { movieService, tvService, CATEGORIES } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import Loading from '../../components/Loading/Loading';

// css
import './CategoryResults.css';

const CategoryResults = () => {
    const { type, genreId } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genreName, setGenreName] = useState('');

    useEffect(() => {
        const fetchCategoryResults = async () => {
            try {
                setLoading(true);
                console.log(`🎯 Buscando ${type} da categoria ${genreId}`);

                let response;
                if (type === 'movie') {
                    response = await movieService.getByGenre(parseInt(genreId));
                } else {
                    response = await tvService.getByGenre(parseInt(genreId));
                }

                setResults(response.data.results);
                
                // Encontrar o nome do gênero
                const allGenres = type === 'movie' ? 
                    await movieService.getGenres() : 
                    await tvService.getGenres();
                
                const genre = allGenres.data.genres.find(g => g.id === parseInt(genreId));
                setGenreName(genre?.name || 'Desconhecido');

            } catch (error) {
                console.error('Erro ao buscar categoria:', error);
            } finally {
                setLoading(false);
            }
        };

        if (type && genreId) {
            fetchCategoryResults();
        }
    }, [type, genreId]);

    if (loading) {
        return <Loading message={`Carregando ${type === 'movie' ? 'filmes' : 'séries'}...`} />;
    }

    const getGenreEmoji = (name) => {
        const emojiMap = {
            'Action': '💥',
            'Comedy': '😂',
            'Drama': '🎭',
            'Horror': '👻',
            'Fantasy': '🐉',
            'Animation': type === 'movie' ? '🎬' : '🎌',
            'Documentary': '📝'
        };
        return emojiMap[name] || '🎬';
    };

    return (
        <div className="category-results">
            <div className="category-results__header">
                <h1>
                    {getGenreEmoji(genreName)} {genreName} 
                    <span className="category-results__type">
                        ({type === 'movie' ? 'Filmes' : 'Séries'})
                    </span>
                </h1>
                <p>{results.length} {type === 'movie' ? 'filmes' : 'séries'} encontrados</p>
            </div>

            <div className="category-results__grid">
                {results.map(item => (
                    <MovieCard key={item.id} movie={item} />
                ))}
            </div>

            {results.length === 0 && (
                <div className="category-results__empty">
                    <p>Nenhum {type === 'movie' ? 'filme' : 'série'} encontrado nesta categoria.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryResults;