/**
 * Support Banner Component
 * Componente reutilizável para solicitar donativos, feedback e partilhas
 */

const SupportBanner = {
    // Configurações
    config: {
        buyMeCoffeeUrl: '/pages/apoiar.html', // Redireciona para página de apoio
        feedbackFormUrl: '/pages/apoiar.html#feedback-form',
        shareUrls: {
            whatsapp: 'whatsapp://send?text=',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            instagram: 'https://www.instagram.com/', // Instagram não tem share direto, vai para perfil
            reddit: 'https://www.reddit.com/submit?url='
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
                }                .support-actions {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-top: 20px;
                    align-items: stretch;
                }
                
                @media (max-width: 900px) {
                    .support-actions {
                        grid-template-columns: 1fr;
                    }
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
                }                .share-btn.instagram:hover { 
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                    border-color: #bc1888; 
                }
                .share-btn.instagram:hover svg path { 
                    fill: white; 
                }

                .share-btn.reddit:hover { 
                    background: #FF4500; 
                    border-color: #FF4500; 
                }
                .share-btn.reddit:hover svg path { 
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
            <div class="support-banner">                <div class="support-banner-header">
                    <div class="support-banner-title">
                        <span>💝</span>
                        <span data-i18n="banner.title">Ajuda-nos a crescer!</span>
                    </div>
                    <div class="support-banner-subtitle" data-i18n-html="banner.description">
                        O Quest4Couple é <strong>100% gratuito</strong>, mas desenvolvê-lo e mantê-lo requer tempo e custos. 
                        Se gostaste, considera apoiar-nos de uma destas formas:
                    </div>
                </div>

                <div class="support-actions">                    <!-- Donativo -->
                    <div class="support-card donate" onclick="SupportBanner.openDonation()">
                        <div class="support-card-icon">☕</div>
                        <div class="support-card-title" data-i18n="banner.donate">Oferece um Café</div>
                        <div class="support-card-description" data-i18n="support.ways.donate.description">
                            Apoia o desenvolvimento com um pequeno donativo. Cada contribuição ajuda!
                        </div>
                        <button class="support-card-btn" data-i18n="support.ways.donate.button">💰 Doar Agora</button>
                    </div>

                    <!-- Feedback -->
                    <div class="support-card feedback" onclick="SupportBanner.openFeedback()">
                        <div class="support-card-icon">📝</div>
                        <div class="support-card-title" data-i18n="banner.feedback">Deixa Feedback</div>
                        <div class="support-card-description" data-i18n="support.ways.feedback.description">
                            Partilha a tua experiência e ajuda-nos a melhorar a plataforma.
                        </div>
                        <button class="support-card-btn" data-i18n="support.ways.feedback.button">💬 Dar Feedback</button>
                    </div>

                    <!-- Partilhar -->
                    <div class="support-card share">
                        <div class="support-card-icon">📢</div>
                        <div class="support-card-title" data-i18n="banner.share">Partilha</div>
                        <div class="support-card-description" data-i18n="support.ways.share.description">
                            Recomenda o Quest4Couple aos teus amigos e ajuda mais casais!
                        </div><div class="share-buttons">
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
                            <a href="#" class="share-btn reddit" onclick="SupportBanner.share('reddit'); return false;" title="Reddit">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#FF4500"/>
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
                        <span>Gostaste? Apoia o projeto!</span>
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
                        <div class="support-card-title">Partilha</div>
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
                            <a href="#" class="share-btn reddit" onclick="SupportBanner.share('reddit'); return false;" title="Reddit">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#FF4500"/>
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
            case 'reddit':
                shareUrl = `${this.config.shareUrls.reddit}${url}&title=${text}`;
                break;
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
    },

    // ========================================
    // MODAL PÓS-RELATÓRIO
    // ========================================
    
    // Verificar se o modal já foi mostrado
    hasShownDonationModal() {
        return localStorage.getItem('q4c_donation_modal_shown') === 'true';
    },
    
    // Marcar como mostrado
    markDonationModalShown() {
        localStorage.setItem('q4c_donation_modal_shown', 'true');
    },
    
    // Template do modal pós-relatório
    getDonationModalTemplate() {
        return `
            <style>
                .donation-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                    backdrop-filter: blur(5px);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .donation-modal {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease;
                }
                
                .donation-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    transition: all 0.2s;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .donation-modal-close:hover {
                    background: #f5f5f5;
                    color: #333;
                }
                
                .donation-modal-icon {
                    font-size: 60px;
                    margin-bottom: 15px;
                    animation: bounce 0.6s ease;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .donation-modal-title {
                    font-size: 1.6em;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .donation-modal-divider {
                    width: 60%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #d63384, transparent);
                    margin: 20px auto;
                }
                
                .donation-modal-text {
                    font-size: 1.1em;
                    color: #d63384;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                
                .donation-modal-subtext {
                    font-size: 0.95em;
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 25px;
                }
                
                .donation-modal-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 35px;
                    background: linear-gradient(135deg, #ff813f, #ff6b35);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1em;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(255, 129, 63, 0.4);
                }
                
                .donation-modal-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(255, 129, 63, 0.5);
                }
                
                .donation-modal-skip {
                    display: block;
                    margin-top: 20px;
                    color: #999;
                    font-size: 0.9em;
                    text-decoration: none;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .donation-modal-skip:hover {
                    color: #667eea;
                }
                
                .donation-modal-hearts {
                    position: absolute;
                    font-size: 20px;
                    opacity: 0.3;
                }
                
                .donation-modal-hearts.left { top: 20%; left: 10%; }
                .donation-modal-hearts.right { top: 15%; right: 10%; }
                .donation-modal-hearts.bottom { bottom: 15%; left: 50%; transform: translateX(-50%); }
            </style>
            
            <div class="donation-modal-overlay" id="donationModalOverlay" onclick="SupportBanner.closeDonationModal(event)">
                <div class="donation-modal" onclick="event.stopPropagation()">
                    <button class="donation-modal-close" onclick="SupportBanner.closeDonationModal()">&times;</button>
                    
                    <span class="donation-modal-hearts left">💕</span>
                    <span class="donation-modal-hearts right">💕</span>
                    <span class="donation-modal-hearts bottom">✨</span>
                    
                    <div class="donation-modal-icon">🎉</div>
                    <div class="donation-modal-title">O vosso relatório está pronto!</div>
                    
                    <div class="donation-modal-divider"></div>
                    
                    <div class="donation-modal-text">💕 Gostaram da experiência?</div>
                    <div class="donation-modal-subtext">
                        O Quest4Couple é 100% gratuito e mantido com carinho.<br>
                        Se quiserem apoiar o projeto, ficamos muito agradecidos!
                    </div>
                    
                    <a href="/pages/apoiar.html" class="donation-modal-btn" onclick="SupportBanner.trackAction('donation_modal_click')">
                        ☕ Apoiar com um café
                    </a>
                    
                    <span class="donation-modal-skip" onclick="SupportBanner.closeDonationModal()">
                        Ver Relatório →
                    </span>
                </div>
            </div>
        `;
    },
    
    // Mostrar modal de doação
    showDonationModal() {
        // Não mostrar se já foi mostrado antes
        if (this.hasShownDonationModal()) {
            console.log('💬 Modal de doação já foi mostrado anteriormente');
            return;
        }
        
        // Criar container para o modal
        const modalContainer = document.createElement('div');
        modalContainer.id = 'donationModalContainer';
        modalContainer.innerHTML = this.getDonationModalTemplate();
        document.body.appendChild(modalContainer);
        
        // Marcar como mostrado
        this.markDonationModalShown();
        this.trackAction('donation_modal_shown');
        
        console.log('✅ Modal de doação exibido');
    },
    
    // Fechar modal
    closeDonationModal(event) {
        if (event && event.target.id !== 'donationModalOverlay') return;
        
        const container = document.getElementById('donationModalContainer');
        if (container) {
            container.remove();
        }
        this.trackAction('donation_modal_closed');
    },

    // ========================================
    // BANNER PARA PÁGINA DE ESTATÍSTICAS
    // ========================================
    
    getStatsBannerTemplate() {
        return `
            <style>
                .stats-support-banner {
                    background: linear-gradient(135deg, rgba(214, 51, 132, 0.08), rgba(102, 126, 234, 0.08));
                    border: 2px solid rgba(214, 51, 132, 0.2);
                    border-radius: 16px;
                    padding: 30px;
                    margin-top: 30px;
                    text-align: center;
                }
                
                .stats-support-banner h3 {
                    font-size: 1.3em;
                    color: #d63384;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .stats-support-banner p {
                    color: #666;
                    margin-bottom: 20px;
                    font-size: 1em;
                }
                
                .stats-support-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 28px;
                    background: linear-gradient(135deg, #ff813f, #ff6b35);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                }
                
                .stats-support-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 129, 63, 0.4);
                }
            </style>
            
            <div class="stats-support-banner">
                <h3>💕 Gostaste das estatísticas?</h3>
                <p>Ajuda-nos a manter o Quest4Couple gratuito para todos os casais!</p>
                <a href="/pages/apoiar.html" class="stats-support-btn" onclick="SupportBanner.trackAction('stats_banner_click')">
                    ☕ Apoiar o projeto
                </a>
            </div>
        `;
    },
    
    // Renderizar banner de estatísticas
    renderStatsBanner(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = this.getStatsBannerTemplate();
            console.log('✅ Banner de estatísticas renderizado');
        }
    },

    // Renderizar banner em um elemento específico
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
              // Escutar mudanças de idioma (REMOVIDO: applyTranslations já é chamado automaticamente)
            document.addEventListener('languageChanged', () => {
                console.log('✅ Support banner detectou mudança de idioma');
                // NÃO chamar applyTranslations() aqui - isso cria loop infinito!
            });
        } else {
            console.error(`❌ Elemento com ID "${elementId}" não encontrado!`);
        }
    }
};

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupportBanner;
}
