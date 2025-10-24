import React, { useState, useEffect } from "react";
import { movieService } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import './TestAPI.css';

const TestAPI = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                setLoading(true);
                console.log('🔍 Testando conexão com TMDB...');

                const response = await movieService.getPopular();
                console.log('✅ Conexão bem-sucedida! ', response.data);

                setMovies(response.data.results.slice(0, 8)); // Primeiros 8 filmes
            } catch (error) {
                console.error('❌ Erro na conexão: ', error);
                setError('Falha ao conectar com a API TMDB');
            } finally {
                setLoading(false);
            }
        };

        testConnection();
    }, []);

    if (loading) {
        return (
            <div className="test-api">
                <h2>🔄️ Conectando com TMDB...</h2>
                <loading message="Carregando filmes..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="test-api">
                <h2>❌ Erro de Conexão</h2>
                <p>{error}</p>
                <p>Verifique sua chave API no arquivo .env</p>
            </div>
        );
    }

    return (
        <div className="test-api">
            <h2>🎬 Teste da API TMDB - Funcionando ✅</h2>
            <p>Filmes populares carregados com sucesso: { movies.length }</p>
            <div className="movies-grid">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie}/>
                ))}
            </div>
        </div>
    );
};

export default TestAPI;