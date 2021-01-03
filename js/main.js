let container = document.getElementById("gifs");
const URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
const API_KEY = "CqzSXTpzWmjiVKu03lbXhZidGMWveE78";
const LIMIT = "&limit=25";
let gifs = [];
let buttonRight = document.getElementById("slideRight");
let buttonLeft = document.getElementById("slideLeft");
let buttonLeftModal = document.getElementById("slideLeftModal");
let buttonRightModal = document.getElementById("slideRightModal");
let divGifs = document.getElementById("gifs");
let searchContainer = document.getElementById("search-div");
let searchField = document.getElementById("search-input");
let btnCloseSearch = document.getElementById("btn-close-search");
var modal = document.getElementById("myModal");
var modalContent = document.querySelector("#modalContent")
var span = document.getElementsByClassName("close")[0];
var index;

span.onclick = function () {
  modal.style.display = "none";
  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    while (modalContent.firstChild) {
      modalContent.removeChild(modalContent.firstChild);
    }
  }
};
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
  btnCloseSearch.classList.remove("btn-close-search-none")
  btnCloseSearch.classList.add("btn-close-search")
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
    
  } catch (error) {
    console.log(error);
  }   
})
async function addSuggestion(){

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
function addGifs() {
  for (let i = 0; i < gifs.length; i++) {
    let square = document.createElement("div");
    square.setAttribute("class", "square");

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
    gif.setAttribute("src", `${gifs[i].images.original.url}`);
    gif.setAttribute("class", "gifos");    
    square.appendChild(gif);
    let divParagraphs = document.createElement("div");
    divParagraphs.setAttribute("class", "div-description");
    let p1 = document.createElement("p");
    p1.textContent = `${gifs[i].username}`;
    let p2 = document.createElement("p");
    p2.textContent = `${gifs[i].title}`;
    divParagraphs.appendChild(p1);
    divParagraphs.appendChild(p2);
    square.appendChild(divParagraphs);    
    divIconMax.addEventListener('click', ()=>{
      showModal(i);
    })
    square.addEventListener('click',()=>{      
      if(square.offsetWidth < 320){
        showModal(i);
      }
    })
    container.appendChild(square);
  }
}
function showModal(i) {
    index = i;
    let gif = document.createElement("img");
    gif.setAttribute("src", `${gifs[i].images.original.url}`);
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
    p1.textContent = `${gifs[i].username}`;
    let p2 = document.createElement("p");
    p2.textContent = `${gifs[i].title}`;
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

buttonLeftModal.addEventListener('click',()=>{
  let modal = modalContent.firstElementChild; 
  let firstChild = document.querySelector("#modalContent div");
  let divDesc = firstChild.firstElementChild;
  let user = divDesc.firstElementChild;
  let title = divDesc.lastElementChild; 
  
  if((index-1) >= 0 ){    
    modal.setAttribute('src',`${gifs[index-1].images.original.url}`)
    user.textContent = `${gifs[index-1].username}`;
    title.textContent = `${gifs[index-1].title}`
    index = index-1;  
  }  
});
buttonRightModal.addEventListener('click',()=>{
  let modal = modalContent.firstElementChild; 
  let first = document.querySelector("#modalContent div");
  let divDesc = first.firstElementChild;
  let user = divDesc.firstElementChild;
  let title = divDesc.lastElementChild; 
  
  if((index+1) < gifs.length ){    
    modal.setAttribute('src',`${gifs[index+1].images.original.url}`)
    user.textContent = `${gifs[index+1].username}`;
    title.textContent = `${gifs[index+1].title}`
    index = index+1;  
  }  
});
callGifs().then(() => {
  addGifs();
});
