import * as global from "./global.js";

let gifs = [];
let gifsSearch = [];
let searchClousureFlag = false;
var index;
let blur = false;
let activeModalArray = [];
let gifsSearchAux = [];
let tagName = "";
let auxMasGifs = 0;
let favs = localStorage.getItem("favoritos")
? JSON.parse(localStorage.getItem("favoritos"))
: [];
let misGifs = localStorage.getItem("mis-gifos") 
? JSON.parse(localStorage.getItem("mis-gifos"))
: [];
let offsetFavs = 12;
let offsetMisGifs = 12;
let media = window.matchMedia("screen and (max-width: 850px)");

window.onload = function () {
  let location = window.location;    
  if(location.pathname.includes("/index.html") && location.hash ==="#favoritos"){
    loadFavoritos();
    global.linkFavoritos.classList.remove("no-selected");
    global.linkFavoritos.classList.add("active");
  }
  if(location.pathname.includes("/index.html") && location.hash ==="#section-mis-gifos"){
    loadMisGifos();
    global.linkGIFOS.classList.remove("no-selected");
    global.linkGIFOS.classList.add("active");
  }
}
window.onclick = async function (event) {
  try {          
    if (event.target == global.modal) {
      global.modal.style.display = "none";
      while (global.modalContent.firstChild) {
        global.modalContent.removeChild(global.modalContent.firstChild);
      }
    }
    if(event.path[1]===global.separador1 || event.path[1]===global.separador2){
      let span = event.target;
      global.searchField.value = span.textContent;
      await showGifsSearch(span.textContent);      
    }
    if (blur) {
      if (event.target != global.searchField) {
        if (event.target.localName == "li") {
          let li = event.target;
          global.searchField.value = li.textContent;
          await showGifsSearch(global.searchField.value);
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
        "container-search-and-favs","assets/icon-trash-normal.svg",
        global.containerGIFOS,
        true, "misGifs"
        );
      global.btnMasMisGifs.classList.remove("none");
    }else{
      addGifs(misGifs,"container-search-and-favs","assets/icon-trash-normal.svg",global.containerGIFOS,true, "misGifs");
    }
  } 
}
function loadFavoritos() {
  if(global.menu.classList.contains("open-hamburger-menu")){
    if(document.body.classList.contains("dark")){
      global.showHideMenu(global.burgerDM,"burger-dm",global.burgerCloseDM);
    }else{
      global.showHideMenu(global.burger,"burger-normal",global.burgerClose);
    }
  }
  addFavorite();
}
function loadMisGifos(){
  if(global.menu.classList.contains("open-hamburger-menu")){
    if(document.body.classList.contains("dark")){
      global.showHideMenu(global.burgerDM,"burger-dm",global.burgerCloseDM);
    }else{
      global.showHideMenu(global.burger,"burger-normal",global.burgerClose);
    }
  }
  addGIFOS();
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
      addGifs(
        favs.slice(0, 12),
        "container-search-and-favs","assets/icon-fav-active.svg",
        global.containerFavorites,
        true, "favs"
      );
      global.btnMasFavs.classList.remove("none");
    } else {
      addGifs(
        favs,
        "container-search-and-favs","assets/icon-fav-active.svg",
        global.containerFavorites,
        true, "favs"
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
    if(document.body.classList.contains("dark")){
      global.btnCloseSearchDM.classList.add("none");
      global.btnCloseSearchDM.classList.remove("btn-close-search");
    }else{
      global.btnCloseSearch.classList.add("none");
      global.btnCloseSearch.classList.remove("btn-close-search");
    }
    searchClousureFlag = false;
  }
}
async function showGifsSearch(value) {
  global.btnMas.classList.add("none");
  if (global.noResults.className.includes("no-results")) {
    global.noResults.classList.remove("no-results");
    global.noResults.classList.add("none");
  }
  let search = value;
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
      false, "search"
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
async function  trendings() {
  try {
    let call = await fetch("https://api.giphy.com/v1/trending/searches?api_key="+global.API_KEY);
    let res = await call.json();           
    for (let i = 0; i < 5; i++) {
      let span = document.createElement("span");
      span.textContent = res.data[i];      
      if(i>2){
        global.separador2.appendChild(span);
      }else{
        global.separador1.appendChild(span);
      }
    }    
  } catch (error) {
    console.log(error);
  }
}
trendings();
function addGifs(array, attribute,iconoFav, container, modal, tag) {
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
    card.appendChild(divIconFav);

    let divIconDownload = document.createElement("div");    
    divIconDownload.setAttribute("class", "div-icons");
    let image2 = document.createElement("img");
    image2.setAttribute("src", "assets/icon-download.svg");
    image2.setAttribute("class", "icono");
    divIconDownload.appendChild(image2);    
    divIconDownload.addEventListener("click",()=>{
      global.downloadGif(array[i].images.original.url,array[i].title);
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
    if(iconoFav === "assets/icon-fav.svg"){
      if(localStorage.getItem("favoritos")){
        let index = favs.findIndex((gif)=> gif.id === array[i].id);
        if(index !=-1){
          image1.setAttribute("src", "assets/icon-fav-active.svg");
          card.classList.add("favorite-added");
        }
      }
      divIconFav.addEventListener("click", () => {
        addFavToLocalstorage(array, i);
        card.classList.toggle("favorite-added");
        if(!card.classList.contains("favorite-added")){
          image1.setAttribute("src", iconoFav);
        }
      });
    }else{
      if(iconoFav === "assets/icon-trash-normal.svg"){
        card.classList.add("delete-gif");
        square.setAttribute("id", `${array[i].id}`)
        divIconFav.addEventListener("click", ()=>{
          deleteGif(square,array[i].id);
        })
      }else{
        card.classList.add("favorite-added");
      }
    }
    divIconMax.addEventListener("click", () => {      
      showModal(array,tag,i);
    });
    if (modal) {
      square.addEventListener("click", () => {        
        let media = window.matchMedia("screen and (max-width: 550px)");
        if(media.matches){
          showModal(array,tag, i);
        }
      });
    } else {      
      square.addEventListener("click", () => {                               
        if (square.offsetWidth < 200 && square.offsetWidth !=0) {          
          showModal(array,tag ,i);
        }
      });
    }
    container.appendChild(square);
  }  
}
function deleteGif(square,id) {    
  misGifs = JSON.parse(localStorage.getItem("mis-gifos"));  
  misGifs.forEach(gif => {    
    if(gif.id === id){
      misGifs.splice(misGifs.indexOf(gif), 1);
    }
  });        
  if(misGifs.length <=12 && !global.btnMasMisGifs.classList.contains("none")){
    window.location.reload();
  }
  localStorage.setItem("mis-gifos", JSON.stringify(misGifs));
  square.remove();
  if(misGifs.length == 0){
    localStorage.removeItem("mis-gifos");
    window.location.reload();
  }
}
// console.log("Gif eliminado de favoritos");     
// console.log(array[i], i);
// console.log(favs.indexOf(array[i].id))
// // let location = window.location; 
// // favs.splice(favs.indexOf(array[i]),1)
// // localStorage.setItem("favoritos", JSON.stringify(favs));
// // if(location.hash ==="#favoritos"){
// //   location.reload();
// // }

function addFavToLocalstorage(array, i) {
  offsetFavs = 12;  
  if (localStorage.getItem("favoritos")) {
    let index = favs.findIndex((gif)=> gif.id === array[i].id);
    if(index != -1){
      let location = window.location;            
      favs.splice(index,1);
      localStorage.setItem("favoritos",JSON.stringify(favs));
      if(location.hash ==="#favoritos"){
        location.reload();
      }
      console.log("Gif eliminado de favoritos");
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

function showModal(array, tag, i) {
  activeModalArray = array; 
  tagName = tag;   
  index = i;
  let gif = document.createElement("img");
  gif.setAttribute("src", `${array[i].images.original.url}`);
  gif.setAttribute("class", "modal-gif");
  let div = document.createElement("div");
  div.setAttribute("class", "card-icons-max");
  div.classList.add("favorite-added")

  let divIconFav = document.createElement("div");
  divIconFav.setAttribute("class", "div-icons");
  

  let divIconDownload = document.createElement("div");
  divIconDownload.setAttribute("class", "div-icons");
  divIconDownload.addEventListener("click",()=>{
    downloadGif(array[i].images.original.url,array[i].title);
  });

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
  global.modal.style.display = "flex";
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

callGifs().then(() => {
  global.buttonRight.classList.remove("none");
  global.buttonLeft.classList.remove("none");
  addGifs(gifs, "square","assets/icon-fav.svg", global.container, true, "gifs");  
});
activeLink();
global.checkDarkMode(global.nocturno);
//AddEventListeners
media.addEventListener("change", ()=>{  
  global.checkMediaQuery(media);
})
global.burger.addEventListener("click",()=>{
  global.showHideMenu(global.burger,"burger-normal",global.burgerClose);  
});
global.burgerClose.addEventListener("click",()=>{
  global.showHideMenu(global.burger,"burger-normal",global.burgerClose);
})
global.burgerDM.addEventListener("click",()=>{
  global.showHideMenu(global.burgerDM,"burger-dm",global.burgerCloseDM);
})
global.burgerCloseDM.addEventListener("click",()=>{
  global.showHideMenu(global.burgerDM,"burger-dm",global.burgerCloseDM);
})
global.nocturno.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")){   
    global.nocturno.textContent = "MODO DIURNO";        
    if(media.matches){
      global.burger.classList.remove("burger-normal");
      global.burger.classList.add("none");      
      global.burgerDM.classList.remove("burger-dm");
      global.burgerDM.classList.add("none");      
      global.burgerClose.classList.add("none");
      global.burgerCloseDM.classList.remove("none");
    }else{
      global.initialState();
    }
    localStorage.setItem("modo-nocturno", "on");
  }else{    
    global.nocturno.textContent = "MODO NOCTURNO";
    if(media.matches){
      global.burger.classList.remove("burger-normal");
      global.burger.classList.add("none");        
      global.burgerDM.classList.remove("burger-dm");
      global.burgerDM.classList.add("none");                
      global.burgerCloseDM.classList.add("none");
      global.burgerClose.classList.remove("none");
    }else{
      global.initialState();
    }
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
      false, "favs"
    );
  } else {
    addGifs(
      favs.slice(inicio, favs.length),
      "container-search-and-favs","assets/icon-fav-active.svg",
      global.containerFavorites,
      false, "favs"
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
      "container-search-and-favs","assets/icon-trash-normal.svg",
      global.containerGIFOS,
      false, "misGifs"
    );
  }else{
    addGifs(
      misGifs.slice(inicio, misGifs.length),
      "container-search-and-favs","assets/icon-trash-normal.svg",
      global.containerGIFOS,
      false, "misGifs"
    );
    global.btnMasMisGifs.classList.add("none");
  }
})

global.linkFavoritos.addEventListener("click", () => {  
  loadFavoritos()
});
global.linkGIFOS.addEventListener("click",()=>{
  loadMisGifos();
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
    let title = document.getElementById("title-btn-mas");
    let titleResult = document.getElementById("title-result");
    title.textContent = "Cargando resultados...";    
    global.btnMas.classList.add("none");
    let masGifs = [];
    auxMasGifs++;
    let response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${global.API_KEY}&q=${
        titleResult.textContent
      }&limit=12&offset=${auxMasGifs * 12}`
    );
    response = await response.json();
    masGifs = response.data;
    gifsSearchAux = gifsSearchAux.concat(masGifs);      
    title.textContent = "";
    global.btnMas.classList.remove("none")
    addGifs(
      masGifs,
      "container-search-and-favs","assets/icon-fav.svg",
      global.containerSearchResults,
      false, "search"
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
  if(document.body.classList.contains("dark")){
    global.btnCloseSearchDM.classList.remove("none");
    global.btnCloseSearchDM.classList.add("btn-close-search");
  }else{
    global.btnCloseSearch.classList.remove("none");
    global.btnCloseSearch.classList.add("btn-close-search");
  }
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
    if(e.code){
      if (e.code.startsWith("Key") ||
      e.code.startsWith("Digit") ||
      e.code === "Backspace"
    ) {
        let response = await fetch(
          `https://api.giphy.com/v1/gifs/search/tags?api_key=${global.API_KEY}&q=${global.searchField.value}&limit=4`
        );
        let json = await response.json();
        let ulSuggestions = document.getElementById("suggestions");      
        if(!ulSuggestions.classList.contains("none")){
          let ul = document.createElement("ul");
          ul.setAttribute("id", "suggestions");
          ul.setAttribute("class", "search-after-ul");
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
      }
    }    
    if (e.code == "Enter") {      
      await showGifsSearch(global.searchField.value);
    }
  } catch (error) {
    console.log("No se cargaron los resultados", error);
  }
});
global.buttonLeftModal.addEventListener("click", () => {    
  switch (tagName) {
    case "gifs":
      loadGifModal(gifs, false);
      break;
    case "search":      
      if(gifsSearchAux.length >12 && gifsSearchAux.includes(activeModalArray[index])){
        index = gifsSearchAux.indexOf(activeModalArray[index])        
      }
      loadGifModal(gifsSearchAux, false);
      break;
    case "favs":      
      if(favs.length >12 && favs.includes(activeModalArray[index])){
        index = favs.indexOf(activeModalArray[index])        
      }
      loadGifModal(favs, false);
      break;
    default:      
    if(misGifs.length >12 && misGifs.includes(activeModalArray[index])){
      index = misGifs.indexOf(activeModalArray[index])        
    }
      loadGifModal(misGifs, false);
  }
});
global.buttonRightModal.addEventListener("click", () => {      
  switch (tagName) {
    case "gifs":
      loadGifModal(gifs, true);
      break;
    case "search":
      if(gifsSearchAux.length >12 && gifsSearchAux.includes(activeModalArray[index])){
        index = gifsSearchAux.indexOf(activeModalArray[index])        
      }
      loadGifModal(gifsSearchAux, true);
      break;
    case "favs":
      if(favs.length >12 && favs.includes(activeModalArray[index])){
        index = favs.indexOf(activeModalArray[index])        
      }
      loadGifModal(favs, true);
      break;
    default:
      if(misGifs.length >12 && misGifs.includes(activeModalArray[index])){
        index = misGifs.indexOf(activeModalArray[index])        
      }
      loadGifModal(misGifs, true);
  }
});