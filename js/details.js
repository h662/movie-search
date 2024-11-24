// Import API configuration
import { API_URL } from "./config.js";
import { showSpinner, hideSpinner } from "./spinner.js";

// DOM 요소 선택
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieOverview = document.getElementById("movie-overview");
const movieRating = document.getElementById("movie-rating");
const movieActors = document.getElementById("movie-actors");

// URL에서 영화 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// 영화 상세 정보 가져오기
async function fetchMovieDetails(id) {
  try {
    showSpinner(); // 스피너 표시
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();
    hideSpinner(); // 스피너 숨김

    if (data.Response === "True") {
      displayMovieDetails(data);
    } else {
      console.error("Error fetching movie details:", data.Error);
    }
  } catch (error) {
    hideSpinner(); // 스피너 숨김
    console.error("Error fetching movie details:", error);
  }
}

// 상세 정보 렌더링 함수
function displayMovieDetails(movie) {
  moviePoster.src =
    movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png";
  movieTitle.textContent = movie.Title;
  movieOverview.textContent = movie.Plot || "No overview available.";
  movieRating.textContent =
    movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "N/A";
  movieActors.textContent = movie.Actors || "No actors listed.";
}

// 페이지 로드 시 영화 상세 정보 가져오기
if (movieId) {
  fetchMovieDetails(movieId);
}
