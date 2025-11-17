// components/VideoPlayer/VideoPlayer.jsx
import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ video, onClose, title }) => {
    if (!video) return null;

    return (
        <div className="video-player-overlay">
            <div className="video-player-container">
                <div className="video-player-header">
                    <h3>{title}</h3>
                    <button 
                        className="video-player-close"
                        onClick={onClose}
                        aria-label="Fechar player"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="video-player-content">
                    {video.site === 'YouTube' ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                            title={video.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="video-player-iframe"
                        />
                    ) : (
                        <div className="video-player-fallback">
                            <p>🚫 Player não disponível para este vídeo</p>
                            <p>Plataforma: {video.site}</p>
                            <a 
                                href={video.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="video-player-external-link"
                            >
                                Abrir em nova janela
                            </a>
                        </div>
                    )}
                </div>
                
                <div className="video-player-info">
                    <h4>{video.name}</h4>
                    <p>Tipo: {video.type} • Tamanho: {video.size}p</p>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;