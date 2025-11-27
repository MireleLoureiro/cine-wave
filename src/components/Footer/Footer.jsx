import React from 'react';
import { Link } from 'react-router-dom';

// contexts
import { useTheme } from '../../contexts/ThemeContext';

// csss
import './Footer.css';

const Footer = () => {
    const { isDarkMode } = useTheme();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__container">
                {/* Seção Principal */}
                <div className="footer__main">
                    {/* Logo e Descrição */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            🎬 CineWave
                        </Link>
                        <p className="footer__description">
                            Descubra e explore um mundo de filmes e séries. 
                            Sua plataforma favorita para entretenimento.
                        </p>
                        <div className="footer__social">
                            <a 
                                href="#" 
                                className="footer__social-link"
                                aria-label="Facebook"
                                title="Facebook"
                            >
                                📘
                            </a>
                            <a 
                                href="#" 
                                className="footer__social-link"
                                aria-label="Twitter"
                                title="Twitter"
                            >
                                🐦
                            </a>
                            <a 
                                href="#" 
                                className="footer__social-link"
                                aria-label="Instagram"
                                title="Instagram"
                            >
                                📷
                            </a>
                            <a 
                                href="#" 
                                className="footer__social-link"
                                aria-label="YouTube"
                                title="YouTube"
                            >
                                📺
                            </a>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div className="footer__section">
                        <h3 className="footer__title">Navegação</h3>
                        <ul className="footer__links">
                            <li>
                                <Link to="/" className="footer__link">Início</Link>
                            </li>
                            <li>
                                <Link to="/categories" className="footer__link">Categorias</Link>
                            </li>
                            <li>
                                <Link to="/search" className="footer__link">Busca</Link>
                            </li>
                            <li>
                                <Link to="/favorites" className="footer__link">Minha Lista</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Suporte */}
                    <div className="footer__section">
                        <h3 className="footer__title">Suporte</h3>
                        <ul className="footer__links">
                            <li>
                                <a href="#" className="footer__link">Ajuda</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">FAQ</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">Contato</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">Reportar Problema</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer__section">
                        <h3 className="footer__title">Legal</h3>
                        <ul className="footer__links">
                            <li>
                                <a href="#" className="footer__link">Termos de Uso</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">Política de Privacidade</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">Cookies</a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">DMCA</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer__section">
                        <h3 className="footer__title">Newsletter</h3>
                        <p className="footer__newsletter-text">
                            Receba as últimas atualizações e novidades.
                        </p>
                        <form className="footer__newsletter">
                            <input 
                                type="email" 
                                placeholder="Seu melhor email"
                                className="footer__newsletter-input"
                            />
                            <button 
                                type="submit"
                                className="footer__newsletter-button"
                            >
                                Inscrever
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divisor */}
                <div className="footer__divider"></div>

                {/* Rodapé Inferior */}
                <div className="footer__bottom">
                    <div className="footer__copyright">
                        <p>&copy; {currentYear} CineWave. Todos os direitos reservados.</p>
                        <p className="footer__disclaimer">
                            Este site é apenas para fins educacionais. 
                            Dados fornecidos por TMDB.
                        </p>
                    </div>
                    
                    <div className="footer__tech">
                        <span className="footer__tech-text">
                            Desenvolvido com React ⚛️ & TMDB API
                        </span>
                        <div className="footer__theme-badge">
                            {isDarkMode ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;