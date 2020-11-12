const auth = '563492ad6f9170000100000104b292095446462a9576a5e615947bde';
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const submitButton = document.querySelector('.submit-button');
let searchValue;
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let currentSearch;

//event listeners

searchInput.addEventListener('input', updateInput);

form.addEventListener('submit', (e) => {
	e.preventDefault();
	currentSearch = searchValue;
	searchPhotos(searchValue);
});

more.addEventListener('click', loadMore);

//functions

function updateInput(e) {
	searchValue = e.target.value;
}

async function fetchApi(url) {
	const dataFetch = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: auth,
		},
	});
	const data = await dataFetch.json();
	return data;
}

function generatePictures(data) {
	data.photos.forEach((photo) => {
		const galleryImage = document.createElement('div');
		galleryImage.classList.add('gallery-image');
		galleryImage.innerHTML = `
			  <div class="gallery-info">
			  <p>Photographer: ${photo.photographer}</p>
			  <a href=${photo.src.original}>Download</a>
			  </div>
			  <img src=${photo.src.large}></img>
			  `;
		gallery.appendChild(galleryImage);
	});
}

async function curatedPhotos() {
	fetchLink = 'https://api.pexels.com/v1/curated?per_page=15&page=1';
	const data = await fetchApi(fetchLink);
	generatePictures(data);
}

async function searchPhotos(query) {
	clear();
	fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
	const data = await fetchApi(fetchLink);
	generatePictures(data);
}

function clear() {
	gallery.innerHTML = '';
	searchInput.value = '';
}

async function loadMore() {
	page++;
	if (currentSearch) {
		fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
	} else {
		fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
	}
	const data = await fetchApi(fetchLink);
	generatePictures(data);
}

curatedPhotos();
