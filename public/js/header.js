const nav = document.querySelector(".heeader"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn");
const links = document.querySelector(".nav-links");

navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("bx-x", "bx-search");
  const liElements = links.querySelectorAll("a");

  // Iterate through the li elements and change their color to white
  liElements.forEach((li) => {
    li.style.color = "white";
  });
});
navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});

const search = document.querySelector(".search");
const clear = document.querySelector(".clear");
search.onclick = function () {
  document.querySelector(".searchcon").classList.toggle("active");
};

clear.onclick = function () {
  document.getElementById("search").value = "";
};
