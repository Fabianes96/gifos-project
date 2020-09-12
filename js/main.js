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

async function callGifs() {
  try {
    let call = await fetch(URL + API_KEY + LIMIT);
    const response = await call.json();
    gifs = response.data;
  } catch (error) {
    console.log(error);
  }

  // let div = document.createElement("img");
  // div.setAttribute("src", "https://media3.giphy.com/media/Y1Xxlg8verQGdFQyCz/200.gif?cid=cfc0aab7abfdd810b3e44d4fba37c2187afb2283c70f7f4b&rid=200.gif");
  // container.appendChild(div)
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
    container.appendChild(square);
    //square.addEventListener('click', showModal(i))
    // let image = document.createElement("img");
    // image.setAttribute("src", `${gifs[i].images.original.url}`);
    // image.style.width = "357px";
    // image.style.height = "275px";
    // image.style.marginRight = "29px";
    // div.appendChild(image);
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

    

  // square.addEventListener('click', ()=>{
  //   modal.style.display = "block";
  //   modalContent.appendChild(gif);
  // })
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
