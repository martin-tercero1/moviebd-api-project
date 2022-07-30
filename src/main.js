const API_KEY = "8f5542b6988efb226030efa69a3226e7";

const API = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

// Utils
function fetchAndAppendContainers(moviesArray, container) {
  container.innerHTML = "";
  moviesArray.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );

    movieContainer.appendChild(movieImg);

    container.appendChild(movieContainer);
  });
}

function fetchAndCreateCategories(categoriesArray, container) {
  container.innerHTML = "";

  categoriesArray.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);

    categoryContainer.appendChild(categoryTitle);

    container.appendChild(categoryContainer);
  });
}

// Fetchs to the API

async function getTrendingMoviesPreview() {
  const { data } = await API("trending/movie/day");
  const movies = data.results;

  fetchAndAppendContainers(movies, trendingMoviesPreviewList);
}

async function getCategoriesMoviesPreview() {
  const { data } = await API("genre/movie/list");
  const categories = data.genres;

  fetchAndCreateCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await API("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  fetchAndAppendContainers(movies, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await API("search/movie", {
    params: {
      query: query,
    },
  });
  const movies = data.results;

  fetchAndAppendContainers(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await API("trending/movie/day");
  const movies = data.results;

  fetchAndAppendContainers(movies, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await API(`movie/${id}`);

  const movieImageURL = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

  //   headerSection.style.background = `
  //   linear-gradient(
  //     180deg,
  //     rgba(0, 0, 0, 0.35) 19.27%,
  //     rgba(0, 0, 0, 0) 29.17%
  //     )`;

  headerImage.style.background = `
   linear-gradient(
     180deg,
     rgba(0, 0, 0, 0.35) 19.27%,
     rgba(0, 0, 0, 0) 29.17%
     ),
    url(${movieImageURL})
    `;

  //   headerSection.style.backgroundPosition = "center";
  headerSection.style.backgroundRepeat = "no-repeat";
  headerSection.style.backgroundSize = "contain";

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  fetchAndCreateCategories(movie.genres, movieDetailCategoriesList);
  getSimilarMoviesById(id);
}

async function getSimilarMoviesById(id) {
  const { data } = await API(`movie/${id}/similar`);
  const relatedMovies = data.results;

  fetchAndAppendContainers(relatedMovies, relatedMoviesContainer);
}
