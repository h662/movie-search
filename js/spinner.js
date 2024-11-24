// Spinner DOM 요소
const loadingSpinner = document.getElementById("loading-spinner");

// 스피너 표시
export function showSpinner() {
  loadingSpinner.style.display = "flex";
}

// 스피너 숨기기
export function hideSpinner() {
  loadingSpinner.style.display = "none";
}
