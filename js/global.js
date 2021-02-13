let initial = document.getElementById("initial");
let menu = document.getElementById("menu");
let favoritos = document.getElementById("favoritos");
let misGIFOS = document.getElementById("section-mis-gifos")
let container = document.getElementById("gifs");
let containerSearchResults = document.getElementById("search-results");
let noFavorites = document.getElementById("no-favorites");
let containerFavorites = document.getElementById("favorites");
let containerGIFOS = document.getElementById("mis-gifos");
let noMisGIFOS = document.getElementById("no-gifos");
const URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
const API_KEY = "CqzSXTpzWmjiVKu03lbXhZidGMWveE78";
const LIMIT = "&limit=25";
let buttonRight = document.getElementById("slide-right");
let buttonLeft = document.getElementById("slide-left");
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
let linkGIFOS = document.getElementsByClassName("links")[2];
let btnMasFavs = document.getElementById("btn-mas-favs");
let ulSuggestions = document.getElementById("suggestions");   
let links = document.getElementsByClassName("links");
let btnComenzar =document.getElementById("btn-comenzar")
let btnGrabar =document.getElementById("btn-grabar")
let btnFinalizar =document.getElementById("btn-finalizar")
let btnSubirGifo = document.getElementById("btn-subir-gifo");
let btnMasMisGifs = document.getElementById("btn-mas-mis-gifos");
let cameraImg = document.getElementById("camera-img");
let cameraWindow = document.getElementById("camera-window");
let cameraWindow2 = document.getElementById("camera-window-2");
let video = document.querySelector('video');
let pasos = document.getElementById("pasos");
let cardSubiendoGifo = document.getElementById("subiendo-gifo");
let cronometro = document.getElementById("cronometro");
let nocturno = document.getElementById("nocturno");
let nocturnoCG = document.getElementById("nocturno-crear-gifo");
let logo = document.getElementById("logo");
let crearGifo = document.getElementById("crear-gifo");
let burger = document.getElementById("burger");

function checkDarkMode(link){
    if(localStorage.getItem("modo-nocturno")){
        let modoNocturno = localStorage.getItem("modo-nocturno");
        if(modoNocturno === "on"){
            if(!document.body.classList.contains("dark")){
                document.body.classList.add("dark");
                link.textContent = "MODO DIURNO";               
            }
        }else{
            document.body.classList.remove("dark");
            link.textContent = "MODO NOCTURNO";            
        }
    }
}
function checkMobile(){
    if(initial.clientWidth <= 850){
        if(!burger.classList.contains("burger-close")){        
            menu.classList.add("none");
            menu.classList.remove("flex");        
        }
    }
}

export {initial,menu,misGIFOS,API_KEY,LIMIT,URL,btnCloseSearch,btnMas,btnMasFavs,buttonLeft,buttonLeftModal,buttonRight,buttonRightModal,central,container,containerFavorites,containerGIFOS,noMisGIFOS,containerSearchResults,divGifs,favoritos,linkFavoritos, linkGIFOS,modal, modalContent,noFavorites,noResults,searchContainer, searchField,span, ulSuggestions, links, btnComenzar,btnGrabar, btnFinalizar, btnSubirGifo, btnMasMisGifs,cameraImg,cameraWindow, cameraWindow2, video, pasos, cardSubiendoGifo, cronometro, nocturno,nocturnoCG,logo, crearGifo, checkDarkMode, checkMobile, burger}