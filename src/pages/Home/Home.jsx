import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// service
import { CATEGORIES, movieService, tvService } from '../../services/api'

// context
import { useFavorites } from "../../contexts/FavoritesContext";

// components
import Loading from '../../components/Loading/Loading';
import Carousel from '../../components/Carousel/Carousel';
import MovieCard from '../../components/MovieCard/MovieCard';

// css
import './Home.css';

const Home = () => {
    const [featuredContent, setFeaturedContent] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [isFeaturedFavorite, setIsFeaturedFavorite] = useState(false);
    const navigate = useNavigate();

    // Atualizar estado de favorito quando featuredContent mudar
    useEffect(() => {
        if (featuredContent) {
            setIsFeaturedFavorite(isFavorite(featuredContent.id));
        }
    }, [featuredContent, isFavorite]);

    // 🎯 FUNÇÃO PARA BOTÃO ASSISTIR DO BANNER
    const handleWatchFeatured = () => {
        if (featuredContent) {
            // Determinar se é filme ou série
            const isTVShow = featuredContent.first_air_date || featuredContent.media_type === 'tv';
            const mediaType = isTVShow ? 'tv' : 'movie';
            
            // Navegar para a página de detalhes
            navigate(`/${mediaType}/${featuredContent.id}`);
            
            console.log('🎬 Navegando para:', `/${mediaType}/${featuredContent.id}`);
            console.log('📺 Conteúdo:', featuredContent.title || featuredContent.name);
        }
    };

    // 🎯 FUNÇÃO PARA BOTÃO MINHA LISTA DO BANNER
    const handleFavoriteToggle = () => {
        if (!featuredContent) return;
        
        if (isFeaturedFavorite) {
            removeFavorite(featuredContent.id);
            console.log('🗑️ Removido dos favoritos:', featuredContent.title || featuredContent.name);
        } else {
            addFavorite(featuredContent);
            console.log('❤️ Adicionado aos favoritos:', featuredContent.title || featuredContent.name);
        }
        setIsFeaturedFavorite(!isFeaturedFavorite);
    };

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);

                // Carrega conteúdo em destaque e categorias em PARALELO
                const [
                    popularMoviesResponse,
                    trendingMoviesResponse,
                    popularMoviesResponse2,
                    popularTvResponse,
                    actionMoviesResponse,
                    comedyMoviesResponse,
                    fantasyMoviesResponse,
                    dramaTvResponse,
                    animationMoviesResponse
                ] = await Promise.all([
                    movieService.getPopular(),           // Featured content
                    movieService.getTrending(),          // Trending movies
                    movieService.getPopular(),           // Popular movies (duplicado para featured)
                    tvService.getPopular(),              // Popular TV
                    movieService.getByGenre(CATEGORIES.ACTION),
                    movieService.getByGenre(CATEGORIES.COMEDY),
                    movieService.getByGenre(CATEGORIES.FANTASY),
                    tvService.getByGenre(CATEGORIES.DRAMA),
                    movieService.getByGenre(CATEGORIES.ANIMATION)
                ]);

                // 1. Configura conteúdo em destaque
                const popularMovies = popularMoviesResponse.data.results;
                if (popularMovies.length > 0) {
                    setFeaturedContent(popularMovies[0]);
                }

                // 2. Carrega animes separadamente (não bloqueia outras categorias)
                let animes = [];
                try {
                    console.log('🎌 Buscando animes...');
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
                    
                    const animePromises = popularAnimeIds.map(id => 
                        tvService.getDetails(id).catch((error) => {
                            console.error(`Erro ao buscar anime ID ${id}:`, error);
                            return null;
                        })
                    );
                    
                    const animeResults = await Promise.all(animePromises);
                    animes = animeResults
                        .filter(show => show !== null && show.data)
                        .map(r => r.data)
                        .slice(0, 8);
                    
                    console.log('✅ Animes carregados:', animes.length);
                } catch (animeError) {
                    console.error('❌ Erro ao buscar animes:', animeError);
                }

                // 3. Configura todas as categorias
                const categoriesData = [
                    {
                        id: 'trending_movies',
                        name: '🎬 Em Tendência',
                        content: trendingMoviesResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'popular_movies', 
                        name: '🔥 Filmes Populares',
                        content: popularMoviesResponse2.data.results.slice(0, 8)
                    },
                    {
                        id: 'popular_tv',
                        name: '📺 Séries em Alta', 
                        content: popularTvResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'action',
                        name: '💥 Ação',
                        content: actionMoviesResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'comedy',
                        name: '😂 Comédia',
                        content: comedyMoviesResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'anime',
                        name: '🎌 Animes',
                        content: animes
                    },
                    {
                        id: 'animation_movies',
                        name: '🎬 Filmes de Animação',
                        content: animationMoviesResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'fantasy',
                        name: '🐉 Fantasia',
                        content: fantasyMoviesResponse.data.results.slice(0, 8)
                    },
                    {
                        id: 'drama',
                        name: '🎭 Drama',
                        content: dramaTvResponse.data.results.slice(0, 8)
                    }
                ].filter(category => category.content.length > 0); // Remove categorias vazias

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
            {/* 🎯 BANNER PRINCIPAL COM BOTÕES FUNCIONAIS */}
            {featuredContent && (
                <section className="home__banner">
                    <div 
                        className="home__banner-background" 
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredContent.backdrop_path})`
                        }}
                    >
                        <div className="home__banner-overlay"></div>
                        <div className="home__banner-content">
                            <h1 className="home__banner-title">
                                {featuredContent.title || featuredContent.name}
                            </h1>
                            <p className="home__banner-overview">
                                {featuredContent.overview}
                            </p>
                            <div className="home__banner-buttons">
                                {/* 🎯 BOTÃO ASSISTIR FUNCIONAL */}
                                <button 
                                    className="home__banner-button home__banner-button--primary"
                                    onClick={handleWatchFeatured}
                                >
                                    ▶ Assistir
                                </button>
                                
                                {/* 🎯 BOTÃO MINHA LISTA FUNCIONAL */}
                                <button 
                                    className={`home__banner-button ${
                                        isFeaturedFavorite 
                                            ? 'home__banner-button--favorite' 
                                            : 'home__banner-button--secondary'
                                    }`}
                                    onClick={handleFavoriteToggle}
                                >
                                    {isFeaturedFavorite ? '✓ Na Lista' : '+ Minha Lista'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 🎯 CARROSSEIS DE CONTEÚDO */}
            <section className="home__content">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <Carousel key={category.id} title={category.name}>
                            {category.content.map((item) => (
                                <MovieCard key={item.id} movie={item}/>
                            ))}
                        </Carousel>
                    ))
                ) : (
                    <div className="home__no-content">
                        <h2>Nenhum conteúdo disponível no momento</h2>
                        <p>Tente recarregar a página ou verifique sua conexão.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;