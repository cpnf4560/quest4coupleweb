/* ============================================
   QUEST4COUPLE - PERFORMANCE OPTIMIZATION
   Detecta dispositivos lentos e ativa modo leve
   ============================================ */

(function() {
  'use strict';
  
  // Verificar se já foi detectado antes
  const savedMode = localStorage.getItem('quest4couple_performance_mode');
  
  if (savedMode === 'low') {
    document.documentElement.classList.add('low-performance-mode');
    console.log('⚡ Modo de performance baixa ativado (guardado)');
    return;
  }
  
  // Detectar dispositivos lentos
  function detectLowPerformance() {
    const indicators = [];
    
    // 1. Verificar memória disponível (se API disponível)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      indicators.push('low-memory');
    }
    
    // 2. Verificar número de cores do CPU
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      indicators.push('low-cpu');
    }
    
    // 3. Verificar conexão lenta
    if (navigator.connection) {
      const conn = navigator.connection;
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        indicators.push('slow-connection');
      }
    }
    
    // 4. Detectar dispositivos móveis antigos pelo user agent
    const ua = navigator.userAgent.toLowerCase();
    const isOldAndroid = /android [1-6]\./i.test(ua);
    const isOldiOS = /iphone os [1-9]_/i.test(ua) || /iphone os 1[0-2]_/i.test(ua);
    
    if (isOldAndroid || isOldiOS) {
      indicators.push('old-device');
    }
    
    // Se 2+ indicadores, ativar modo leve
    if (indicators.length >= 2) {
      return { isLow: true, reasons: indicators };
    }
    
    return { isLow: false, reasons: [] };
  }
  
  // Executar detecção
  const result = detectLowPerformance();
  
  if (result.isLow) {
    document.documentElement.classList.add('low-performance-mode');
    localStorage.setItem('quest4couple_performance_mode', 'low');
    console.log('⚡ Modo de performance baixa ativado:', result.reasons.join(', '));
  } else {
    console.log('✅ Performance normal detectada');
  }
  
  // Expor função para toggle manual
  window.togglePerformanceMode = function(forceLow) {
    const html = document.documentElement;
    
    if (forceLow === undefined) {
      forceLow = !html.classList.contains('low-performance-mode');
    }
    
    if (forceLow) {
      html.classList.add('low-performance-mode');
      localStorage.setItem('quest4couple_performance_mode', 'low');
      console.log('⚡ Modo leve ATIVADO');
    } else {
      html.classList.remove('low-performance-mode');
      localStorage.setItem('quest4couple_performance_mode', 'normal');
      console.log('🚀 Modo normal ATIVADO');
    }
    
    return forceLow;
  };
  
})();
