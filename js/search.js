// Import API configuration
import { API_URL } from "./config.js";
import { showSpinner, hideSpinner } from "./spinner.js";

// DOM 요소 선택
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const favoritesContainer = document.getElementById("favorites-container");

// 즐겨찾기 배열 (Local Storage에서 로드)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 영화 검색 함수
async function searchMovies(query) {
  try {
    showSpinner(); // 스피너 표시
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();
    hideSpinner(); // 스피너 숨김

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      moviesContainer.innerHTML = `<p>No results found.</p>`;
    }
  } catch (error) {
    hideSpinner(); // 스피너 숨김
    console.error("Error fetching movies:", error);
    moviesContainer.innerHTML = `<p>Error fetching movies. Please try again.</p>`;
  }
}

// 영화 카드 렌더링 함수
function displayMovies(movies) {
  moviesContainer.innerHTML = ""; // 이전 검색 결과 초기화

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
            <img src="${
              movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"
            }" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <button class="favorite-btn">${
              favorites.includes(movie.imdbID)
                ? "Remove from Favorites"
                : "Add to Favorites"
            }</button>
        `;

    // 영화 카드 클릭 이벤트: 상세 페이지로 이동
    movieCard.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-btn")) {
        toggleFavorite(movie.imdbID, movie.Title);
        e.stopPropagation(); // 즐겨찾기 버튼 클릭 시 상세 페이지 이동 방지
      } else {
        window.location.href = `movie-details.html?id=${movie.imdbID}`;
      }
    });

    moviesContainer.appendChild(movieCard);
  });
}

// 즐겨찾기 추가/삭제 함수
function toggleFavorite(id, title) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  updateFavorites();
}

// 즐겨찾기 섹션 업데이트 함수
async function updateFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  favoritesContainer.innerHTML = ""; // 초기화

  for (const id of favorites) {
    const movie = await fetchMovieById(id);
    const favoriteCard = document.createElement("div");
    favoriteCard.className = "movie-card";
    favoriteCard.innerHTML = `
            <img src="${
              movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"
            }" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <button class="remove-btn">Remove</button>
        `;

    // 영화 카드 클릭 이벤트: 상세 페이지로 이동
    favoriteCard.addEventListener("click", () => {
      window.location.href = `movie-details.html?id=${movie.imdbID}`;
    });

    // Remove 버튼 클릭 이벤트
    favoriteCard.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // 상세 페이지로 이동 방지
      toggleFavorite(id, movie.Title);
    });

    favoritesContainer.appendChild(favoriteCard);
  }
}

// 영화 ID로 단일 영화 데이터 가져오기
async function fetchMovieById(id) {
  try {
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// 검색 버튼 클릭 이벤트
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// 페이지 로드 시 즐겨찾기 초기화
updateFavorites();
