document.addEventListener('DOMContentLoaded', () => {
    const watchlistList = document.getElementById("watchlist-list");
    
    function renderWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        
        // Clear the current list
        watchlistList.innerHTML = '';
        
        if (watchlist.length === 0) {
            watchlistList.innerHTML = `<p class="no-results">Your watchlist is empty. Add some movies!</p>`;
            return;
        }
        
        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            const posterSrc = movie.Poster === "N/A" 
                ? "https://via.placeholder.com/120x180.png?text=No+Poster" 
                : movie.Poster;
            
            movieCard.innerHTML = `
                <img src="${posterSrc}" alt="${movie.Title} poster">
                <div class="movie-details">
                    <div class="movie-header">
                        <h2>${movie.Title} (${movie.Year})</h2>
                        <span class="rating">${movie.imdbRating ? movie.imdbRating + ' ⭐' : 'N/A'}</span>
                    </div>
                    <div class="movie-meta">
                        <span class="runtime">${movie.Runtime || 'N/A'}</span>
                        <span class="genres">${movie.Genre || 'N/A'}</span>
                        <button class="remove-btn" data-imdbid="${movie.imdbID}">- Remove</button>
                    </div>
                    <p class="movie-description">${movie.Plot || 'Plot not available.'}</p>
                </div>
            `;
            
            watchlistList.appendChild(movieCard);
            
            // Add a click listener for the remove button
            const removeBtn = movieCard.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => removeFromWatchlist(movie.imdbID));
        });
    }

    function removeFromWatchlist(imdbID) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        
        // Re-render the list after removing a movie
        renderWatchlist();
    }
    
    // Initial call to render the watchlist when the page loads
    renderWatchlist();
});
