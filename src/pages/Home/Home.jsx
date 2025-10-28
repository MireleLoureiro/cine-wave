import React, { useEffect, useState } from "react";

// service
import { CATEGORIES, movieService, tvService } from '../../services/api'

// components
import Loading from '../../components/Loading/Loading';
import Carousel from '../../components/Carousel/Carousel';
import MovieCard from '../../components/MovieCard/MovieCard';

// css
import './Home.css';

const Home = () => {
    const [featuredContent, setFeaturedContent] = useState(null);   // conteudo em destaque
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);

                // 1. carrega conteúdo em destaque (filme mais popular)
                const popularMoviesResponse = await movieService.getPopular();
                const popularMovies = popularMoviesResponse.data.results;

                if (popularMovies.length > 0) {
                    setFeaturedContent(popularMovies[0])
                }

                // carrega todas as categorias
                const categoriesConfig = [
                {
                    id: 'trending_movies',
                    name: '🎬 Em Tendência',
                    fetchData: () => movieService.getTrending()
                },
                {
                    id: 'popular_movies', 
                    name: '🔥 Filmes Populares',
                    fetchData: () => movieService.getPopular()
                },
                {
                    id: 'popular_tv',
                    name: '📺 Séries em Alta', 
                    fetchData: () => tvService.getPopular()
                },
                {
                    id: 'action',
                    name: '💥 Ação',
                    fetchData: () => movieService.getByGenre(CATEGORIES.ACTION)
                },
                {
                    id: 'comedy',
                    name: '😂 Comédia',
                    fetchData: () => movieService.getByGenre(CATEGORIES.COMEDY)
                },
                // 👇 ANIMES (SÉRIES JAPONESAS ESPECÍFICAS)
                {
                    id: 'anime',
                    name: '🎌 Animes',
                    fetchData: async () => {
                        try {
                            console.log('🎌 Buscando animes...');
                            // IDs de animes populares japoneses
                            const popularAnimeIds = [
                                1429,    // Naruto
                                1399,    // Attack on Titan
                                65930,   // Demon Slayer
                                4629,    // One Piece
                                62852,   // Jujutsu Kaisen
                                13916,   // Death Note
                                46298,   // Tokyo Ghoul
                                65949,   // My Hero Academia
                                37854,   // One-Punch Man
                                68845,   // Dragon Ball Super
                            ];
                            
                            // Busca os detalhes de cada anime
                            const promises = popularAnimeIds.map(id => 
                                tvService.getDetails(id).catch((error) => {
                                    console.error(`Erro ao buscar anime ID ${id}:`, error);
                                    return null;
                                })
                            );
                            
                            const results = await Promise.all(promises);
                            const animes = results
                                .filter(show => show !== null && show.data)
                                .map(r => r.data)
                                .slice(0, 8); // Limita a 8 animes
                            
                            console.log('✅ Animes carregados:', animes.length);
                            return { data: { results: animes } };
                            
                        } catch (error) {
                            console.error('❌ Erro ao buscar animes:', error);
                            return { data: { results: [] } };
                        }
                    }
                },
                // 👇 ANIMAÇÃO (FILMES DE ANIMAÇÃO EM GERAL)
                {
                    id: 'animation_movies',
                    name: '🎬 Filmes de Animação',
                    fetchData: () => movieService.getByGenre(CATEGORIES.ANIMATION)
                },
                {
                    id: 'fantasy',
                    name: '🐉 Fantasia',
                    fetchData: () => movieService.getByGenre(CATEGORIES.FANTASY)
                },
                {
                    id: 'drama',
                    name: '🎭 Drama',
                    fetchData: () => tvService.getByGenre(CATEGORIES.DRAMA)
                }
            ];

                const categoriesData = [];
                
                for (const category of categoriesConfig) {
                    try {
                        const response = await category.fetchData();
                        categoriesData.push({
                            id: category.id,
                            name: category.name,
                            content: response.data.results.slice(0, 8)
                        });
                    } catch (error) {
                        console.error(`Erro na categoria ${category.name}: `, error);
                        //adiciona categoria vazia em caso de erro
                        categoriesData.push({
                            id: category.id,
                            name: category.name,
                            content: []
                        });
                    }
                }

                setCategories(categoriesData);
                
            } catch (error) {
                console.error('Erro ao carregar dados da home: ', error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    if (loading) {
        return <Loading message="Carregando CineWave..." />
    }

    return (
        <div className="home">
            {/* banner principal */}
            {featuredContent && (
                <section className="home__banner">
                    <div 
                        className="home__banner-background" 
                        style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredContent.backdrop_path})`}} // 👈 CORRIGIDO
                    >
                        <div className="home__banner-overlay"></div>
                        <div className="home__banner-content">
                            <h1 className="home__banner-title">{featuredContent.title || featuredContent.name}</h1>
                            <p className="home__banner-overview">{featuredContent.overview}</p>
                            <div className="home__banner-buttons"> {/* 👈 CORRIGIDO */}
                                <button className="home__banner-button home__banner-button--primary">
                                    ▶ Assistir
                                </button>
                                <button className="home__banner-button home__banner-button--secondary">
                                    + Minha Lista
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* carrosseis */}
            <section className="home__content">
                {categories.map((category) => (
                    <Carousel key={category.id} title={category.name}>
                        {category.content.map((item) => (
                            <MovieCard key={item.id} movie={item}/>
                        ))}
                    </Carousel>
                ))}
            </section>
        </div>
    );
};

export default Home;