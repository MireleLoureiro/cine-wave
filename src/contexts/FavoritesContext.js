import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider')
    }
    
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // carregar do localstorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('cinewave-favorites');
        
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                console.log('✅ Favoritos carregados:', parsed);
                setFavorites(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
                console.error('❌ Erro ao parsear favoritos:', error);
                setFavorites([]);
            }
        } else {
            console.log('ℹ️ Nenhum favorito encontrado no localStorage');
        }
        setIsLoaded(true);
    }, []);

    // salva no localstorage
    useEffect(() => {
        if (isLoaded) {
            console.log('💾 Salvando favoritos:', favorites);
            try {
                localStorage.setItem('cinewave-favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('❌ Erro ao salvar favoritos:', error);
            }
        }
    }, [favorites, isLoaded]);

    const addFavorite = (movie) => {
        if (!movie || !movie.id) {
            return;
        }
        
        setFavorites(prev => {
            if(!prev.find(item => item.id === movie.id)) {
                return [...prev, movie];
            }
            return prev;
        });
    };

    const removeFavorite = (movieId) => {
        setFavorites(prev => prev.filter(item => item.id !== movieId));
    }

    const isFavorite = (movieId) => {
        return favorites.some((item) => item.id === movieId);
    }

    const toggleFavorite = (movie) => {
        if (!movie || !movie.id) {
            console.error('❌ Não é possível alternar favorito: filme inválido');
            return;
        }
        
        if (isFavorite(movie.id)) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    };

    const value = {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};