// src/pages/TVShowDetail/TVShowDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// service
import { tvService, imageService } from '../../services/api';

// components
import MovieCard from '../../components/MovieCard/MovieCard';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import Loading from '../../components/Loading/Loading';

// css
import './TVShowDetail.css';

const TVShowDetail = () => {
    const { id } = useParams();
    const [tvShow, setTvShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSeason, setExpandedSeason] = useState(null);
    const [seasonDetails, setSeasonDetails] = useState({});
    const [loadingEpisodes, setLoadingEpisodes] = useState({});

    useEffect(() => {
        const fetchTVShowDetails = async () => {
            try {
                setLoading(true);
                const response = await tvService.getDetails(id);
                setTvShow(response.data);
            } catch (err) {
                console.error('Erro ao buscar detalhes da série:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTVShowDetails();
        }
    }, [id]);

    // Buscar episódios de uma temporada
    const fetchSeasonEpisodes = async (seasonNumber) => {
        if (seasonDetails[seasonNumber]) {
            return;
        }

        setLoadingEpisodes(prev => ({ ...prev, [seasonNumber]: true }));

        try {
            const response = await tvService.getSeasonDetails(id, seasonNumber);
            setSeasonDetails(prev => ({
                ...prev,
                [seasonNumber]: response.data
            }));
        } catch (err) {
            console.error(`Erro ao buscar episódios da temporada ${seasonNumber}:`, err);
        } finally {
            setLoadingEpisodes(prev => ({ ...prev, [seasonNumber]: false }));
        }
    };

    // Alternar expansão da temporada
    const toggleSeasonExpansion = async (seasonNumber) => {
        if (expandedSeason === seasonNumber) {
            setExpandedSeason(null);
        } else {
            setExpandedSeason(seasonNumber);
            if (!seasonDetails[seasonNumber]) {
                await fetchSeasonEpisodes(seasonNumber);
            }
        }
    };

    // Formatar duração do episódio
    const formatRuntime = (minutes) => {
        if (!minutes) return '';
        if (minutes < 60) return `${minutes}min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
    };

    // Obter cor baseada na avaliação
    const getRatingColor = (rating) => {
        if (rating >= 8) return '#2ecc71';
        if (rating >= 6) return '#f39c12';
        return '#e74c3c';
    };

    // Detectar animes
    const isAnime = (show) => {
        const animeKeywords = ['anime', 'animation', 'animação', 'japanese'];
        const title = show.name?.toLowerCase() || '';
        const overview = show.overview?.toLowerCase() || '';
        const genres = show.genres?.map(g => g.name.toLowerCase()) || [];
        
        return genres.includes('animation') || 
               animeKeywords.some(keyword => 
                   title.includes(keyword) || overview.includes(keyword)
               );
    };

    // Obter emoji do gênero
    const getGenreEmoji = (genreName) => {
        const emojiMap = {
            'Animation': '🎌',
            'Action & Adventure': '💥',
            'Drama': '🎭',
            'Comedy': '😂',
            'Sci-Fi & Fantasy': '🚀',
            'Fantasy': '🐉', // 👈 ADICIONADO
            'Crime': '🔫',
            'Mystery': '🕵️',
            'Documentary': '📝',
            'Reality': '📺',
            'Kids': '👶',
            'Soap': '🧼',
            'Talk': '🎤',
            'War & Politics': '⚔️'
        };
        return emojiMap[genreName] || '🎬';
    };

    if (loading) {
        return <Loading message="Carregando série..." />;
    }

    if (!tvShow) {
        return (
            <div className="tvshow-detail tvshow-detail--error">
                <div className="tvshow-detail__error">
                    <h1>Série não encontrada</h1>
                    <p>A série solicitada não existe.</p>
                </div>
            </div>
        );
    }

    const isAnimeShow = isAnime(tvShow);

    return (
        <div className="tvshow-detail">
            {/* Banner Hero */}
            <div 
                className="tvshow-detail__hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${imageService.getBackdropUrl(tvShow.backdrop_path, 'w1280')})`
                }}
            >
                <div className="tvshow-detail__hero-content">
                    <div className="tvshow-detail__poster-card">
                        <MovieCard movie={tvShow} />
                    </div>
                    
                    <div className="tvshow-detail__info">
                        {/* Badge de Anime */}
                        {isAnimeShow && (
                            <div className="tvshow-detail__anime-badge">
                                🎌 Anime
                            </div>
                        )}
                        
                        <h1 className="tvshow-detail__title">
                            {tvShow.name}
                            <span className="tvshow-detail__year">
                                ({new Date(tvShow.first_air_date).getFullYear()})
                            </span>
                        </h1>
                        
                        <div className="tvshow-detail__meta">
                            <span className="tvshow-detail__rating">
                                ⭐ {tvShow.vote_average?.toFixed(1)}/10
                            </span>
                            <span className="tvshow-detail__seasons">
                                {tvShow.number_of_seasons} temporada{tvShow.number_of_seasons !== 1 ? 's' : ''}
                            </span>
                            <span className="tvshow-detail__episodes">
                                {tvShow.number_of_episodes} episódio{tvShow.number_of_episodes !== 1 ? 's' : ''}
                            </span>
                            <span className="tvshow-detail__status">
                                {tvShow.status}
                            </span>
                        </div>

                        {/* Gêneros com emojis */}
                        <div className="tvshow-detail__genres">
                            {tvShow.genres?.map(genre => (
                                <span key={genre.id} className="tvshow-detail__genre-tag">
                                    {getGenreEmoji(genre.name)} {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="tvshow-detail__overview">
                            {tvShow.overview}
                        </p>

                        <div className="tvshow-detail__actions">
                            <button className="tvshow-detail__button tvshow-detail__button--primary">
                                ▶ Assistir
                            </button>
                            <FavoriteButton movie={tvShow} size="large" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo adicional */}
            <div className="tvshow-detail__content">
                {/* Temporadas e Episódios */}
                <section className="tvshow-detail__section">
                    <h2>📺 Temporadas e Episódios</h2>
                    <div className="tvshow-detail__seasons-list">
                        {tvShow.seasons?.filter(season => season.season_number > 0).map(season => (
                            <div key={season.id} className="season-card">
                                <div 
                                    className="season-card__header"
                                    onClick={() => toggleSeasonExpansion(season.season_number)}
                                >
                                    <div className="season-card__info">
                                        <h3>Temporada {season.season_number}</h3>
                                        <p>{season.episode_count} episódios • {season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'}</p>
                                    </div>
                                    <div className="season-card__poster">
                                        <img 
                                            src={imageService.getPosterUrl(season.poster_path, 'w154')} 
                                            alt={`Temporada ${season.season_number}`}
                                            onError={(e) => {
                                                e.target.src = '/placeholder-poster.jpg';
                                            }}
                                        />
                                    </div>
                                    <span className="season-card__toggle">
                                        {expandedSeason === season.season_number ? '▲' : '▼'}
                                    </span>
                                </div>
                                
                                {expandedSeason === season.season_number && (
                                    <div className="season-card__episodes">
                                        <p className="season-card__overview">
                                            {season.overview || `Temporada ${season.season_number} de ${tvShow.name}`}
                                        </p>
                                        
                                        {/* Lista de Episódios */}
                                        {loadingEpisodes[season.season_number] ? (
                                            <div className="episodes-loading">
                                                <Loading message="Carregando episódios..." size="small" />
                                            </div>
                                        ) : seasonDetails[season.season_number]?.episodes ? (
                                            <div className="episodes-list">
                                                <h4>Episódios:</h4>
                                                {seasonDetails[season.season_number].episodes.map(episode => (
                                                    <div key={episode.id} className="episode-card">
                                                        <div className="episode-card__number">
                                                            E{episode.episode_number}
                                                        </div>
                                                        <div className="episode-card__content">
                                                            <div className="episode-card__header">
                                                                <h5>{episode.name || `Episódio ${episode.episode_number}`}</h5>
                                                                <div className="episode-card__meta">
                                                                    {episode.runtime && (
                                                                        <span className="episode-runtime">
                                                                            ⏱️ {formatRuntime(episode.runtime)}
                                                                        </span>
                                                                    )}
                                                                    {episode.vote_average > 0 && (
                                                                        <span 
                                                                            className="episode-rating"
                                                                            style={{ color: getRatingColor(episode.vote_average) }}
                                                                        >
                                                                            ⭐ {episode.vote_average.toFixed(1)}
                                                                        </span>
                                                                    )}
                                                                    {episode.air_date && (
                                                                        <span className="episode-date">
                                                                            📅 {new Date(episode.air_date).toLocaleDateString('pt-BR')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {episode.overview && (
                                                                <p className="episode-card__overview">
                                                                    {episode.overview}
                                                                </p>
                                                            )}
                                                            {episode.still_path && (
                                                                <img 
                                                                    src={imageService.getPosterUrl(episode.still_path, 'w300')} 
                                                                    alt={episode.name}
                                                                    className="episode-card__image"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="episodes-error">
                                                <p>❌ Não foi possível carregar os episódios</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Elenco Principal */}
                {tvShow.credits?.cast?.length > 0 && (
                    <section className="tvshow-detail__section">
                        <h2>🎭 Elenco Principal</h2>
                        <div className="tvshow-detail__cast">
                            {tvShow.credits.cast.slice(0, 12).map(actor => (
                                <div key={actor.id} className="cast-card">
                                    <img 
                                        src={imageService.getPosterUrl(actor.profile_path, 'w185')} 
                                        alt={actor.name}
                                        className="cast-card__photo"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-profile.jpg';
                                        }}
                                    />
                                    <div className="cast-card__info">
                                        <h3>{actor.name}</h3>
                                        <p>{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Séries Similares */}
                {tvShow.similar?.results?.length > 0 && (
                    <section className="tvshow-detail__section">
                        <h2>🔗 Séries Similares</h2>
                        <div className="tvshow-detail__similar">
                            {tvShow.similar.results.slice(0, 8).map(similarShow => (
                                <MovieCard key={similarShow.id} movie={similarShow} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default TVShowDetail;