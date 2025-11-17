import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

// Criar contexto
const FavoritesContext = createContext();

// Hook personalizado
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
    }
    return context;
};

// Provider principal
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // 🎯 CARREGAR FAVORITOS - useEffect 1
    useEffect(() => {
        const loadFavorites = () => {
            try {
                const savedFavorites = localStorage.getItem('cinewave-favorites');
                
                if (savedFavorites) {
                    const parsed = JSON.parse(savedFavorites);
                    console.log('✅ Favoritos carregados:', parsed.length, 'itens');
                    
                    // Validar e limpar dados corrompidos
                    const validFavorites = Array.isArray(parsed) 
                        ? parsed.filter(item => item && item.id && (item.title || item.name))
                        : [];
                    
                    setFavorites(validFavorites);
                } else {
                    console.log('ℹ️ Nenhum favorito encontrado no localStorage');
                    setFavorites([]);
                }
            } catch (error) {
                console.error('❌ Erro ao carregar favoritos:', error);
                setFavorites([]);
            } finally {
                setIsLoaded(true);
            }
        };

        loadFavorites();
    }, []);

    // 🎯 SALVAR FAVORITOS - useEffect 2 (com throttle)
    useEffect(() => {
        if (!isLoaded) return;
        
        const timeoutId = setTimeout(() => {
            try {
                console.log('💾 Salvando favoritos:', favorites.length, 'itens');
                localStorage.setItem('cinewave-favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('❌ Erro ao salvar favoritos:', error);
                
                // Fallback: tentar salvar sem os dados muito grandes
                if (error.name === 'QuotaExceededError') {
                    const simplifiedFavorites = favorites.map(({ id, title, name, poster_path, media_type }) => ({
                        id, title, name, poster_path, media_type
                    }));
                    localStorage.setItem('cinewave-favorites', JSON.stringify(simplifiedFavorites));
                    console.log('🔄 Favoritos simplificados salvos devido a limite de espaço');
                }
            }
        }, 500); // Throttle de 500ms

        return () => clearTimeout(timeoutId);
    }, [favorites, isLoaded]);

    // 🎯 ADICIONAR FAVORITO
    const addFavorite = useCallback((movie) => {
        if (!movie?.id) {
            console.warn('⚠️ Tentativa de adicionar favorito inválido:', movie);
            return false;
        }
        
        setFavorites(prev => {
            const exists = prev.find(item => item.id === movie.id);
            if (!exists) {
                // Garantir media_type
                const enhancedMovie = {
                    ...movie,
                    media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
                    // Timestamp para ordenação
                    addedAt: new Date().toISOString()
                };
                
                console.log('❤️ Adicionando favorito:', enhancedMovie.title || enhancedMovie.name);
                return [...prev, enhancedMovie];
            }
            console.log('ℹ️ Favorito já existe:', movie.title || movie.name);
            return prev;
        });
        
        return true;
    }, []);

    // 🎯 REMOVER FAVORITO
    const removeFavorite = useCallback((movieId) => {
        setFavorites(prev => {
            const updated = prev.filter(item => item.id !== movieId);
            console.log('🗑️ Removendo favorito ID:', movieId);
            return updated;
        });
    }, []);

    // 🎯 VERIFICAR SE É FAVORITO
    const isFavorite = useCallback((movieId) => {
        return favorites.some(item => item.id === movieId);
    }, [favorites]);

    // 🎯 ALTERNAR FAVORITO
    const toggleFavorite = useCallback((movie) => {
        if (!movie?.id) {
            console.error('❌ Não é possível alternar favorito: filme inválido');
            return false;
        }
        
        if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
            console.log('🔀 Removido dos favoritos:', movie.title || movie.name);
            return false;
        } else {
            addFavorite(movie);
            console.log('🔀 Adicionado aos favoritos:', movie.title || movie.name);
            return true;
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    // 🎯 LIMPAR TODOS OS FAVORITOS
    const clearFavorites = useCallback(() => {
        setFavorites([]);
        console.log('🧹 Todos os favoritos foram removidos');
    }, []);

    // 🎯 OBTER FAVORITOS POR TIPO
    const getFavoritesByType = useCallback((type) => {
        return favorites.filter(item => 
            item.media_type === type || 
            (type === 'movie' && !item.first_air_date) ||
            (type === 'tv' && item.first_air_date)
        );
    }, [favorites]);

    // 🎯 ORDENAR FAVORITOS
    const getSortedFavorites = useCallback((sortBy = 'addedAt') => {
        const sorted = [...favorites];
        
        switch (sortBy) {
            case 'title':
                sorted.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
                break;
            case 'year':
                sorted.sort((a, b) => {
                    const yearA = a.release_date || a.first_air_date;
                    const yearB = b.release_date || b.first_air_date;
                    return yearB.localeCompare(yearA);
                });
                break;
            case 'rating':
                sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
                break;
            case 'addedAt':
            default:
                sorted.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
                break;
        }
        
        return sorted;
    }, [favorites]);

    // 🎯 VALOR DO CONTEXT
    const value = {
        // Estado
        favorites,
        isLoaded,
        
        // Ações básicas
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        
        // Utilidades
        getFavoritesByType,
        getSortedFavorites,
        
        // Computed values
        favoritesCount: favorites.length,
        moviesCount: getFavoritesByType('movie').length,
        tvShowsCount: getFavoritesByType('tv').length,
        
        // Estados derivados
        hasFavorites: favorites.length > 0,
        isEmpty: favorites.length === 0 && isLoaded
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// 🎯 HOOK ADICIONAL PARA FAVORITE BUTTON
export const useFavoriteActions = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    
    const getFavoriteStatus = useCallback((movieId) => {
        return isFavorite(movieId);
    }, [isFavorite]);

    const handleToggleFavorite = useCallback((movie) => {
        return toggleFavorite(movie);
    }, [toggleFavorite]);

    return {
        getFavoriteStatus,
        handleToggleFavorite,
        isFavorite // alias para compatibilidade
    };
};