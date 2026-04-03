/**
 * Quest4Couple - Single Article Page
 * Página individual de artigo com suporte a URL sharing
 */

// ================================
// STATE
// ================================
var currentArticle = null;

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', function() {
  loadArticleFromURL();
  initMobileMenu();
});

function initMobileMenu() {
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var nav = document.querySelector('.nav');
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
}

// ================================
// ARTICLE LOADING
// ================================
function loadArticleFromURL() {
  // Obter slug da URL: artigo.html?slug=pegging-guia
  var urlParams = new URLSearchParams(window.location.search);
  var slug = urlParams.get('slug');
  
  // Também suporta: artigo.html?id=pegging-guia (para compatibilidade)
  if (!slug) {
    slug = urlParams.get('id');
  }
  
  if (!slug) {
    showError();
    return;
  }
  
  // Procurar artigo por slug ou id
  var article = articlesData.find(function(a) {
    return a.slug === slug || a.id === slug;
  });
  
  if (!article) {
    showError();
    return;
  }
  
  currentArticle = article;
  displayArticle(article);
}

function showError() {
  document.getElementById('articleLoading').style.display = 'none';
  document.getElementById('articleError').style.display = 'block';
  document.getElementById('articleWrapper').style.display = 'none';
}

function displayArticle(article) {
  // Esconder loading, mostrar conteúdo
  document.getElementById('articleLoading').style.display = 'none';
  document.getElementById('articleError').style.display = 'none';
  document.getElementById('articleWrapper').style.display = 'block';
  
  // Atualizar meta tags para SEO e partilha
  updateMetaTags(article);
  
  // Breadcrumb
  document.getElementById('breadcrumbTitle').textContent = article.title;
  
  // Header
  document.getElementById('articleCategory').textContent = article.icon + ' ' + article.categoryLabel;
  document.getElementById('articleReadTime').textContent = '📖 ' + article.readTime + ' min de leitura';
  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleExcerpt').textContent = article.excerpt;
  
  // Imagem
  var imageContainer = document.getElementById('articleImage');
  if (article.image) {
    imageContainer.style.backgroundImage = "url('" + article.image + "')";
    imageContainer.classList.add('has-image');
  }
  document.getElementById('articleIcon').textContent = article.icon;
  
  // Conteúdo principal
  document.getElementById('articleContent').innerHTML = article.content;
  
  // Discussão e Comentários
  var discussionSection = '';
  if (article.discussionPrompt) {
    discussionSection = buildDiscussionSection(article);
  }
  discussionSection += buildCommentsSection(article.id);
  document.getElementById('discussionCommentsSection').innerHTML = discussionSection;
  
  // Artigos relacionados
  loadRelatedArticles(article);
}

function updateMetaTags(article) {
  // Título
  document.title = article.title + ' - Quest4Couple Blog';
  
  // URL atual
  var currentURL = window.location.href;
  
  // Meta description
  var descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', article.excerpt);
  
  // Open Graph
  var ogUrl = document.querySelector('meta[property="og:url"]');
  var ogTitle = document.querySelector('meta[property="og:title"]');
  var ogDesc = document.querySelector('meta[property="og:description"]');
  var ogImage = document.querySelector('meta[property="og:image"]');
  
  if (ogUrl) ogUrl.setAttribute('content', currentURL);
  if (ogTitle) ogTitle.setAttribute('content', article.title + ' - Quest4Couple');
  if (ogDesc) ogDesc.setAttribute('content', article.excerpt);
  if (ogImage && article.image) ogImage.setAttribute('content', article.image);
  
  // Twitter
  var twUrl = document.querySelector('meta[property="twitter:url"]');
  var twTitle = document.querySelector('meta[property="twitter:title"]');
  var twDesc = document.querySelector('meta[property="twitter:description"]');
  var twImage = document.querySelector('meta[property="twitter:image"]');
  
  if (twUrl) twUrl.setAttribute('content', currentURL);
  if (twTitle) twTitle.setAttribute('content', article.title + ' - Quest4Couple');
  if (twDesc) twDesc.setAttribute('content', article.excerpt);
  if (twImage && article.image) twImage.setAttribute('content', article.image);
}

function loadRelatedArticles(currentArticle) {
  // Encontrar artigos da mesma categoria
  var related = articlesData.filter(function(a) {
    return a.category === currentArticle.category && a.id !== currentArticle.id;
  }).slice(0, 3);
  
  // Se não houver suficientes, adicionar de outras categorias
  if (related.length < 3) {
    var others = articlesData.filter(function(a) {
      return a.category !== currentArticle.category && a.id !== currentArticle.id;
    }).slice(0, 3 - related.length);
    related = related.concat(others);
  }
  
  var grid = document.getElementById('relatedGrid');
  if (related.length === 0) {
    document.getElementById('relatedArticles').style.display = 'none';
    return;
  }
  
  grid.innerHTML = related.map(function(article) {
    var articleUrl = 'artigo.html?slug=' + (article.slug || article.id);
    return '<a href="' + articleUrl + '" class="related-card">' +
      '<div class="related-image" style="background-image: url(\'' + (article.image || '') + '\')">' +
        '<span class="related-icon">' + article.icon + '</span>' +
      '</div>' +
      '<div class="related-body">' +
        '<span class="related-category">' + article.categoryLabel + '</span>' +
        '<h4>' + article.title + '</h4>' +
        '<span class="related-time">📖 ' + article.readTime + ' min</span>' +
      '</div>' +
    '</a>';
  }).join('');
}

// ================================
// SHARING FUNCTIONS
// ================================
function shareArticle(platform) {
  if (!currentArticle) return;
  
  var url = window.location.href;
  var title = currentArticle.title;
  var text = currentArticle.excerpt;
  
  switch(platform) {
    case 'whatsapp':
      window.open('https://wa.me/?text=' + encodeURIComponent(title + '\n\n' + url), '_blank');
      break;
    case 'facebook':
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
      break;
    case 'twitter':
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url), '_blank');
      break;
    case 'copy':
      copyToClipboard(url);
      break;
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Link copiado! 📋');
    });
  } else {
    // Fallback para browsers antigos
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Link copiado! 📋');
  }
}

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// ================================
// SISTEMA DE DISCUSSÃO E COMENTÁRIOS
// ================================

function buildDiscussionSection(article) {
  return '<div class="discussion-section">' +
    '<div class="discussion-prompt">' +
      '<div class="discussion-icon">💭</div>' +
      '<div class="discussion-content">' +
        '<h4>Vamos discutir!</h4>' +
        '<p>' + article.discussionPrompt + '</p>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function buildCommentsSection(articleId) {
  var comments = getComments(articleId);
  
  var commentsHtml = '';
  if (comments.length > 0) {
    commentsHtml = comments.map(function(c) {
      return renderComment(c, articleId);
    }).join('');
  } else {
    commentsHtml = '<div class="no-comments"><p>Ainda não há comentários. Sê o primeiro a partilhar!</p></div>';
  }
  
  return '<div class="comments-section">' +
    '<h3 class="comments-title">💬 Comentários (' + comments.length + ')</h3>' +
    
    '<div class="comment-form">' +
      '<div class="comment-form-header">' +
        '<input type="text" id="commentAuthor" placeholder="Nome (ou deixa vazio para anónimo)" maxlength="30">' +
      '</div>' +
      '<textarea id="commentText" placeholder="Partilha a tua experiência ou opinião... Os comentários são guardados localmente no teu dispositivo." maxlength="1000" rows="4"></textarea>' +
      '<div class="comment-form-footer">' +
        '<span class="comment-privacy">🔒 Os comentários ficam apenas no teu dispositivo</span>' +
        '<button onclick="submitComment(\'' + articleId + '\')" class="btn-comment">Publicar Comentário</button>' +
      '</div>' +
    '</div>' +
    
    '<div class="comments-list" id="commentsList">' + commentsHtml + '</div>' +
  '</div>';
}

function renderComment(comment, articleId) {
  var date = new Date(comment.timestamp);
  var timeAgo = getTimeAgo(date);
  var authorDisplay = comment.author || 'Anónimo';
  var authorInitial = authorDisplay.charAt(0).toUpperCase();
  var likedClass = comment.liked ? 'liked' : '';
  var heartIcon = comment.liked ? '❤️' : '🤍';
  var likesCount = comment.likes || 0;
  
  var repliesHtml = '';
  if (comment.replies && comment.replies.length > 0) {
    repliesHtml = '<div class="comment-replies">' +
      comment.replies.map(function(r) {
        return renderReply(r, articleId, comment.id);
      }).join('') +
    '</div>';
  }
  
  return '<div class="comment" data-id="' + comment.id + '">' +
    '<div class="comment-avatar">' + authorInitial + '</div>' +
    '<div class="comment-content">' +
      '<div class="comment-header">' +
        '<span class="comment-author">' + authorDisplay + '</span>' +
        '<span class="comment-time">' + timeAgo + '</span>' +
      '</div>' +
      '<p class="comment-text">' + escapeHtml(comment.text) + '</p>' +
      '<div class="comment-actions">' +
        '<button onclick="likeComment(\'' + articleId + '\', \'' + comment.id + '\')" class="btn-like ' + likedClass + '">' +
          heartIcon + ' ' + likesCount +
        '</button>' +
        '<button onclick="replyToComment(\'' + comment.id + '\')" class="btn-reply">↩️ Responder</button>' +
        '<button onclick="deleteComment(\'' + articleId + '\', \'' + comment.id + '\')" class="btn-delete" title="Eliminar">🗑️</button>' +
      '</div>' +
      repliesHtml +
    '</div>' +
  '</div>';
}

function renderReply(reply, articleId, parentId) {
  var date = new Date(reply.timestamp);
  var timeAgo = getTimeAgo(date);
  var authorDisplay = reply.author || 'Anónimo';
  var authorInitial = authorDisplay.charAt(0).toUpperCase();
  
  return '<div class="comment reply" data-id="' + reply.id + '">' +
    '<div class="comment-avatar small">' + authorInitial + '</div>' +
    '<div class="comment-content">' +
      '<div class="comment-header">' +
        '<span class="comment-author">' + authorDisplay + '</span>' +
        '<span class="comment-time">' + timeAgo + '</span>' +
      '</div>' +
      '<p class="comment-text">' + escapeHtml(reply.text) + '</p>' +
      '<div class="comment-actions">' +
        '<button onclick="deleteReply(\'' + articleId + '\', \'' + parentId + '\', \'' + reply.id + '\')" class="btn-delete" title="Eliminar">🗑️</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ================================
// COMMENT ACTIONS
// ================================

function submitComment(articleId) {
  var authorInput = document.getElementById('commentAuthor');
  var textInput = document.getElementById('commentText');
  
  var text = textInput.value.trim();
  if (!text) {
    showToast('Escreve um comentário primeiro! ✍️');
    return;
  }
  
  var comment = {
    id: generateId(),
    author: authorInput.value.trim() || '',
    text: text,
    timestamp: Date.now(),
    likes: 0,
    liked: false,
    replies: []
  };
  
  saveComment(articleId, comment);
  
  // Limpar form
  textInput.value = '';
  
  // Refresh comments
  refreshComments(articleId);
  
  showToast('Comentário publicado! 💬');
}

function likeComment(articleId, commentId) {
  var comments = getComments(articleId);
  var comment = comments.find(function(c) { return c.id === commentId; });
  
  if (comment) {
    if (comment.liked) {
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
      comment.liked = false;
    } else {
      comment.likes = (comment.likes || 0) + 1;
      comment.liked = true;
    }
    saveComments(articleId, comments);
    refreshComments(articleId);
  }
}

function replyToComment(commentId) {
  var commentEl = document.querySelector('.comment[data-id="' + commentId + '"]');
  if (!commentEl) return;
  
  // Verificar se já existe form de resposta
  var existingForm = commentEl.querySelector('.reply-form');
  if (existingForm) {
    existingForm.remove();
    return;
  }
  
  // Criar form de resposta
  var replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  replyForm.innerHTML = 
    '<input type="text" class="reply-author" placeholder="Nome (opcional)" maxlength="30">' +
    '<textarea class="reply-text" placeholder="Escreve a tua resposta..." maxlength="500" rows="2"></textarea>' +
    '<div class="reply-actions">' +
      '<button onclick="cancelReply(this)" class="btn-cancel">Cancelar</button>' +
      '<button onclick="submitReply(\'' + commentId + '\', this)" class="btn-submit-reply">Responder</button>' +
    '</div>';
  
  commentEl.querySelector('.comment-content').appendChild(replyForm);
  replyForm.querySelector('.reply-text').focus();
}

function cancelReply(btn) {
  var form = btn.closest('.reply-form');
  if (form) form.remove();
}

function submitReply(commentId, btn) {
  var form = btn.closest('.reply-form');
  var authorInput = form.querySelector('.reply-author');
  var textInput = form.querySelector('.reply-text');
  
  var text = textInput.value.trim();
  if (!text) {
    showToast('Escreve uma resposta primeiro! ✍️');
    return;
  }
  
  var articleId = currentArticle.id;
  var comments = getComments(articleId);
  var comment = comments.find(function(c) { return c.id === commentId; });
  
  if (comment) {
    if (!comment.replies) comment.replies = [];
    
    comment.replies.push({
      id: generateId(),
      author: authorInput.value.trim() || '',
      text: text,
      timestamp: Date.now()
    });
    
    saveComments(articleId, comments);
    refreshComments(articleId);
    showToast('Resposta publicada! 💬');
  }
}

function deleteComment(articleId, commentId) {
  if (!confirm('Tens a certeza que queres eliminar este comentário?')) return;
  
  var comments = getComments(articleId);
  comments = comments.filter(function(c) { return c.id !== commentId; });
  saveComments(articleId, comments);
  refreshComments(articleId);
  showToast('Comentário eliminado 🗑️');
}

function deleteReply(articleId, commentId, replyId) {
  if (!confirm('Tens a certeza que queres eliminar esta resposta?')) return;
  
  var comments = getComments(articleId);
  var comment = comments.find(function(c) { return c.id === commentId; });
  
  if (comment && comment.replies) {
    comment.replies = comment.replies.filter(function(r) { return r.id !== replyId; });
    saveComments(articleId, comments);
    refreshComments(articleId);
    showToast('Resposta eliminada 🗑️');
  }
}

function refreshComments(articleId) {
  var container = document.getElementById('discussionCommentsSection');
  if (!container || !currentArticle) return;
  
  var discussionSection = '';
  if (currentArticle.discussionPrompt) {
    discussionSection = buildDiscussionSection(currentArticle);
  }
  discussionSection += buildCommentsSection(articleId);
  container.innerHTML = discussionSection;
}

// ================================
// LOCAL STORAGE
// ================================

function getComments(articleId) {
  try {
    var key = 'q4c_comments_' + articleId;
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function saveComments(articleId, comments) {
  try {
    var key = 'q4c_comments_' + articleId;
    localStorage.setItem(key, JSON.stringify(comments));
  } catch(e) {
    console.warn('Erro ao guardar comentários:', e);
  }
}

function saveComment(articleId, comment) {
  var comments = getComments(articleId);
  comments.unshift(comment);
  saveComments(articleId, comments);
}

function getCommentCount(articleId) {
  var comments = getComments(articleId);
  var count = comments.length;
  comments.forEach(function(c) {
    if (c.replies) count += c.replies.length;
  });
  return count;
}

// ================================
// UTILITIES
// ================================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getTimeAgo(date) {
  var now = new Date();
  var diff = now - date;
  var seconds = Math.floor(diff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var weeks = Math.floor(days / 7);
  var months = Math.floor(days / 30);
  
  if (months > 0) return 'há ' + months + (months === 1 ? ' mês' : ' meses');
  if (weeks > 0) return 'há ' + weeks + (weeks === 1 ? ' semana' : ' semanas');
  if (days > 0) return 'há ' + days + (days === 1 ? ' dia' : ' dias');
  if (hours > 0) return 'há ' + hours + (hours === 1 ? ' hora' : ' horas');
  if (minutes > 0) return 'há ' + minutes + (minutes === 1 ? ' minuto' : ' minutos');
  return 'agora mesmo';
}
