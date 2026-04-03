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
  
  // Conteúdo principal - inserir primeiro sem curiosidades
  document.getElementById('articleContent').innerHTML = article.content;
  
  // Carregar estatísticas e inserir curiosidades (async)
  loadAndInsertCuriosities(article.id);
  
  // Discussão e Comentários
  var discussionSection = '';
  if (article.discussionPrompt) {
    discussionSection = buildDiscussionSection(article);
  }  
  discussionSection += buildCommentsSection(article.id);
  document.getElementById('discussionCommentsSection').innerHTML = discussionSection;
  
  // Carregar comentários do Firebase (async)
  loadFirebaseComments(article.id);
  
  // Artigos relacionados
  loadRelatedArticles(article);
}

/**
 * Carrega estatísticas do Firebase e insere curiosidades no artigo
 */
async function loadAndInsertCuriosities(articleId) {
  // Verificar se o sistema de estatísticas está disponível
  if (!window.articleStatistics) {
    console.log('📊 Sistema de estatísticas não disponível');
    return;
  }
  
  // Verificar se há mapeamento para este artigo
  if (!window.articleStatistics.articleQuestionMapping[articleId]) {
    console.log('📊 Artigo sem mapeamento de estatísticas:', articleId);
    return;
  }
  
  try {
    // Tentar carregar do cache público do Firebase
    let analyticsData = [];
    
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const db = firebase.firestore();
      const cacheDoc = await db.collection('publicStatistics').doc('questionAnalytics').get();
      
      if (cacheDoc.exists) {
        const data = cacheDoc.data();
        analyticsData = data.questions || [];
        console.log('📊 Estatísticas carregadas:', analyticsData.length, 'questões');
      }
    }
    
    if (analyticsData.length === 0) {
      console.log('📊 Sem dados de estatísticas disponíveis');
      return;
    }
    
    // Gerar curiosidades
    const curiosities = window.articleStatistics.generateArticleCuriosities(articleId, analyticsData);
    
    if (curiosities.length === 0) {
      console.log('📊 Nenhuma curiosidade gerada para:', articleId);
      return;
    }
    
    console.log('📊 Curiosidades geradas:', curiosities.length);
    
    // Inserir curiosidades no conteúdo
    insertCuriositiesIntoDOM(curiosities);
    
  } catch (error) {
    console.error('📊 Erro ao carregar estatísticas:', error);
  }
}

/**
 * Insere curiosidades no DOM do artigo
 */
function insertCuriositiesIntoDOM(curiosities) {
  const contentEl = document.getElementById('articleContent');
  if (!contentEl || curiosities.length === 0) return;
  
  // Encontrar pontos de inserção (após h3 ou h4 seguidos de parágrafos)
  const headings = contentEl.querySelectorAll('h3, h4');
  
  if (headings.length === 0) {
    // Sem headings, adicionar no final
    curiosities.forEach(c => {
      const div = document.createElement('div');
      div.innerHTML = c.html;
      contentEl.appendChild(div.firstElementChild || div);
    });
    return;
  }
  
  // Distribuir curiosidades pelo artigo
  const insertionPoints = Math.min(curiosities.length, Math.floor(headings.length / 2));
  const step = Math.max(2, Math.floor(headings.length / (insertionPoints + 1)));
  
  let curiosityIndex = 0;
  
  for (let i = step; i < headings.length && curiosityIndex < curiosities.length; i += step) {
    const heading = headings[i];
    
    // Encontrar o próximo elemento após o heading para inserir depois
    let insertAfter = heading.nextElementSibling;
    
    // Pular até encontrar um parágrafo, lista ou div
    let attempts = 0;
    while (insertAfter && !['P', 'DIV', 'UL', 'OL'].includes(insertAfter.tagName) && attempts < 5) {
      insertAfter = insertAfter.nextElementSibling;
      attempts++;
    }
    
    if (insertAfter) {
      const div = document.createElement('div');
      div.innerHTML = curiosities[curiosityIndex].html;
      const curiosityEl = div.firstElementChild || div;
      
      // Inserir após o elemento encontrado
      if (insertAfter.nextSibling) {
        insertAfter.parentNode.insertBefore(curiosityEl, insertAfter.nextSibling);
      } else {
        insertAfter.parentNode.appendChild(curiosityEl);
      }
      
      curiosityIndex++;
    }
  }
  
  // Se ainda há curiosidades, adicionar no final
  while (curiosityIndex < curiosities.length) {
    const div = document.createElement('div');
    div.innerHTML = curiosities[curiosityIndex].html;
    contentEl.appendChild(div.firstElementChild || div);
    curiosityIndex++;
  }
  
  console.log('📊 Curiosidades inseridas no DOM');
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
    case 'instagram':
      // Instagram não permite partilha direta via URL, copia o link e avisa o utilizador
      copyToClipboard(url);
      showToast('Link copiado! Cola nos Stories ou DM do Instagram 📸');
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
  return '<div class="comments-section">' +
    '<h3 class="comments-title">💬 Comentários <span id="commentsCount"></span></h3>' +
    
    '<div class="comment-form">' +
      '<div class="comment-form-header">' +
        '<input type="text" id="commentAuthor" placeholder="Nome (ou deixa vazio para anónimo)" maxlength="30">' +
      '</div>' +
      '<textarea id="commentText" placeholder="Partilha a tua experiência ou opinião..." maxlength="1000" rows="4"></textarea>' +
      '<div class="comment-form-footer">' +
        '<span class="comment-privacy">🌐 Os comentários são públicos e visíveis por todos</span>' +
        '<button onclick="submitComment(\'' + articleId + '\')" class="btn-comment">Publicar Comentário</button>' +
      '</div>' +
    '</div>' +
    
    '<div class="comments-list" id="commentsList">' +
      '<div class="comments-loading" style="text-align:center; padding:20px; color:#6c757d;">' +
        '<p>A carregar comentários...</p>' +
      '</div>' +
    '</div>' +
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
// COMMENT ACTIONS (FIREBASE PUBLIC)
// ================================

async function submitComment(articleId) {
  var authorInput = document.getElementById('commentAuthor');
  var textInput = document.getElementById('commentText');
  
  var text = textInput.value.trim();
  if (!text) {
    showToast('Escreve um comentário primeiro! ✍️');
    return;
  }
  
  var comment = {
    author: authorInput.value.trim() || 'Anónimo',
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    likes: 0,
    likedBy: [],
    replies: []
  };
  
  try {
    var db = firebase.firestore();
    await db.collection('blog_comments').doc(articleId).collection('comments').add(comment);
    
    // Limpar form
    textInput.value = '';
    
    // Refresh comments
    loadFirebaseComments(articleId);
    
    showToast('Comentário publicado! 💬');
  } catch (error) {
    console.error('Erro ao publicar comentário:', error);
    // Fallback para localStorage
    comment.id = generateId();
    comment.timestamp = Date.now();
    saveComment(articleId, comment);
    refreshCommentsFromLocal(articleId);
    showToast('Comentário guardado localmente 💬');
  }
}

async function likeComment(articleId, commentId) {
  try {
    var db = firebase.firestore();
    var docRef = db.collection('blog_comments').doc(articleId).collection('comments').doc(commentId);
    var doc = await docRef.get();
    
    if (doc.exists) {
      var data = doc.data();
      var visitorId = getVisitorId();
      var likedBy = data.likedBy || [];
      
      if (likedBy.includes(visitorId)) {
        // Unlike
        await docRef.update({
          likes: firebase.firestore.FieldValue.increment(-1),
          likedBy: firebase.firestore.FieldValue.arrayRemove(visitorId)
        });
      } else {
        // Like
        await docRef.update({
          likes: firebase.firestore.FieldValue.increment(1),
          likedBy: firebase.firestore.FieldValue.arrayUnion(visitorId)
        });
      }
      
      loadFirebaseComments(articleId);
    }
  } catch (error) {
    console.error('Erro ao dar like:', error);
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

async function submitReply(commentId, btn) {
  var form = btn.closest('.reply-form');
  var authorInput = form.querySelector('.reply-author');
  var textInput = form.querySelector('.reply-text');
  
  var text = textInput.value.trim();
  if (!text) {
    showToast('Escreve uma resposta primeiro! ✍️');
    return;
  }
  
  var articleId = currentArticle.id;
  
  try {
    var db = firebase.firestore();
    var docRef = db.collection('blog_comments').doc(articleId).collection('comments').doc(commentId);
    
    var reply = {
      id: generateId(),
      author: authorInput.value.trim() || 'Anónimo',
      text: text,
      timestamp: Date.now()
    };
    
    await docRef.update({
      replies: firebase.firestore.FieldValue.arrayUnion(reply)
    });
    
    loadFirebaseComments(articleId);
    showToast('Resposta publicada! 💬');
  } catch (error) {
    console.error('Erro ao responder:', error);
    showToast('Erro ao publicar resposta ❌');
  }
}

async function deleteComment(articleId, commentId) {
  if (!confirm('Tens a certeza que queres eliminar este comentário?')) return;
  
  try {
    var db = firebase.firestore();
    await db.collection('blog_comments').doc(articleId).collection('comments').doc(commentId).delete();
    loadFirebaseComments(articleId);
    showToast('Comentário eliminado 🗑️');
  } catch (error) {
    console.error('Erro ao eliminar:', error);
    showToast('Sem permissão para eliminar ❌');
  }
}

async function deleteReply(articleId, commentId, replyId) {
  if (!confirm('Tens a certeza que queres eliminar esta resposta?')) return;
  
  try {
    var db = firebase.firestore();
    var docRef = db.collection('blog_comments').doc(articleId).collection('comments').doc(commentId);
    var doc = await docRef.get();
    
    if (doc.exists) {
      var data = doc.data();
      var updatedReplies = (data.replies || []).filter(function(r) { return r.id !== replyId; });
      await docRef.update({ replies: updatedReplies });
      loadFirebaseComments(articleId);
      showToast('Resposta eliminada 🗑️');
    }
  } catch (error) {
    console.error('Erro ao eliminar resposta:', error);
    showToast('Sem permissão para eliminar ❌');
  }
}

// ================================
// LOAD FIREBASE COMMENTS
// ================================

async function loadFirebaseComments(articleId) {
  var listEl = document.getElementById('commentsList');
  var countEl = document.getElementById('commentsCount');
  if (!listEl) return;
  
  try {
    var db = firebase.firestore();
    var snapshot = await db.collection('blog_comments').doc(articleId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    var comments = [];
    snapshot.forEach(function(doc) {
      comments.push({ id: doc.id, ...doc.data() });
    });
    
    // Also merge localStorage comments (migrate)
    var localComments = getComments(articleId);
    if (localComments.length > 0) {
      // Migrate local comments to Firebase (one time)
      for (var lc of localComments) {
        try {
          await db.collection('blog_comments').doc(articleId).collection('comments').add({
            author: lc.author || 'Anónimo',
            text: lc.text,
            timestamp: firebase.firestore.Timestamp.fromMillis(lc.timestamp),
            likes: lc.likes || 0,
            likedBy: [],
            replies: (lc.replies || []).map(function(r) {
              return { id: r.id, author: r.author || 'Anónimo', text: r.text, timestamp: r.timestamp };
            })
          });
        } catch(e) { /* ignore migration errors */ }
      }
      // Clear local storage after migration
      localStorage.removeItem('q4c_comments_' + articleId);
      
      // Reload from Firebase
      var freshSnapshot = await db.collection('blog_comments').doc(articleId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();
      comments = [];
      freshSnapshot.forEach(function(doc) {
        comments.push({ id: doc.id, ...doc.data() });
      });
    }
    
    // Count total
    var totalCount = comments.length;
    comments.forEach(function(c) {
      totalCount += (c.replies || []).length;
    });
    
    if (countEl) countEl.textContent = '(' + totalCount + ')';
    
    if (comments.length === 0) {
      listEl.innerHTML = '<div class="no-comments"><p>Ainda não há comentários. Sê o primeiro a partilhar!</p></div>';
      return;
    }
    
    var visitorId = getVisitorId();
    listEl.innerHTML = comments.map(function(c) {
      return renderFirebaseComment(c, articleId, visitorId);
    }).join('');
    
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
    // Fallback to localStorage
    refreshCommentsFromLocal(articleId);
  }
}

function renderFirebaseComment(comment, articleId, visitorId) {
  var timestamp = comment.timestamp;
  var date;
  if (timestamp && timestamp.toDate) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    date = new Date();
  }
  
  var timeAgo = getTimeAgo(date);
  var authorDisplay = comment.author || 'Anónimo';
  var authorInitial = authorDisplay.charAt(0).toUpperCase();
  var likedBy = comment.likedBy || [];
  var isLiked = likedBy.includes(visitorId);
  var likedClass = isLiked ? 'liked' : '';
  var heartIcon = isLiked ? '❤️' : '🤍';
  var likesCount = comment.likes || 0;
  
  var repliesHtml = '';
  if (comment.replies && comment.replies.length > 0) {
    repliesHtml = '<div class="comment-replies">' +
      comment.replies.map(function(r) {
        return renderFirebaseReply(r, articleId, comment.id);
      }).join('') +
    '</div>';
  }
  
  return '<div class="comment" data-id="' + comment.id + '">' +
    '<div class="comment-avatar">' + authorInitial + '</div>' +
    '<div class="comment-content">' +
      '<div class="comment-header">' +
        '<span class="comment-author">' + escapeHtml(authorDisplay) + '</span>' +
        '<span class="comment-time">' + timeAgo + '</span>' +
      '</div>' +
      '<p class="comment-text">' + escapeHtml(comment.text) + '</p>' +
      '<div class="comment-actions">' +
        '<button onclick="likeComment(\'' + articleId + '\', \'' + comment.id + '\')" class="btn-like ' + likedClass + '">' +
          heartIcon + ' ' + likesCount +
        '</button>' +
        '<button onclick="replyToComment(\'' + comment.id + '\')" class="btn-reply">↩️ Responder</button>' +
      '</div>' +
      repliesHtml +
    '</div>' +
  '</div>';
}

function renderFirebaseReply(reply, articleId, parentId) {
  var date = typeof reply.timestamp === 'number' ? new Date(reply.timestamp) : new Date();
  var timeAgo = getTimeAgo(date);
  var authorDisplay = reply.author || 'Anónimo';
  var authorInitial = authorDisplay.charAt(0).toUpperCase();
  
  return '<div class="comment reply" data-id="' + reply.id + '">' +
    '<div class="comment-avatar small">' + authorInitial + '</div>' +
    '<div class="comment-content">' +
      '<div class="comment-header">' +
        '<span class="comment-author">' + escapeHtml(authorDisplay) + '</span>' +
        '<span class="comment-time">' + timeAgo + '</span>' +
      '</div>' +
      '<p class="comment-text">' + escapeHtml(reply.text) + '</p>' +
    '</div>' +
  '</div>';
}

function refreshCommentsFromLocal(articleId) {
  var listEl = document.getElementById('commentsList');
  var countEl = document.getElementById('commentsCount');
  if (!listEl) return;
  
  var comments = getComments(articleId);
  
  if (countEl) countEl.textContent = '(' + comments.length + ')';
  
  if (comments.length === 0) {
    listEl.innerHTML = '<div class="no-comments"><p>Ainda não há comentários. Sê o primeiro a partilhar!</p></div>';
    return;
  }
  
  listEl.innerHTML = comments.map(function(c) {
    return renderComment(c, articleId);
  }).join('');
}

function refreshComments(articleId) {
  loadFirebaseComments(articleId);
}

// ================================
// VISITOR ID (anónimo mas persistente)
// ================================

function getVisitorId() {
  var id = localStorage.getItem('q4c_visitor_id');
  if (!id) {
    id = 'v_' + generateId();
    localStorage.setItem('q4c_visitor_id', id);
  }
  return id;
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
