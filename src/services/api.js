import axios from 'axios';

// Configuração base do Axios para TMDB
const tmdbAPI = axios.create({
    baseURL: process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'pt-BR',
        region: 'BR'
    },
    timeout: 10000, // 👈 Aumentado para 10 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para requests
tmdbAPI.interceptors.request.use(
    (config) => {
        console.log(`🚀 Fazendo request para: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Erro no request:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
tmdbAPI.interceptors.response.use(
    (response) => {
        console.log(`✅ Response recebido de: ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error('❌ Erro na API TMDB:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.status_message || error.message
        });
        
        // 🎯 Tratamento específico por tipo de erro
        if (error.response?.status === 401) {
            console.error('🔑 Erro de autenticação - Verifique sua API Key');
        } else if (error.response?.status === 404) {
            console.error('🔍 Recurso não encontrado');
        } else if (error.response?.status === 429) {
            console.error('⏰ Rate limit excedido - Muitas requests');
        } else if (error.code === 'ECONNABORTED') {
            console.error('⏰ Timeout - Request muito lento');
        }
        
        return Promise.reject(error);
    }
);

// Serviços para filmes
export const movieService = {
    // 🎯 Listagens
    getPopular: (page = 1) => tmdbAPI.get('/movie/popular', { params: { page } }),
    getTrending: (page = 1) => tmdbAPI.get('/trending/movie/week', { params: { page } }),
    getNowPlaying: (page = 1) => tmdbAPI.get('/movie/now_playing', { params: { page } }),
    getTopRated: (page = 1) => tmdbAPI.get('/movie/top_rated', { params: { page } }),
    getUpcoming: (page = 1) => tmdbAPI.get('/movie/upcoming', { params: { page } }),
    
    // 🎯 Busca e Filtros
    getByGenre: (genreId, page = 1) => tmdbAPI.get('/discover/movie', { 
        params: { 
            with_genres: genreId, 
            page,
            sort_by: 'popularity.desc'
        } 
    }),
    
    // 🎯 Detalhes
    getDetails: (movieId) => tmdbAPI.get(`/movie/${movieId}`, { 
        params: { 
            append_to_response: 'credits,videos,similar,recommendations' 
        } 
    }),
    
    getCredits: (movieId) => tmdbAPI.get(`/movie/${movieId}/credits`),
    getVideos: (movieId) => tmdbAPI.get(`/movie/${movieId}/videos`),
    getSimilar: (movieId, page = 1) => tmdbAPI.get(`/movie/${movieId}/similar`, { params: { page } }),
    getRecommendations: (movieId, page = 1) => tmdbAPI.get(`/movie/${movieId}/recommendations`, { params: { page } }),
    
    // 🎯 Busca
    search: (query, page = 1) => tmdbAPI.get('/search/movie', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    })
};

// Serviços para séries
export const tvService = {
    // 🎯 Listagens
    getPopular: (page = 1) => tmdbAPI.get('/tv/popular', { params: { page } }),
    getTrending: (page = 1) => tmdbAPI.get('/trending/tv/week', { params: { page } }),
    getTopRated: (page = 1) => tmdbAPI.get('/tv/top_rated', { params: { page } }),
    getOnTheAir: (page = 1) => tmdbAPI.get('/tv/on_the_air', { params: { page } }),
    getAiringToday: (page = 1) => tmdbAPI.get('/tv/airing_today', { params: { page } }),
    
    // 🎯 Busca e Filtros
    getByGenre: (genreId, page = 1) => tmdbAPI.get('/discover/tv', { 
        params: { 
            with_genres: genreId, 
            page,
            sort_by: 'popularity.desc'
        } 
    }),
    
    // 🎯 Detalhes
    getDetails: (tvId) => tmdbAPI.get(`/tv/${tvId}`, { 
        params: { 
            append_to_response: 'credits,videos,similar,recommendations,content_ratings' 
        } 
    }),
    
    getCredits: (tvId) => tmdbAPI.get(`/tv/${tvId}/credits`),
    getVideos: (tvId) => tmdbAPI.get(`/tv/${tvId}/videos`),
    getSimilar: (tvId, page = 1) => tmdbAPI.get(`/tv/${tvId}/similar`, { params: { page } }),
    getRecommendations: (tvId, page = 1) => tmdbAPI.get(`/tv/${tvId}/recommendations`, { params: { page } }),
    
    // 🎯 Temporadas e Episódios
    getSeasonDetails: (tvId, seasonNumber) => tmdbAPI.get(`/tv/${tvId}/season/${seasonNumber}`),
    getEpisodeDetails: (tvId, seasonNumber, episodeNumber) => 
        tmdbAPI.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`),
    
    // 🎯 Busca
    search: (query, page = 1) => tmdbAPI.get('/search/tv', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    })
};

// Serviço de busca MULTI (filmes + séries + pessoas)
export const searchService = {
    multi: (query, page = 1) => tmdbAPI.get('/search/multi', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    }),
    
    movies: (query, page = 1) => tmdbAPI.get('/search/movie', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    }),
    
    tvShows: (query, page = 1) => tmdbAPI.get('/search/tv', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    }),
    
    people: (query, page = 1) => tmdbAPI.get('/search/person', { 
        params: { 
            query, 
            page,
            include_adult: false 
        } 
    })
};

// Serviços para gêneros (categorias)
export const genreService = {
    getMovieGenres: () => tmdbAPI.get('/genre/movie/list'),
    getTVGenres: () => tmdbAPI.get('/genre/tv/list')
};

// Utilitário para imagens
export const imageService = {
    getPosterUrl: (path, size = 'w500') =>
        path ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/${size}${path}` : '/images/placeholder-poster.jpg',

    getBackdropUrl: (path, size = 'w1280') => 
        path ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/${size}${path}` : '/images/placeholder-backdrop.jpg',

    getProfileUrl: (path, size = 'w185') =>
        path ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/${size}${path}` : '/images/placeholder-avatar.jpg'
};

// IDs das categorias que vamos usar (baseado no TMDB)
export const CATEGORIES = {
    ACTION: 28,
    COMEDY: 35,
    DRAMA: 18,
    HORROR: 27,
    DOCUMENTARY: 99,
    ANIMATION: 16,
    FANTASY: 14
};