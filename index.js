let movieArr = [];
const movieListContainer = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        getMovieList(searchTerm);
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        const searchTerm = searchInput.value;
        if (searchTerm) {
            getMovieList(searchTerm);
        }
    }
});

async function getMovieList(searchTerm) {
    const apiKey = "b5dca599";
    try {
        const res = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.Response === "True" && data.Search.length > 0) {
            movieArr = data.Search;
            displayMovies(movieArr);
        } else {
            console.log("Error:", data.Error);
            movieListContainer.innerHTML = `<p class="no-results">${data.Error || "No movies found."}</p>`;
            movieArr = [];
        }
    } catch (error) {
        console.error("Fetch or processing error:", error);
        movieListContainer.innerHTML = `<p class="error-message">An error occurred: ${error.message}</p>`;
        movieArr = [];
    }
}

function displayMovies(movies) {
    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const posterSrc = movie.Poster === "N/A" 
            ? "https://via.placeholder.com/120x180.png?text=No+Poster" 
            : movie.Poster;

        movieCard.innerHTML = `
            <img id="movie-poster-${movie.imdbID}" src="${posterSrc}" alt="${movie.Title} poster">
            <div id="movie-details-${movie.imdbID}" class="movie-details">
                <div class="movie-header">
                    <h2 id="movie-title-${movie.imdbID}">${movie.Title}</h2>
                    <span id="movie-rating-${movie.imdbID}" class="rating">N/A</span>
                </div>
                <div class="movie-meta">
                    <span id="runtime-${movie.imdbID}" class="runtime">N/A</span>
                    <span id="genre-${movie.imdbID}" class="genres">N/A</span>
                    <button id="watchlist-btn-${movie.imdbID}" class="watchlist-btn" data-imdbid="${movie.imdbID}">+ Watchlist</button>
                </div>
                <p id="movie-descrip-${movie.imdbID}" class="movie-description">Full details not available.</p>
            </div>
        `;
        
        movieListContainer.appendChild(movieCard);
        
        getMovieDetails(movie.imdbID, movieCard);
    });
}

async function getMovieDetails(imdbID, movieCardElement) {
    const apiKey = "b5dca599";
    try {
        const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
        const data = await res.json();

        if (data.Response === "True") {
            const movieRatingElement = movieCardElement.querySelector('.rating');
            const runtimeElement = movieCardElement.querySelector('.runtime');
            const genreElement = movieCardElement.querySelector('.genres');
            const movieDescripElement = movieCardElement.querySelector('.movie-description');
            const watchlistBtn = movieCardElement.querySelector('.watchlist-btn');

            movieRatingElement.textContent = data.imdbRating === "N/A" ? 'N/A' : `${data.imdbRating} ⭐`;
            runtimeElement.textContent = data.Runtime === "N/A" ? 'N/A' : data.Runtime;
            genreElement.textContent = data.Genre === "N/A" ? 'N/A' : data.Genre;
            movieDescripElement.textContent = data.Plot === "N/A" ? 'Plot not available.' : data.Plot;

            watchlistBtn.addEventListener('click', () => {
                addToWatchlist(data);
            });
        } else {
            console.warn(`Could not fetch full details for ${imdbID}: ${data.Error}`);
        }
    } catch (error) {
        console.error(`Error fetching details for ${imdbID}:`, error);
    }
}

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.some(item => item.imdbID === movie.imdbID)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movie.Title} added to your watchlist!`);
    } else {
        alert(`${movie.Title} is already in your watchlist!`);
    }
}
