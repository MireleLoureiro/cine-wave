import React from 'react';
import { Link } from 'react-router-dom';

// service
import { CATEGORIES } from '../../services/api';

// css
import './Categories.css';

const Categories = () => {
    // Categorias para Filmes
    const movieCategories = [
        { id: CATEGORIES.ACTION, name: '💥 Ação', type: 'movie', emoji: '💥' },
        { id: CATEGORIES.COMEDY, name: '😂 Comédia', type: 'movie', emoji: '😂' },
        { id: CATEGORIES.DRAMA, name: '🎭 Drama', type: 'movie', emoji: '🎭' },
        { id: CATEGORIES.HORROR, name: '👻 Terror', type: 'movie', emoji: '👻' },
        { id: CATEGORIES.FANTASY, name: '🐉 Fantasia', type: 'movie', emoji: '🐉' },
        { id: CATEGORIES.ANIMATION, name: '🎬 Animação', type: 'movie', emoji: '🎬' },
        { id: CATEGORIES.DOCUMENTARY, name: '📝 Documentário', type: 'movie', emoji: '📝' }
    ];

    // Categorias para Séries
    const tvCategories = [
        { id: CATEGORIES.ACTION, name: '💥 Ação', type: 'tv', emoji: '💥' },
        { id: CATEGORIES.COMEDY, name: '😂 Comédia', type: 'tv', emoji: '😂' },
        { id: CATEGORIES.DRAMA, name: '🎭 Drama', type: 'tv', emoji: '🎭' },
        { id: CATEGORIES.HORROR, name: '👻 Terror', type: 'tv', emoji: '👻' },
        { id: CATEGORIES.FANTASY, name: '🐉 Fantasia', type: 'tv', emoji: '🐉' },
        { id: CATEGORIES.ANIMATION, name: '🎌 Animes', type: 'tv', emoji: '🎌' },
        { id: CATEGORIES.DOCUMENTARY, name: '📝 Documentário', type: 'tv', emoji: '📝' }
    ];

    return (
        <div className="categories-page">
            <div className="categories-page__header">
                <h1>Explorar Categorias</h1>
                <p>Descubra filmes e séries por gênero</p>
            </div>

            {/* Categorias de Filmes */}
            <section className="categories-section">
                <h2 className="categories-section__title">
                    🎥 Filmes
                </h2>
                <div className="categories-grid">
                    {movieCategories.map(category => (
                        <Link 
                            key={`movie-${category.id}`}
                            to={`/category/movie/${category.id}`}
                            className="category-card"
                        >
                            <div className="category-card__emoji">
                                {category.emoji}
                            </div>
                            <span className="category-card__name">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Categorias de Séries */}
            <section className="categories-section">
                <h2 className="categories-section__title">
                    📺 Séries
                </h2>
                <div className="categories-grid">
                    {tvCategories.map(category => (
                        <Link 
                            key={`tv-${category.id}`}
                            to={`/category/tv/${category.id}`}
                            className="category-card"
                        >
                            <div className="category-card__emoji">
                                {category.emoji}
                            </div>
                            <span className="category-card__name">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Categories;