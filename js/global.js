let initial = document.getElementById("initial");
let favoritos = document.getElementById("favoritos");
let container = document.getElementById("gifs");
let containerSearchResults = document.getElementById("search-results");
let noFavorites = document.getElementById("no-favorites");
let containerFavorites = document.getElementById("favorites");
const URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
const API_KEY = "CqzSXTpzWmjiVKu03lbXhZidGMWveE78";
const LIMIT = "&limit=25";
let buttonRight = document.getElementById("slideRight");
let buttonLeft = document.getElementById("slideLeft");
let buttonLeftModal = document.getElementById("slideLeftModal");
let buttonRightModal = document.getElementById("slideRightModal");
let divGifs = document.getElementById("gifs");
let searchContainer = document.getElementById("search-div");
let searchField = document.getElementById("search-input");
let btnCloseSearch = document.getElementById("btn-close-search");
let central = document.getElementById("central");
let btnMas = document.getElementById("btn-mas");
let noResults = document.getElementById("no-results");
let modal = document.getElementById("myModal");
let modalContent = document.querySelector("#modalContent")
let span = document.getElementsByClassName("close")[0];
let linkFavoritos = document.getElementsByClassName("links")[1];
let btnMasFavs = document.getElementById("btn-mas-favs");
let ulSuggestions = document.getElementById("suggestions");   

export {initial,API_KEY,LIMIT,URL,btnCloseSearch,btnMas,btnMasFavs,buttonLeft,buttonLeftModal,buttonRight,buttonRightModal,central,container,containerFavorites,containerSearchResults,divGifs,favoritos,linkFavoritos,modal, modalContent,noFavorites,noResults,searchContainer, searchField,span, ulSuggestions}