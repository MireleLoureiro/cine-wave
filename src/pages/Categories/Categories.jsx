import React from 'react';
import { Link } from 'react-router-dom';

// service
import { CATEGORIES } from '../../services/api';

// css
import './Categories.css';

const Categories = () => {
    // 🎯 Dados centralizados e organizados
    const categoriesConfig = {
        movies: [
            { id: CATEGORIES.ACTION, name: 'Ação', emoji: '💥', description: 'Filmes cheios de adrenalina' },
            { id: CATEGORIES.COMEDY, name: 'Comédia', emoji: '😂', description: 'Risadas garantidas' },
            { id: CATEGORIES.DRAMA, name: 'Drama', emoji: '🎭', description: 'Histórias emocionantes' },
            { id: CATEGORIES.HORROR, name: 'Terror', emoji: '👻', description: 'Suspense e sustos' },
            { id: CATEGORIES.FANTASY, name: 'Fantasia', emoji: '🐉', description: 'Mundos mágicos' },
            { id: CATEGORIES.ANIMATION, name: 'Animação', emoji: '🎬', description: 'Para todas as idades' },
            { id: CATEGORIES.DOCUMENTARY, name: 'Documentário', emoji: '📝', description: 'Baseado em fatos reais' }
        ],
        tv: [
            { id: CATEGORIES.ACTION, name: 'Ação', emoji: '💥', description: 'Séries cheias de adrenalina' },
            { id: CATEGORIES.COMEDY, name: 'Comédia', emoji: '😂', description: 'Risadas garantidas' },
            { id: CATEGORIES.DRAMA, name: 'Drama', emoji: '🎭', description: 'Histórias emocionantes' },
            { id: CATEGORIES.HORROR, name: 'Terror', emoji: '👻', description: 'Suspense e sustos' },
            { id: CATEGORIES.FANTASY, name: 'Fantasia', emoji: '🐉', description: 'Mundos mágicos' },
            { id: CATEGORIES.ANIMATION, name: 'Animes', emoji: '🎌', description: 'Animações japonesas' },
            { id: CATEGORIES.DOCUMENTARY, name: 'Documentário', emoji: '📝', description: 'Baseado em fatos reais' }
        ]
    };

    // 🎯 Componente de Card Reutilizável
    const CategoryCard = ({ category, type }) => (
        <Link 
            to={`/category/${type}/${category.id}`}
            className="category-card"
            aria-label={`Explorar ${category.name} ${type === 'movie' ? 'filmes' : 'séries'}`}
        >
            <div className="category-card__emoji">
                {category.emoji}
            </div>
            <div className="category-card__content">
                <h3 className="category-card__name">
                    {category.name}
                </h3>
                <p className="category-card__description">
                    {category.description}
                </p>
                <span className="category-card__badge">
                    {type === 'movie' ? '🎥 Filmes' : '📺 Séries'}
                </span>
            </div>
        </Link>
    );

    return (
        <div className="categories-page">
            {/* 🎯 Header com Estatísticas */}
            <div className="categories-page__header">
                <h1>🎭 Explorar Categorias</h1>
                <p>Descubra {categoriesConfig.movies.length + categoriesConfig.tv.length} gêneros de filmes e séries</p>
                <div className="categories-stats">
                    <span className="categories-stat">
                        <strong>{categoriesConfig.movies.length}</strong> categorias de filmes
                    </span>
                    <span className="categories-stat">
                        <strong>{categoriesConfig.tv.length}</strong> categorias de séries
                    </span>
                </div>
            </div>

            {/* 🎯 Categorias de Filmes */}
            <section className="categories-section">
                <h2 className="categories-section__title">
                    🎥 Filmes
                </h2>
                <div className="categories-grid">
                    {categoriesConfig.movies.map(category => (
                        <CategoryCard 
                            key={`movie-${category.id}`}
                            category={category}
                            type="movie"
                        />
                    ))}
                </div>
            </section>

            {/* 🎯 Categorias de Séries */}
            <section className="categories-section">
                <h2 className="categories-section__title">
                    📺 Séries
                </h2>
                <div className="categories-grid">
                    {categoriesConfig.tv.map(category => (
                        <CategoryCard 
                            key={`tv-${category.id}`}
                            category={category}
                            type="tv"
                        />
                    ))}
                </div>
            </section>

            {/* 🎯 Call to Action */}
            <div className="categories-cta">
                <p>Não encontrou o que procurava?</p>
                <Link to="/search" className="categories-cta__link">
                    🔍 Fazer uma busca personalizada
                </Link>
            </div>
        </div>
    );
};

export default Categories;