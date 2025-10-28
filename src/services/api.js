import axios from 'axios';

// Configuração base do Axios para TMDB
const tmdbAPI = axios.create({
    baseURL: process.env.REACT_APP_TMDB_BASE_URL,
    params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'pt-BR',
        region: 'BR'
    },
    timeout: 1000
});

// Interceptor para tratamento de erros
tmdbAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erro na API TMDB: ', error.response?.data);
        return Promise.reject(error);
    }
)

// Serviços para filmes
export const movieService = {
    getPopular: () => tmdbAPI.get('/movie/popular'),
    getTrending: () => tmdbAPI.get('/trending/movie/week'),     //filmes em tendência
    getByGenre: (genreId) => tmdbAPI.get('/discover/movie', { params: { with_genres: genreId } }),
    getGenres: () => tmdbAPI.get('/genre/movie/list'),
    getDetails: (movieId) => tmdbAPI.get(`/movie/${movieId}`, { params: { append_to_response: 'credits,videos,similar' } }),
    search: (query) => tmdbAPI.get('/search/movie', { params: { query } } )
};

// Serviços para séries
export const tvService = {
    getPopular: () => tmdbAPI.get('/tv/popular'),
    getTrending: () => tmdbAPI.get('/trending/tv/week'),
    getByGenre: () => tmdbAPI.get('/discover/tv', { params: { append_to_response: 'credits,videos,similar' } }),
    getGenres: () => tmdbAPI.get('/genre/tv/list'),
    getDetails: (tvId) => tmdbAPI.get(`/tv/${tvId}`, { params: { append_to_response: 'credits,videos,similar' } }),
    search: (query) => tmdbAPI.get('/search/tv', { params: { query } }),
    getSeasonDetails: (tvId, seasonNumber) => tmdbAPI.get(`/tv/${tvId}/season/${seasonNumber}`)
};


// Serviço de busca MULTI (filmes + séries juntos)
export const searchService = {
    multi: (query) => tmdbAPI.get('/search/multi', { params: { query } })
}

// Serviços para gêneros (categorias)
export const genreService = {
    getMovieGenres: () => tmdbAPI.get('/genre/movie/list'),
    getTVGenres: () => tmdbAPI.get('/genre/tv/list')
};

// Utilitário para imagens
export const imageService = {
    getPosterUrl: (path, size = 'w500') =>
        path ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL}/${size}${path}`: '/placeholder-poster.jpg',

    getBackdropUrl: (path, size = 'w1280') => 
        path ? `${process.env.REACT_APP_TMDB_IMAGE_BASE_URL}/${size}${path}` : '/placeholder-backdrop.jpg'
};

// IDs das categorias que vamos usar (baseado no TMDB)
export const CATEGORIES = {
    POPULAR: 'popular',
    TRENDING: 'trending',
    ACTION: 28,
    COMEDY: 35,
    DRAMA: 18,
    HORROR: 27,
    DOCUMENTARY: 99,
    ANIMATION: 16,
    FANTASY: 14
};