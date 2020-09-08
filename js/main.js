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
        let square = document.createElement('div'); 
        square.setAttribute('class', 'square');    

        let card = document.createElement('div');
        card.setAttribute('class', 'card-icons')      

        let divIconFav = document.createElement('div');       
        divIconFav.setAttribute('class', 'div-icons');
        let image1 = document.createElement('img')
        image1.setAttribute('src', 'assets/icon-fav-hover.svg'); 
        image1.setAttribute('class', 'icono');       
        divIconFav.appendChild(image1);
        card.appendChild(divIconFav);

        let divIconDownload = document.createElement('div');       
        divIconDownload.setAttribute('class', 'div-icons');
        let image2 = document.createElement('img')
        image2.setAttribute('src', 'assets/icon-download.svg');
        image2.setAttribute('class', 'icono');
        divIconDownload.appendChild(image2);
        card.appendChild(divIconDownload);

        let divIconMax = document.createElement('div');       
        divIconMax.setAttribute('class', 'div-icons');
        let image3 = document.createElement('img')
        image3.setAttribute('src', 'assets/icon-max.svg');
        image3.setAttribute('class', 'icono');
        divIconMax.appendChild(image3);   
        card.appendChild(divIconMax);
        
        square.appendChild(card)

        let gif = document.createElement("img");
        gif.setAttribute("src", `${gifs[i].images.original.url}`);
        gif.setAttribute("class", 'gifos');
        gif.style.minWidth = "357px";
        gif.style.minHeight = "275px"  ;      
        square.appendChild(gif);
        let divParagraphs = document.createElement('div');
        divParagraphs.setAttribute("class", 'div-description');
        let p1 = document.createElement('p');
        p1.textContent = `${gifs[i].username}`;
        let p2 = document.createElement("p");
        p2.textContent = `${gifs[i].title}`;
        divParagraphs.appendChild(p1);
        divParagraphs.appendChild(p2);
        square.appendChild(divParagraphs);
        container.appendChild(square);
        
        // let image = document.createElement("img");                
        // image.setAttribute("src", `${gifs[i].images.original.url}`);
        // image.style.width = "357px";
        // image.style.height = "275px";
        // image.style.marginRight = "29px";            
        // div.appendChild(image);                
        
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

