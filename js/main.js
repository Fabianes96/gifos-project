let initial = document.getElementById("initial");
let favoritos = document.getElementById("favoritos");
let container = document.getElementById("gifs");
let containerSearchResults = document.getElementById("search-results");
const URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
const API_KEY = "CqzSXTpzWmjiVKu03lbXhZidGMWveE78";
const LIMIT = "&limit=25";
let gifs = [];
let gifsSearch = [];
let buttonRight = document.getElementById("slideRight");
let buttonLeft = document.getElementById("slideLeft");
let buttonLeftModal = document.getElementById("slideLeftModal");
let buttonRightModal = document.getElementById("slideRightModal");
let divGifs = document.getElementById("gifs");
let searchContainer = document.getElementById("search-div");
let searchField = document.getElementById("search-input");
let btnCloseSearch = document.getElementById("btn-close-search");
let searchClousureFlag = false;
let central = document.getElementById("central");
let btnMas = document.getElementById("btn-mas");
let noResults = document.getElementById("no-results");
var modal = document.getElementById("myModal");
var modalContent = document.querySelector("#modalContent")
var span = document.getElementsByClassName("close")[0];
let linkFavoritos = document.getElementsByClassName("links")[1];
var index;
let blur = false;
let activeModalArray = [];
let gifsSearchAux = [];
let auxMasGifs = 0;

linkFavoritos.addEventListener("click",()=>{  
  initial.classList.remove("initial");
  initial.classList.add("none");
  favoritos.classList.remove("none");
})
span.onclick = function () {
  modal.style.display = "none";
  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }
};
window.onclick = async function (event) {          
  try {        
    if (event.target == modal) {
      modal.style.display = "none";
      while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
      }
    }    
    if(blur){     
      if(event.target != searchField){
        if(event.target.localName == "li"){
          let li = event.target;
          searchField.value = li.textContent;  
          await showGifsSearch();    
        } else{
          searchClousure();           
        }
      }  
    }
  } catch (error) {
    console.log(error);
  }
};
function searchClousure(){
  let ulSuggestions = document.getElementById("suggestions");    
  ulSuggestions.classList.add("none");
  while(ulSuggestions.firstElementChild!=null){
    ulSuggestions.removeChild(ulSuggestions.firstElementChild);      
  }
  if(searchClousureFlag){
    searchContainer.classList.remove("search-after-div");
    searchField.classList.add("search-field")
    searchField.classList.remove("search-after-input");
    btnCloseSearch.classList.add("none");
    btnCloseSearch.classList.remove("btn-close-search");
    searchClousureFlag = false;
  }
}
btnMas.addEventListener("click",async()=>{
  try {
    let masGifs = [];
    auxMasGifs++;
    let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchField.value}&limit=12&offset=${auxMasGifs*12}`);
    response = await response.json();    
    masGifs = response.data;
    gifsSearchAux = gifsSearchAux.concat(masGifs);    
    addGifs(masGifs,"container-search-results",containerSearchResults,false);
  } catch (error) {
      console.log(error);
  }
})
btnCloseSearch.addEventListener("click",()=>{
  auxMasGifs = 0;
  searchField.value = "";
  central.classList.remove("show-div-results");
  central.classList.add("central");
  searchClousure()
});
buttonLeft.addEventListener("click", function () {
  let gif = document.getElementById("gifs");
  gif.scrollLeft -= 500;
});
buttonRight.addEventListener("click", function () {
  document.getElementById("gifs").scrollLeft += 500;
});

searchField.addEventListener("click",()=>{  
  searchContainer.classList.add("search-after-div");
  searchField.classList.remove("search-field");
  searchField.classList.add("search-after-input");
  btnCloseSearch.classList.remove("none")
  btnCloseSearch.classList.add("btn-close-search");
  let ulSuggestions = document.getElementById("suggestions");    
  ulSuggestions.classList.remove("none");
  searchClousureFlag = true
  blur = false;
})
searchField.addEventListener('blur', ()=>{
  blur = true;
})
searchField.addEventListener("keyup",async(e)=>{
  try {                
    if(e.code.startsWith("Key") || e.code.startsWith("Digit") || e.code === "Backspace"){            
      let response = await fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=${API_KEY}&q=${searchField.value}&limit=4`)
      let json = await response.json();    
      let ul = document.createElement("ul");
      ul.setAttribute("id", "suggestions");
      ul.setAttribute("class", "search-after-ul");
      let ulSuggestions = document.getElementById("suggestions");    
    if(ulSuggestions){
      ulSuggestions.remove()
    }
      json.data.forEach((suggestion)=>{
        let li = document.createElement("li")
        li.textContent = suggestion.name;
        ul.appendChild(li);              
      })    
      searchContainer.appendChild(ul);
    }
    if(e.code == "Enter"){      
      await showGifsSearch();
    }        
  } catch (error) {
    console.log("No se cargaron los resultados", error);
  }   
})
async function showGifsSearch(){
  btnMas.classList.add("none");
  if(noResults.className.includes("no-results")){
    noResults.classList.remove("no-results");
    noResults.classList.add("none");    
  }
  let search = searchField.value;
  let title = document.getElementById("title-result");
  title.textContent = "Cargando resultados..."      
  central.classList.remove("central");
  central.classList.add("show-div-results");
  gifsSearch = [];
  gifsSearchAux = [];
  if(containerSearchResults.firstElementChild){
    while(containerSearchResults.firstElementChild){
        containerSearchResults.removeChild(containerSearchResults.firstElementChild);
    }  
  }
  let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchField.value}&limit=12`);
  response = await response.json();
  title.textContent = search;
  gifsSearch = response.data;       
  gifsSearchAux = gifsSearch;
  if(gifsSearch.length != 0){
    btnMas.classList.remove("none");
    addGifs(gifsSearch,"container-search-results",containerSearchResults,false);
  }else{    
    btnMas.classList.add("none");
    noResults.classList.remove("none");
    noResults.classList.add("no-results");    
  }
}
async function callGifs() {
  try {
    let call = await fetch(URL + API_KEY + LIMIT);
    const response = await call.json();
    gifs = response.data;
  } catch (error) {
    console.log(error);
  }
}

function addGifs(array, attribute, container, modal){      
  for (let i = 0; i < array.length; i++) {    
    let square = document.createElement("div");
    square.setAttribute("class", attribute)
    
    let card = document.createElement("div");
    card.setAttribute("class", "card-icons");

    let divIconFav = document.createElement("div");
    divIconFav.setAttribute("class", "div-icons");
    let image1 = document.createElement("img");
    image1.setAttribute("src", "assets/icon-fav-hover.svg");
    image1.setAttribute("class", "icono");
    divIconFav.appendChild(image1);
    card.appendChild(divIconFav);

    let divIconDownload = document.createElement("div");
    divIconDownload.setAttribute("class", "div-icons");
    let image2 = document.createElement("img");
    image2.setAttribute("src", "assets/icon-download.svg");
    image2.setAttribute("class", "icono");
    divIconDownload.appendChild(image2);
    card.appendChild(divIconDownload);

    let divIconMax = document.createElement("div");
    divIconMax.setAttribute("class", "div-icons");
    let image3 = document.createElement("img");
    image3.setAttribute("src", "assets/icon-max.svg");
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
    divIconMax.addEventListener('click', ()=>{
      showModal(array,i);      
    })
    if(modal){
      square.addEventListener('click',()=>{      
        if(square.offsetWidth < 320){
          showModal(array,i);
        }
      })
    }else{
      square.addEventListener('click',()=>{      
        if(square.offsetWidth < 200){
          showModal(array,i);
        }
      })
    }
    container.appendChild(square);
  }
}

function showModal(array,i) {  
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

    let image2 = document.createElement("img");
    image2.setAttribute("src", "assets/icon-download.svg");
    image2.setAttribute("class", "icono");
    divIconDownload.appendChild(image2);

    let divParagraphs = document.createElement("div");
    divParagraphs.setAttribute("class", "div-description");
    let divContainer = document.createElement("div");
    divContainer.setAttribute('id', 'modalGifDescription');
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
    modalContent.appendChild(gif);
    modalContent.appendChild(divContainer);    
    modal.style.display = "block";   
}

function loadGifModal(array,derecha){
  let modal = modalContent.firstElementChild; 
  let firstChild = document.querySelector("#modalContent div");
  let divDesc = firstChild.firstElementChild;
  let user = divDesc.firstElementChild;
  let title = divDesc.lastElementChild;   
  if(derecha){
    if((index+1) < array.length ){    
      modal.setAttribute('src',`${array[index+1].images.original.url}`)
      user.textContent = `${array[index+1].username}`;
      title.textContent = `${array[index+1].title}`
      index = index+1;  
    }  
  }else{
    if((index-1) >= 0 ){    
      modal.setAttribute('src',`${array[index-1].images.original.url}`)
      user.textContent = `${array[index-1].username}`;
      title.textContent = `${array[index-1].title}`
      index = index-1;  
    }  
  }  
}

buttonLeftModal.addEventListener('click',()=>{
  if(activeModalArray === gifs){
    loadGifModal(gifs,false);
  }else{
    loadGifModal(gifsSearchAux,false);
  }
});
buttonRightModal.addEventListener('click',()=>{
  if(activeModalArray === gifs){
    loadGifModal(gifs,true);
  }else{
    loadGifModal(gifsSearchAux,true);
  }
})
callGifs().then(() => {
  addGifs(gifs,"square",container,true);
});
