import React, { useState } from 'react';

// context
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';

// css
import './Profile.css';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const { favoritesCount, moviesCount, tvShowsCount, clearFavorites } = useFavorites();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');

        const result = await updateProfile(formData);

        if (result.success) {
            setSuccessMessage('Perfil atualizado com sucesso!');
            setIsEditing(false);
        } else {
            setErrors({ submit: result.error });
        }

        setIsLoading(false);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancelar edição - restaurar valores originais
            setFormData({
                name: user?.name || '',
            });
            setErrors({});
            setSuccessMessage('');
        }
        setIsEditing(!isEditing);
    };

    const handleClearFavorites = async () => {
        if (window.confirm('Tem certeza que deseja limpar todos os favoritos?')) {
            const result = await clearFavorites();
            if (result.success) {
                setSuccessMessage('Favoritos limpos com sucesso!');
            }
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Meu Perfil</h1>
                    <p>Gerencie suas informações e preferências</p>
                </div>

                <div className="profile-content">
                    {/* Informações do Usuário */}
                    <div className="profile-info">
                        <div className="profile-avatar">
                            <span className="avatar-circle">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        
                        <div className="profile-details">
                            {!isEditing ? (
                                <>
                                    <div className="profile-field">
                                        <label>Nome:</label>
                                        <span>{user?.name || 'Não informado'}</span>
                                    </div>
                                    <div className="profile-field">
                                        <label>Email:</label>
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="profile-field">
                                        <label>Membro desde:</label>
                                        <span>{new Date(user?.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    
                                    <div className="profile-actions">
                                        <button 
                                            className="profile-edit-button"
                                            onClick={handleEditToggle}
                                        >
                                            Editar Perfil
                                        </button>
                                        <button 
                                            className="profile-logout-button"
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="profile-form">
                                    {errors.submit && (
                                        <div className="error-message global-error">
                                            {errors.submit}
                                        </div>
                                    )}
                                    
                                    {successMessage && (
                                        <div className="success-message">
                                            {successMessage}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            placeholder="Seu nome"
                                            disabled={isLoading}
                                        />
                                        {errors.name && (
                                            <span className="error-message">{errors.name}</span>
                                        )}
                                    </div>

                                    <div className="profile-form-actions">
                                        <button 
                                            type="submit" 
                                            className="profile-save-button"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button 
                                            type="button"
                                            className="profile-cancel-button"
                                            onClick={handleEditToggle}
                                            disabled={isLoading}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="profile-stats">
                        <h3>Minha Atividade</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">{favoritesCount}</span>
                                <span className="stat-label">Favoritos no Total</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{moviesCount}</span>
                                <span className="stat-label">Filmes Favoritos</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{tvShowsCount}</span>
                                <span className="stat-label">Séries Favoritas</span>
                            </div>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="profile-actions-section">
                        <h3>Ações Rápidas</h3>
                        <div className="quick-actions">
                            <button 
                                className="action-button danger"
                                onClick={handleClearFavorites}
                                disabled={favoritesCount === 0}
                            >
                                🗑️ Limpar Todos os Favoritos
                            </button>
                            <button className="action-button">
                                📤 Exportar Dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;