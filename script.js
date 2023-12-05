console.log('====================================');
console.log("Connected");
console.log('====================================');
// Fetch data from the API
let products; 

async function fetchData() {
   const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
const responseData = await response.json();

console.log('Fetched data:', responseData);

if (Array.isArray(responseData.data)) {
  return responseData.data;
} else {
  console.error('Invalid data structure. Expected an array of products.');
  return [];
}
}


// Function to create a grid card
function createGridCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card grid-card';

  // Check if 'variants' property exists
  const variantsText = Array.isArray(product.variants) ? product.variants.join(', ') : 'No variants';

  card.innerHTML = `
    <img src="${product.product_image}" alt="${product.product_title}" class="product-image">
    <div class="product-details">
      <h3>${product.product_title}</h3>
      <p class="variants">${variantsText}</p>
      <span class="badge">${product.product_badge}</span>
    </div>
  `;

  return card;
}

// Function to create a list card
function createListCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card list-card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="product-image">
    <div class="product-details">
      <h3>${product.title}</h3>
      <p class="variants">${product.variants.join(', ')}</p>
      <span class="badge">${product.badge}</span>
    </div>
  `;
  return card;
}

// Render product cards based on the layout
function renderProducts(products, layout) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';

  if (Array.isArray(products)) {
    products.forEach(product => {
      const card = layout === 'grid' ? createGridCard(product) : createListCard(product);
      container.appendChild(card);
    });
  } else {
    console.error('Invalid data structure. Expected an array of products.');
  }

  container.className = layout + '-view';
}


// Highlight matching variants based on search input
function highlightSearchTerm() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Get all product cards
  const productCards = document.querySelectorAll('.product-card');

  // Loop through each product card and highlight matching substrings
  productCards.forEach(productCard => {
    const titleElement = productCard.querySelector('.product-title');
    const variantsElement = productCard.querySelector('.variants');

    if (titleElement) {
      const titleText = titleElement.textContent.toLowerCase();
      const highlightedTitle = titleText.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
      titleElement.innerHTML = highlightedTitle;
    }

    if (variantsElement) {
      const variantsText = variantsElement.textContent.toLowerCase();
      const highlightedVariants = variantsText.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
      variantsElement.innerHTML = highlightedVariants;
    }
  });
}
// Function to filter and display products based on search term
function searchProducts() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Check if the search term is empty
  if (searchTerm === '') {
    console.log('Search term is empty. Skipping fetch and filter.');
    return;
  }

  fetchDataBySearchTerm(searchTerm);
}


// Function to switch between grid and list view
function switchLayout(layout) {
  const productContainer = document.getElementById('productContainer');

  if (layout === 'grid') {
    productContainer.classList.remove('list-view');
    productContainer.classList.add('grid-view');
  } else if (layout === 'list') {
    productContainer.classList.remove('grid-view');
    productContainer.classList.add('list-view');
  }
}

// Initial setup

document.addEventListener('DOMContentLoaded', async () => {
  products = await fetchData();
  renderProducts(products, 'grid');

  
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    highlightSearchTerm();
    searchProducts();
});
});