import * as global from "./global.js";

let gifs = [];
let gifsSearch = [];
let searchClousureFlag = false;
var index;
let blur = false;
let activeModalArray = [];
let gifsSearchAux = [];
let auxMasGifs = 0;
let favs = localStorage.getItem("favoritos")
? JSON.parse(localStorage.getItem("favoritos"))
: [];
let offsetFavs = 12;
let offsetMisGifs = 12;

window.onclick = async function (event) {
  try {
    if (event.target == global.modal) {
      global.modal.style.display = "none";
      while (global.modalContent.firstChild) {
        global.modalContent.removeChild(global.modalContent.firstChild);
      }
    }
    if (blur) {
      if (event.target != global.searchField) {
        if (event.target.localName == "li") {
          let li = event.target;
          global.searchField.value = li.textContent;
          await showGifsSearch();
        } else {
          searchClousure();
        }
      }
      blur = false;
    }
  } catch (error) {
    console.log(error);
  }
};
global.burger.addEventListener("click",()=>{
  global.showHideMenu();
});
global.nocturno.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")){   
    global.nocturno.textContent = "MODO DIURNO";    
    localStorage.setItem("modo-nocturno", "on");
  }else{
    global.logo.setAttribute("src", "assets/logo-desktop.svg");
    global.crearGifo.setAttribute("src","assets/button-crear-gifo.svg");    
    global.btnCloseSearch.setAttribute("src","assets/close.svg");    
    global.nocturno.textContent = "MODO NOCTURNO"
    localStorage.setItem("modo-nocturno", "off");
  }
})

global.btnMasFavs.addEventListener("click", () => {
  let inicio = offsetFavs;
  offsetFavs = offsetFavs + 4;
  let cant = favs.length;
  if (cant > offsetFavs) {
    addGifs(
      favs.slice(inicio, offsetFavs),
      "container-search-and-favs","assets/icon-fav-active.svg",
      global.containerFavorites,
      false
    );
  } else {
    addGifs(
      favs.slice(inicio, favs.length),
      "container-search-and-favs","assets/icon-fav-active.svg",
      global.containerFavorites,
      false
    );
    global.btnMasFavs.classList.add("none");
  }
});
global.btnMasMisGifs.addEventListener("click",()=>{
  let inicio = offsetMisGifs;
  offsetMisGifs = offsetMisGifs + 4;
  let misGifs = JSON.parse(localStorage.getItem("mis-gifos"));
  let cant = misGifs.length;
  if(cant > offsetMisGifs){
    addGifs(
      misGifs.slice(inicio, offsetMisGifs),
      "container-search-and-favs","assets/icon-fav.svg",
      global.containerGIFOS,
      false
    );
  }else{
    addGifs(
      misGifs.slice(inicio, misGifs.length),
      "container-search-and-favs","assets/icon-fav.svg",
      global.containerGIFOS,
      false
    );
    global.btnMasMisGifs.classList.add("none");
  }
})

global.linkFavoritos.addEventListener("click", () => {  
  if(global.menu.classList.contains("open-hamburger-menu")){
    global.showHideMenu();
  }
  addFavorite();
});
global.linkGIFOS.addEventListener("click",()=>{
  if(global.menu.classList.contains("open-hamburger-menu")){
    global.showHideMenu();
  }
  addGIFOS();
})
global.span.onclick = function () {
  global.modal.style.display = "none";
  //
  while (modalContent.firstChild) {
    global.modalContent.removeChild(global.modalContent.firstChild);
  }
};
global.btnMas.addEventListener("click", async () => {
  try {
    let masGifs = [];
    auxMasGifs++;
    let response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${global.API_KEY}&q=${
        global.searchField.value
      }&limit=12&offset=${auxMasGifs * 12}`
    );
    response = await response.json();
    masGifs = response.data;
    gifsSearchAux = gifsSearchAux.concat(masGifs);
    addGifs(
      masGifs,
      "container-search-and-favs","assets/icon-fav.svg",
      global.containerSearchResults,
      false
    );
  } catch (error) {
    console.log(error);
  }
});
global.btnCloseSearch.addEventListener("click", () => {
  auxMasGifs = 0;
  global.searchField.value = "";
  global.central.classList.remove("show-div-results");
  global.central.classList.add("central");
  searchClousure();
});
global.buttonLeft.addEventListener("click", function () {
  let gif = document.getElementById("gifs");
  gif.scrollLeft -= 500;
});
global.buttonRight.addEventListener("click", function () {
  document.getElementById("gifs").scrollLeft += 500;
});

global.searchField.addEventListener("click", () => {
  global.searchContainer.classList.add("search-after-div");
  global.searchField.classList.remove("search-field");
  global.searchField.classList.add("search-after-input");
  global.btnCloseSearch.classList.remove("none");
  global.btnCloseSearch.classList.add("btn-close-search");
  let ulSuggestions = document.getElementById("suggestions");
  ulSuggestions.classList.remove("none");
  searchClousureFlag = true;
  blur = false;
});
global.searchField.addEventListener("blur", () => {
  blur = true;
});
global.searchField.addEventListener("keyup", async (e) => {
  try {
    if (
      e.code.startsWith("Key") ||
      e.code.startsWith("Digit") ||
      e.code === "Backspace"
    ) {
      let response = await fetch(
        `https://api.giphy.com/v1/gifs/search/tags?api_key=${global.API_KEY}&q=${global.searchField.value}&limit=4`
      );
      let json = await response.json();
      let ul = document.createElement("ul");
      ul.setAttribute("id", "suggestions");
      ul.setAttribute("class", "search-after-ul");
      let ulSuggestions = document.getElementById("suggestions");
      if (ulSuggestions) {
        ulSuggestions.remove();
      }
      json.data.forEach((suggestion) => {
        let li = document.createElement("li");
        li.textContent = suggestion.name;
        ul.appendChild(li);
      });
      global.searchContainer.appendChild(ul);
    }
    if (e.code == "Enter") {
      await showGifsSearch();
    }
  } catch (error) {
    console.log("No se cargaron los resultados", error);
  }
});
global.buttonLeftModal.addEventListener("click", () => {
  switch (activeModalArray) {
    case gifs:
      loadGifModal(gifs, false);
    case gifsSearchAux:
      loadGifModal(gifsSearchAux, false);
    default:
      loadGifModal(favs, false);
  }
});
global.buttonRightModal.addEventListener("click", () => {
  switch (activeModalArray) {
    case gifs:
      loadGifModal(gifs, true);
    case gifsSearchAux:
      loadGifModal(gifsSearchAux, true);
    default:
      loadGifModal(favs, true);
  }
});
async function addGIFOS(){
  if(global.containerGIFOS.firstElementChild){
    while(global.containerGIFOS.firstElementChild){
      global.containerGIFOS.removeChild(
        global.containerGIFOS.firstElementChild
      );
    }
  }
  if(global.central.classList.contains("show-div-results")){
    global.central.remove();
  }   
  global.initial.remove();      
  global.favoritos.classList.remove("favs");
  global.favoritos.classList.add("none");  
  let misGifs = JSON.parse(localStorage.getItem("mis-gifos"));
  global.misGIFOS.classList.remove("none");  
  if(misGifs){    
    global.misGIFOS.classList.add("section-misgifos");
    global.noMisGIFOS.remove();
    if(misGifs.length > 12){
      addGifs(
        misGifs.slice(0, 12),
        "container-search-and-favs","assets/icon-fav.svg",
        global.containerGIFOS,
        false
        );
      global.btnMasMisGifs.classList.remove("none");
    }else{
      addGifs(misGifs,"container-search-and-favs","assets/icon-fav.svg",global.containerGIFOS,false);
    }
  } 
}
function addFavorite() {
  if (global.containerFavorites.firstElementChild) {
    while (global.containerFavorites.firstElementChild) {
      global.containerFavorites.removeChild(
        global.containerFavorites.firstElementChild
      );
    }
  }  
  if(global.central.classList.contains("show-div-results")){
    global.central.remove();
  }   
  global.initial.remove();  
  global.favoritos.classList.remove("none");
  global.misGIFOS.classList.remove("section-misgifos");
  global.misGIFOS.classList.add("none");
  favs = JSON.parse(localStorage.getItem("favoritos"));
  if (favs) {
    global.noFavorites.classList.remove("no-favorites");
    global.noFavorites.classList.add("none");
    global.favoritos.classList.add("favs");
    if (favs.length > 12) {
      /////////////////////////////////////////////////////////
      addGifs(
        favs.slice(0, 12),
        "container-search-and-favs","assets/icon-fav-active.svg",
        global.containerFavorites,
        false
      );
      global.btnMasFavs.classList.remove("none");
    } else {
      addGifs(
        favs,
        "container-search-and-favs","assets/icon-fav-active.svg",
        global.containerFavorites,
        false
      );
    }
  } else {
    favs = [];
  }
}
function activeLink(){
  let menu = document.getElementById("menu");
  let a = menu.getElementsByClassName("links");  
  for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("click",()=>{
      let current = document.getElementsByClassName("active");      
      if(current.length > 0){
        current[0].classList.add("no-selected");
        current[0].classList.remove("active");    
      }      
      a[i].classList.remove("no-selected")
      a[i].classList.add("active")
    })
  }
}
function searchClousure() {
  let ulSuggestions = document.getElementById("suggestions");
  ulSuggestions.classList.add("none");
  while (ulSuggestions.firstElementChild != null) {
    ulSuggestions.removeChild(ulSuggestions.firstElementChild);
  }
  if (searchClousureFlag) {
    global.searchContainer.classList.remove("search-after-div");
    global.searchField.classList.add("search-field");
    global.searchField.classList.remove("search-after-input");
    global.btnCloseSearch.classList.add("none");
    global.btnCloseSearch.classList.remove("btn-close-search");
    searchClousureFlag = false;
  }
}
async function showGifsSearch() {
  global.btnMas.classList.add("none");
  if (global.noResults.className.includes("no-results")) {
    global.noResults.classList.remove("no-results");
    global.noResults.classList.add("none");
  }
  let search = global.searchField.value;
  let title = document.getElementById("title-result");
  title.textContent = "Cargando resultados...";
  global.central.classList.remove("central");
  global.central.classList.add("show-div-results");
  gifsSearch = [];
  gifsSearchAux = [];
  if (global.containerSearchResults.firstElementChild) {
    while (global.containerSearchResults.firstElementChild) {
      global.containerSearchResults.removeChild(
        global.containerSearchResults.firstElementChild
      );
    }
  }
  let response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${global.API_KEY}&q=${global.searchField.value}&limit=12`
  );
  response = await response.json();
  title.textContent = search;
  gifsSearch = response.data;
  gifsSearchAux = gifsSearch;
  if (gifsSearch.length != 0) {
    global.btnMas.classList.remove("none");
    addGifs(
      gifsSearch,
      "container-search-and-favs","assets/icon-fav.svg",
      global.containerSearchResults,
      false
    );
  } else {
    global.btnMas.classList.add("none");
    global.noResults.classList.remove("none");
    global.noResults.classList.add("no-results");
  }
}
async function callGifs() {
  try {
    let call = await fetch(global.URL + global.API_KEY + global.LIMIT);
    const response = await call.json();
    gifs = response.data;
  } catch (error) {
    console.log(error);
  }
}

function addGifs(array, attribute,iconoFav, container, modal) {
  for (let i = 0; i < array.length; i++) {
    let square = document.createElement("div");
    square.setAttribute("class", attribute);

    let card = document.createElement("div");
    card.setAttribute("class", "card-icons");
    
    let divIconFav = document.createElement("div");
    divIconFav.setAttribute("class", "div-icons");
    let image1 = document.createElement("img");
    image1.setAttribute("src", iconoFav);
    image1.setAttribute("class", "icono");
    divIconFav.appendChild(image1);
    if(iconoFav === "assets/icon-fav.svg"){
      divIconFav.addEventListener("click", () => {
        addFavToLocalstorage(array, i);
        card.classList.add("favorite-added");
      });
    }else{
      card.classList.add("favorite-added");
    }
    card.appendChild(divIconFav);

    let divIconDownload = document.createElement("div");    
    divIconDownload.setAttribute("class", "div-icons");
    let image2 = document.createElement("img");
    image2.setAttribute("src", "assets/icon-download.svg");
    image2.setAttribute("class", "icono");
    divIconDownload.appendChild(image2);    
    divIconDownload.addEventListener("click",()=>{
      downloadGif(array[i].images.original.url,array[i].title);
    });
    card.appendChild(divIconDownload);

    let divIconMax = document.createElement("div");
    divIconMax.setAttribute("class", "div-icons");
    let image3 = document.createElement("img");
    image3.setAttribute("src", "assets/icon-max-normal.svg");
    image3.setAttribute("class", "icono");
    divIconMax.appendChild(image3);
    card.appendChild(divIconMax);

    square.appendChild(card);

    let gif = document.createElement("img");
    gif.setAttribute("src", `${array[i].images.original.url}`);
    gif.setAttribute("class", "gifos");
    square.appendChild(gif);
    let divParagraphs = document.createElement("div");
    divParagraphs.setAttribute("class", "div-description");
    let p1 = document.createElement("p");
    p1.textContent = `${array[i].username}`;
    let p2 = document.createElement("p");
    p2.textContent = `${array[i].title}`;
    divParagraphs.appendChild(p1);
    divParagraphs.appendChild(p2);
    square.appendChild(divParagraphs);
    divIconMax.addEventListener("click", () => {
      showModal(array, i);
    });
    if (modal) {
      square.addEventListener("click", () => {
        if (square.offsetWidth < 320) {
          showModal(array, i);
        }
      });
    } else {
      square.addEventListener("click", () => {
        if (square.offsetWidth < 200) {
          showModal(array, i);
        }
      });
    }
    container.appendChild(square);
  }  
}
function addFavToLocalstorage(array, i) {
  offsetFavs = 12;
  if (localStorage.getItem("favoritos")) {
    if (favs.some((gif) => gif.id === array[i].id)) {
      console.log("El gif ya ha sido añadido");
    } else {
      favs.push(array[i]);
      localStorage.setItem("favoritos", JSON.stringify(favs));
      console.log("Gif agregado a favoritos");
      if (!global.favoritos.classList.contains("none")) {
        addFavorite();
      }
    }
  } else {
    favs = [];
    favs.push(array[i]);
    localStorage.setItem("favoritos", JSON.stringify(favs));
    console.log("Gif agregado a favoritos");
    if (!global.favoritos.classList.contains("none")) {
      addFavorite();
    }
  }
}

function showModal(array, i) {
  activeModalArray = array;
  index = i;
  let gif = document.createElement("img");
  gif.setAttribute("src", `${array[i].images.original.url}`);
  gif.setAttribute("class", "modal-gif");
  let div = document.createElement("div");
  div.setAttribute("class", "card-icons-max");

  let divIconFav = document.createElement("div");
  divIconFav.setAttribute("class", "div-icons");

  let divIconDownload = document.createElement("div");
  divIconDownload.setAttribute("class", "div-icons");

  let image1 = document.createElement("img");
  image1.setAttribute("src", "assets/icon-fav-active.svg");
  image1.setAttribute("class", "icono");
  divIconFav.appendChild(image1);
  divIconFav.addEventListener("click", () => {
    addFavToLocalstorage(array, i);
  });

  let image2 = document.createElement("img");
  image2.setAttribute("src", "assets/icon-download.svg");
  image2.setAttribute("class", "icono");
  divIconDownload.appendChild(image2);

  let divParagraphs = document.createElement("div");
  divParagraphs.setAttribute("class", "div-description");
  let divContainer = document.createElement("div");
  divContainer.setAttribute("id", "modalGifDescription");
  let p1 = document.createElement("p");
  p1.textContent = `${array[i].username}`;
  let p2 = document.createElement("p");
  p2.textContent = `${array[i].title}`;
  divParagraphs.appendChild(p1);
  divParagraphs.appendChild(p2);
  div.appendChild(divIconFav);
  div.appendChild(divIconDownload);
  divContainer.appendChild(divParagraphs);
  divContainer.appendChild(div);
  global.modalContent.appendChild(gif);
  global.modalContent.appendChild(divContainer);
  global.modal.style.display = "block";
}

function loadGifModal(array, derecha) {
  let modal = global.modalContent.firstElementChild;
  let firstChild = document.querySelector("#modalContent div");
  let divDesc = firstChild.firstElementChild;
  let user = divDesc.firstElementChild;
  let title = divDesc.lastElementChild;
  if (derecha) {
    if (index + 1 < array.length) {
      modal.setAttribute("src", `${array[index + 1].images.original.url}`);
      user.textContent = `${array[index + 1].username}`;
      title.textContent = `${array[index + 1].title}`;
      index = index + 1;
    }
  } else {
    if (index - 1 >= 0) {
      modal.setAttribute("src", `${array[index - 1].images.original.url}`);
      user.textContent = `${array[index - 1].username}`;
      title.textContent = `${array[index - 1].title}`;
      index = index - 1;
    }
  }
}
async function downloadGif(url,titulo){
  try {
    let a = document.createElement('a');
    let response = await fetch(url)
    let file = await response.blob();
    if(titulo){
      a.download = titulo;
    } else{
      a.download = "myGif"
    }
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download,a.href].join(":");
    a.click()
  } catch (error) {
    console.log(error);
  }
}

callGifs().then(() => {
  addGifs(gifs, "square","assets/icon-fav.svg", global.container, true);  
});
activeLink();
global.checkDarkMode(global.nocturno);
//global.checkMobile();