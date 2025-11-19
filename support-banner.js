/**
 * Support Banner Component
 * Componente reutilizável para solicitar donativos, feedback e partilhas
 */

const SupportBanner = {
    // Configurações
    config: {
        buyMeCoffeeUrl: 'https://buymeacoffee.com/quest4couple',
        feedbackFormUrl: '/pages/apoiar.html#feedback-form',
        shareUrls: {
            whatsapp: 'whatsapp://send?text=',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            instagram: 'https://www.instagram.com/' // Instagram não tem share direto, vai para perfil
        }
    },

    // Estilos CSS
    getStyles() {
        return `
            <style>
                .support-banner {
                    background: linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(111, 66, 193, 0.1));
                    border: 2px solid rgba(214, 51, 132, 0.3);
                    border-radius: 15px;
                    padding: 25px;
                    margin: 30px 0;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    animation: subtlePulse 3s ease-in-out infinite;
                }

                @keyframes subtlePulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
                    50% { transform: scale(1.01); box-shadow: 0 6px 20px rgba(214, 51, 132, 0.2); }
                }

                .support-banner-header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .support-banner-title {
                    font-size: 1.5em;
                    font-weight: 700;
                    color: #d63384;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .support-banner-subtitle {
                    font-size: 1em;
                    color: #666;
                    line-height: 1.6;
                }

                .support-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }

                .support-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s;
                    cursor: pointer;
                    border: 2px solid transparent;
                }

                .support-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .support-card.donate {
                    border-color: #ff813f;
                    background: linear-gradient(135deg, rgba(255, 129, 63, 0.1), rgba(255, 129, 63, 0.05));
                }

                .support-card.donate:hover {
                    background: linear-gradient(135deg, rgba(255, 129, 63, 0.15), rgba(255, 129, 63, 0.1));
                }

                .support-card.feedback {
                    border-color: #667eea;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05));
                }

                .support-card.feedback:hover {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(102, 126, 234, 0.1));
                }

                .support-card.share {
                    border-color: #28a745;
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
                }

                .support-card.share:hover {
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(40, 167, 69, 0.1));
                }

                .support-card-icon {
                    font-size: 3em;
                    margin-bottom: 10px;
                }

                .support-card-title {
                    font-size: 1.2em;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #333;
                }

                .support-card-description {
                    font-size: 0.9em;
                    color: #666;
                    line-height: 1.5;
                }

                .support-card-btn {
                    display: inline-block;
                    margin-top: 15px;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s;
                    border: none;
                    cursor: pointer;
                    font-size: 0.95em;
                }

                .support-card.donate .support-card-btn {
                    background: linear-gradient(135deg, #ff813f, #ff5733);
                    color: white;
                }

                .support-card.feedback .support-card-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .support-card.share .support-card-btn {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                }

                .support-card-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .share-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 15px;
                }                .share-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #dee2e6;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                    padding: 8px;
                }

                .share-btn svg {
                    width: 100%;
                    height: 100%;
                    transition: all 0.3s;
                }

                .share-btn:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .share-btn.whatsapp:hover { 
                    background: #25d366; 
                    border-color: #25d366; 
                }
                .share-btn.whatsapp:hover svg path { 
                    fill: white; 
                }

                .share-btn.facebook:hover { 
                    background: #1877f2; 
                    border-color: #1877f2; 
                }
                .share-btn.facebook:hover svg path { 
                    fill: white; 
                }

                .share-btn.instagram:hover { 
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                    border-color: #bc1888; 
                }
                .share-btn.instagram:hover svg path { 
                    fill: white; 
                }

                .support-banner-compact {
                    padding: 15px 20px;
                    margin: 20px 0;
                }

                .support-banner-compact .support-banner-title {
                    font-size: 1.2em;
                }

                .support-banner-compact .support-actions {
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }

                .support-banner-compact .support-card {
                    padding: 15px;
                }

                .support-banner-compact .support-card-icon {
                    font-size: 2em;
                }

                @media (max-width: 768px) {
                    .support-actions {
                        grid-template-columns: 1fr;
                    }

                    .support-banner {
                        padding: 20px 15px;
                    }
                }
            </style>
        `;
    },

    // Template completo (para páginas principais)
    getFullTemplate() {
        return `
            ${this.getStyles()}
            <div class="support-banner">
                <div class="support-banner-header">
                    <div class="support-banner-title">
                        <span>💝</span>
                        <span>Ajude-nos a Crescer!</span>
                    </div>
                    <div class="support-banner-subtitle">
                        O Quest4Couple é <strong>100% gratuito</strong>, mas desenvolvê-lo e mantê-lo requer tempo e custos. 
                        Se gostou, considere apoiar-nos de uma destas formas:
                    </div>
                </div>

                <div class="support-actions">
                    <!-- Donativo -->
                    <div class="support-card donate" onclick="SupportBanner.openDonation()">
                        <div class="support-card-icon">☕</div>
                        <div class="support-card-title">Ofereça um Café</div>
                        <div class="support-card-description">
                            Apoie o desenvolvimento com um pequeno donativo. Cada contribuição ajuda!
                        </div>
                        <button class="support-card-btn">💰 Doar Agora</button>
                    </div>

                    <!-- Feedback -->
                    <div class="support-card feedback" onclick="SupportBanner.openFeedback()">
                        <div class="support-card-icon">📝</div>
                        <div class="support-card-title">Deixe Feedback</div>
                        <div class="support-card-description">
                            Partilhe a sua experiência e ajude-nos a melhorar a plataforma.
                        </div>
                        <button class="support-card-btn">💬 Dar Feedback</button>
                    </div>

                    <!-- Partilhar -->
                    <div class="support-card share">
                        <div class="support-card-icon">📢</div>
                        <div class="support-card-title">Partilhe</div>
                        <div class="support-card-description">
                            Recomende o Quest4Couple aos seus amigos e ajude mais casais!
                        </div>                        <div class="share-buttons">
                            <a href="#" class="share-btn whatsapp" onclick="SupportBanner.share('whatsapp'); return false;" title="WhatsApp">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                                </svg>
                            </a>
                            <a href="#" class="share-btn facebook" onclick="SupportBanner.share('facebook'); return false;" title="Facebook">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                                </svg>
                            </a>
                            <a href="#" class="share-btn instagram" onclick="SupportBanner.share('instagram'); return false;" title="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
                                    <defs>
                                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Template compacto (para footer/modais)
    getCompactTemplate() {
        return `
            ${this.getStyles()}
            <div class="support-banner support-banner-compact">
                <div class="support-banner-header">
                    <div class="support-banner-title">
                        <span>💝</span>
                        <span>Gostou? Apoie o projeto!</span>
                    </div>
                </div>

                <div class="support-actions">
                    <div class="support-card donate" onclick="SupportBanner.openDonation()">
                        <div class="support-card-icon">☕</div>
                        <div class="support-card-title">Doar</div>
                        <button class="support-card-btn">💰 Apoiar</button>
                    </div>

                    <div class="support-card feedback" onclick="SupportBanner.openFeedback()">
                        <div class="support-card-icon">📝</div>
                        <div class="support-card-title">Feedback</div>
                        <button class="support-card-btn">💬 Opinar</button>
                    </div>                    <div class="support-card share">
                        <div class="support-card-icon">📢</div>
                        <div class="support-card-title">Partilhar</div>
                        <div class="share-buttons" style="margin-top: 10px;">
                            <a href="#" class="share-btn whatsapp" onclick="SupportBanner.share('whatsapp'); return false;" title="WhatsApp">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                                </svg>
                            </a>
                            <a href="#" class="share-btn facebook" onclick="SupportBanner.share('facebook'); return false;" title="Facebook">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                                </svg>
                            </a>
                            <a href="#" class="share-btn instagram" onclick="SupportBanner.share('instagram'); return false;" title="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient-compact)"/>
                                    <defs>
                                        <linearGradient id="instagram-gradient-compact" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Funções de ação
    openDonation() {
        window.open(this.config.buyMeCoffeeUrl, '_blank');
        this.trackAction('donation_click');
    },

    openFeedback() {
        window.open(this.config.feedbackFormUrl, '_blank');
        this.trackAction('feedback_click');
    },    share(platform) {
        const url = encodeURIComponent(window.location.origin);
        const text = encodeURIComponent('Descubram-se melhor com o Quest4Couple! 💑 Uma ferramenta gratuita para casais explorarem desejos e compatibilidades. ✨');
        
        let shareUrl = '';
        
        switch(platform) {
            case 'whatsapp':
                shareUrl = `${this.config.shareUrls.whatsapp}${text}%20${url}`;
                break;
            case 'facebook':
                shareUrl = `${this.config.shareUrls.facebook}${url}`;
                break;
            case 'instagram':
                // Instagram não permite share direto via URL, abre o perfil ou app
                alert('📸 Instagram\n\nPara partilhar no Instagram:\n1. Tira um screenshot desta página\n2. Partilha nos teus Stories ou Feed\n3. Menciona @quest4couple (se tiverem perfil)\n\n💡 Ou copia o link e cola na tua bio!');
                // Opcional: abrir Instagram app ou web
                shareUrl = this.config.shareUrls.instagram;
                this.trackAction('share_instagram');
                return; // Não abre popup
            case 'twitter':
                shareUrl = `${this.config.shareUrls.twitter}${url}&text=${text}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            this.trackAction(`share_${platform}`);
        }
    },

    // Analytics (integrar com Firebase Analytics se disponível)
    trackAction(action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'support_banner',
                'event_label': action
            });
        }
        console.log(`📊 Support action tracked: ${action}`);
    },    // Renderizar banner em um elemento específico
    render(elementId, compact = false) {
        const element = document.getElementById(elementId);
        if (element) {
            // Injetar estilos CSS primeiro (se ainda não existir)
            if (!document.getElementById('support-banner-styles')) {
                const styleElement = document.createElement('div');
                styleElement.id = 'support-banner-styles';
                styleElement.innerHTML = this.getStyles();
                document.head.appendChild(styleElement.firstChild);
            }
            
            // Injetar template HTML
            element.innerHTML = compact ? this.getCompactTemplate() : this.getFullTemplate();
        } else {
            console.error(`❌ Elemento com ID "${elementId}" não encontrado!`);
        }
    }
};

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupportBanner;
}
