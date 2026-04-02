/**
 * Quest4Couple - Performance Utilities
 * Lazy loading, debounce, throttle e outras otimizações
 */

const Q4CPerformance = {
    
    /**
     * Lazy load de imagens com Intersection Observer
     */
    initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para browsers antigos
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    /**
     * Debounce - Atrasa execução até parar de chamar
     */
    debounce(func, wait = 250) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle - Limita execuções por intervalo
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Prefetch de páginas em links visíveis
     */
    initPrefetch() {
        if ('IntersectionObserver' in window) {
            const linkObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const link = entry.target;
                        const href = link.getAttribute('href');
                        
                        if (href && href.startsWith('/') && !href.includes('#')) {
                            const prefetchLink = document.createElement('link');
                            prefetchLink.rel = 'prefetch';
                            prefetchLink.href = href;
                            document.head.appendChild(prefetchLink);
                        }
                        linkObserver.unobserve(link);
                    }
                });
            }, { rootMargin: '100px' });

            document.querySelectorAll('a[href^="/"]').forEach(link => {
                linkObserver.observe(link);
            });
        }
    },

    /**
     * Cache de dados em memória
     */
    cache: new Map(),
    
    getCached(key, maxAge = 300000) { // 5 minutos default
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp < maxAge)) {
            return cached.data;
        }
        return null;
    },
    
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },

    /**
     * Request Animation Frame para animações suaves
     */
    smoothScroll(target, duration = 500) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    /**
     * Detectar conexão lenta
     */
    isSlowConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType === '2g' || 
                   connection.effectiveType === 'slow-2g' ||
                   connection.saveData === true;
        }
        return false;
    },

    /**
     * Inicializar todas as otimizações
     */
    init() {
        // Lazy load imagens
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initLazyLoad());
        } else {
            this.initLazyLoad();
        }

        // Prefetch apenas em conexões rápidas
        if (!this.isSlowConnection()) {
            this.initPrefetch();
        }

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    this.smoothScroll(target);
                }
            });
        });

        console.log('✅ Q4C Performance initialized');
    }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
    Q4CPerformance.init();
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Q4CPerformance;
}
