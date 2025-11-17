import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { user, isAuthenticated } = useAuth();

    // 🎯 CARREGAR FAVORITOS - Apenas se usuário estiver logado
    useEffect(() => {
        const loadFavorites = () => {
            try {
                if (isAuthenticated && user) {
                    const userFavorites = localStorage.getItem(`cinewave-favorites-${user.id}`);
                    
                    if (userFavorites) {
                        const parsed = JSON.parse(userFavorites);
                        console.log('✅ Favoritos carregados para usuário:', user.email, parsed.length, 'itens');
                        
                        const validFavorites = Array.isArray(parsed) 
                            ? parsed.filter(item => item && item.id && (item.title || item.name))
                            : [];
                        
                        setFavorites(validFavorites);
                    } else {
                        console.log('ℹ️ Nenhum favorito encontrado para usuário:', user.email);
                        setFavorites([]);
                    }
                } else {
                    // Usuário não logado - limpar favoritos
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
    }, [isAuthenticated, user]);

    // 🎯 SALVAR FAVORITOS - Apenas se usuário estiver logado
    useEffect(() => {
        if (!isLoaded || !isAuthenticated || !user) return;
        
        const timeoutId = setTimeout(() => {
            try {
                console.log('💾 Salvando favoritos para usuário:', user.email, favorites.length, 'itens');
                localStorage.setItem(`cinewave-favorites-${user.id}`, JSON.stringify(favorites));
            } catch (error) {
                console.error('❌ Erro ao salvar favoritos:', error);
                
                if (error.name === 'QuotaExceededError') {
                    const simplifiedFavorites = favorites.map(({ id, title, name, poster_path, media_type }) => ({
                        id, title, name, poster_path, media_type
                    }));
                    localStorage.setItem(`cinewave-favorites-${user.id}`, JSON.stringify(simplifiedFavorites));
                    console.log('🔄 Favoritos simplificados salvos devido a limite de espaço');
                }
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [favorites, isLoaded, isAuthenticated, user]);

    // 🎯 ADICIONAR FAVORITO - Apenas se logado
    const addFavorite = useCallback((movie) => {
        if (!isAuthenticated) {
            console.warn('⚠️ Usuário precisa estar logado para adicionar favoritos');
            return { success: false, requiresLogin: true };
        }
        
        if (!movie?.id) {
            console.warn('⚠️ Tentativa de adicionar favorito inválido:', movie);
            return { success: false, error: 'Filme inválido' };
        }
        
        setFavorites(prev => {
            const exists = prev.find(item => item.id === movie.id);
            if (!exists) {
                const enhancedMovie = {
                    ...movie,
                    media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
                    addedAt: new Date().toISOString(),
                    userId: user.id // Associar ao usuário
                };
                
                console.log('❤️ Adicionando favorito para usuário:', user.email, enhancedMovie.title || enhancedMovie.name);
                return [...prev, enhancedMovie];
            }
            console.log('ℹ️ Favorito já existe:', movie.title || movie.name);
            return prev;
        });
        
        return { success: true };
    }, [isAuthenticated, user]);

    // 🎯 REMOVER FAVORITO
    const removeFavorite = useCallback((movieId) => {
        if (!isAuthenticated) {
            console.warn('⚠️ Usuário precisa estar logado para remover favoritos');
            return { success: false, requiresLogin: true };
        }
        
        setFavorites(prev => {
            const updated = prev.filter(item => item.id !== movieId);
            console.log('🗑️ Removendo favorito ID:', movieId, 'do usuário:', user.email);
            return updated;
        });
        
        return { success: true };
    }, [isAuthenticated, user]);

    // 🎯 VERIFICAR SE É FAVORITO
    const isFavorite = useCallback((movieId) => {
        return isAuthenticated && favorites.some(item => item.id === movieId);
    }, [favorites, isAuthenticated]);

    // 🎯 ALTERNAR FAVORITO - Com verificação de login
    const toggleFavorite = useCallback((movie) => {
        if (!isAuthenticated) {
            console.warn('⚠️ Usuário precisa estar logado para favoritar');
            return { success: false, requiresLogin: true };
        }
        
        if (!movie?.id) {
            console.error('❌ Não é possível alternar favorito: filme inválido');
            return { success: false, error: 'Filme inválido' };
        }
        
        if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
            console.log('🔀 Removido dos favoritos:', movie.title || movie.name);
            return { success: true, favorited: false };
        } else {
            addFavorite(movie);
            console.log('🔀 Adicionado aos favoritos:', movie.title || movie.name);
            return { success: true, favorited: true };
        }
    }, [isAuthenticated, isFavorite, addFavorite, removeFavorite]);

    // 🎯 LIMPAR TODOS OS FAVORITOS
    const clearFavorites = useCallback(() => {
        if (!isAuthenticated) {
            return { success: false, requiresLogin: true };
        }
        
        setFavorites([]);
        localStorage.removeItem(`cinewave-favorites-${user.id}`);
        console.log('🧹 Todos os favoritos foram removidos para usuário:', user.email);
        return { success: true };
    }, [isAuthenticated, user]);

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
        
        // Ações básicas (agora retornam status)
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
        isEmpty: favorites.length === 0 && isLoaded,
        requiresLogin: !isAuthenticated
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// 🎯 HOOK ADICIONAL PARA FAVORITE BUTTON (Com tratamento de login)
export const useFavoriteActions = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { isAuthenticated } = useAuth();
    
    const getFavoriteStatus = useCallback((movieId) => {
        return isFavorite(movieId);
    }, [isFavorite]);

    const handleToggleFavorite = useCallback((movie) => {
        const result = toggleFavorite(movie);
        
        if (result.requiresLogin) {
            // Pode ser usado para mostrar modal de login
            return { requiresLogin: true };
        }
        
        return result;
    }, [toggleFavorite]);

    return {
        getFavoriteStatus,
        handleToggleFavorite,
        isFavorite,
        canFavorite: isAuthenticated
    };
};