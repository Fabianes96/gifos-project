let container = document.getElementById("gifs");
const URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
const API_KEY = "CqzSXTpzWmjiVKu03lbXhZidGMWveE78";
const LIMIT = "&limit=25";
let gifs = [];
let buttonRight = document.getElementById("slideRight");
let buttonLeft = document.getElementById("slideLeft");
let divGifs = document.getElementById("gifs");

buttonLeft.addEventListener('click', function(){
    let gif = document.getElementById("gifs");    
    gif.scrollLeft -= 500;
})
buttonRight.addEventListener('click', function(){
    document.getElementById("gifs").scrollLeft += 500;
})
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
function addGifs(){
    for (let i = 0; i < gifs.length; i++) {        
        let image = document.createElement("img");        
        image.setAttribute("src", `${gifs[i].images.original.url}`);
        image.style.width = "357px";
        image.style.height = "275px";
        image.style.marginRight = "29px"
        container.appendChild(image);        
    }
}

function addImage() {
  let image = document.createElement("img");
  image.setAttribute("src", "http://via.placeholder.com/357x275");
  container.appendChild(image);
}
callGifs().then(()=>{
    addGifs();
});

