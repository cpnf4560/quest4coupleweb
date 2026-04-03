/**
 * Quest4Couple - Blog Listing Page
 * Lista de artigos com filtros por categoria
 */

// ================================
// STATE
// ================================
var currentArticleCategory = 'all';

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', function() {
  initFilters();
  loadArticles();
  initMobileMenu();
});

function initMobileMenu() {
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var nav = document.querySelector('.nav');
  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
      mobileBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });
  }
}

function initFilters() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var category = btn.dataset.category;
      filterArticles(category);
    });
  });
}

function loadArticles() {
  var grid = document.getElementById('articlesGrid');
  if (!grid) return;
  
  var filtered = currentArticleCategory === 'all' 
    ? articlesData.slice() 
    : articlesData.filter(function(a) { return a.category === currentArticleCategory; });
  
  // Ordenar por campo 'order' (menor primeiro)
  filtered.sort(function(a, b) { return (a.order || 999) - (b.order || 999); });
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-articles"><p>Nenhum post encontrado nesta categoria.</p></div>';
    return;
  }
    grid.innerHTML = filtered.map(function(article) {
    var hasImage = article.image && article.image.length > 0;
    var imageStyle = hasImage ? "background-image: url('" + article.image + "')" : '';
    var imageClass = hasImage ? 'article-image has-image' : 'article-image';
    var commentCount = getCommentCount(article.id);
    var commentText = commentCount !== 1 ? 'comentários' : 'comentário';
    
    // Usar slug para URL amigável, fallback para id
    var articleSlug = article.slug || article.id;
    var articleUrl = 'artigo.html?slug=' + articleSlug;
    
    return '<a href="' + articleUrl + '" class="article-card">' +
      '<div class="' + imageClass + '" style="' + imageStyle + '">' +
        (hasImage ? '<span class="article-icon">' + article.icon + '</span>' : article.icon) +
      '</div>' +
      '<div class="article-body">' +
        '<span class="article-category">' + article.categoryLabel + '</span>' +
        '<h3 class="article-title">' + article.title + '</h3>' +
        '<p class="article-excerpt">' + article.excerpt + '</p>' +
        '<div class="article-meta">' +
          '<span>📖 ' + article.readTime + ' min</span>' +
          '<span>💬 ' + commentCount + ' ' + commentText + '</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }).join('');
}

function filterArticles(category) {
  currentArticleCategory = category;
  
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  
  loadArticles();
}

// ================================
// LOCAL STORAGE - Comment Count
// ================================
function getCommentCount(articleId) {
  try {
    var key = 'q4c_comments_' + articleId;
    var stored = localStorage.getItem(key);
    if (!stored) return 0;
    
    var comments = JSON.parse(stored);
    var count = comments.length;
    
    // Contar também as respostas
    comments.forEach(function(c) {
      if (c.replies) count += c.replies.length;
    });
    
    return count;
  } catch(e) {
    return 0;
  }
}
