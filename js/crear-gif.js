import * as global from "./global.js";
let recorder;
let timeStarted = 0;
let time = document.getElementById("time");
let m = 0;
let s = 0;
let mls = 0;
let form = new FormData();
let misGifs = localStorage.getItem("mis-gifos")
  ? JSON.parse(localStorage.getItem("mis-gifos"))
  : [];
let media = window.matchMedia("screen and (max-width: 850px)");
let burger = document.getElementById("burgerCG");
let burgerDM = document.getElementById("burgerCG-dm");
let burgerClose = document.getElementById("burgerCG-close");
let burgerCloseDM = document.getElementById("burgerCG-close-dm");

function initial() {
    menu.classList.remove("open-hamburger-menu");
    burger.classList.remove("none");
    burger.classList.add("burger-normal");
    burgerDM.classList.remove("none");
    burgerDM.classList.add("burger-dm");
    burgerClose.classList.add("none");
    burgerCloseDM.classList.add("none");   
}
media.addEventListener("change", () => {
    initial();           
});
burger.addEventListener("click", () => {
  global.showHideMenu(burger, "burger-normal", burgerClose);
});
burgerClose.addEventListener("click", () => {
  global.showHideMenu(burger, "burger-normal", burgerClose);
});
burgerDM.addEventListener("click", () => {
  global.showHideMenu(burgerDM, "burger-dm", burgerCloseDM);
});
burgerCloseDM.addEventListener("click", () => {
  global.showHideMenu(burgerDM, "burger-dm", burgerCloseDM);
});
global.nocturnoCG.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){   
      global.nocturnoCG.textContent = "MODO DIURNO";        
      if(media.matches){
        burger.classList.remove("burger-normal");
        burger.classList.add("none");      
        burgerDM.classList.remove("burger-dm");
        burgerDM.classList.add("none");      
        burgerClose.classList.add("none");
        burgerCloseDM.classList.remove("none");
      }else{
        initial();
      }
      localStorage.setItem("modo-nocturno", "on");
    }else{    
      global.nocturnoCG.textContent = "MODO NOCTURNO";
      if(media.matches){
        burger.classList.remove("burger-normal");
        burger.classList.add("none");        
        burgerDM.classList.remove("burger-dm");
        burgerDM.classList.add("none");                
        burgerCloseDM.classList.add("none");
        burgerClose.classList.remove("none");
      }else{
        initial();
      }
      localStorage.setItem("modo-nocturno", "off");
    }
});
global.btnComenzar.addEventListener("click", async () => {
  try {
    global.btnComenzar.classList.remove("btn-mas");
    global.btnComenzar.classList.add("none");
    global.cameraWindow.classList.remove("camera-window-content");
    global.cameraWindow.classList.add("none");
    global.cameraWindow2.classList.remove("none");
    global.cameraWindow2.classList.add("camera-window.content");
    global.pasos.firstElementChild.classList.add("step-active");
    time.style.cursor = "none";
    await activeCamera();
    global.pasos.firstElementChild.classList.remove("step-active");
    global.pasos.children[1].classList.add("step-active");
  } catch (error) {
    console.log(error);
  }
});
global.btnGrabar.addEventListener("click", () => {
  global.btnGrabar.classList.remove("btn-mas");
  global.btnGrabar.classList.add("none");
  global.btnFinalizar.classList.remove("none");
  global.btnFinalizar.classList.add("btn-mas");
  recorder.startRecording();
  startTime();
});
global.btnFinalizar.addEventListener("click", () => {
  stopTime();
  time.textContent = "REPETIR CAPTURA";
  time.style.cursor = "pointer";
  time.addEventListener("click",()=>{
    time.textContent = "00:00:00";
    global.btnSubirGifo.classList.remove("btn-mas");
    global.btnSubirGifo.classList.add("none");
    global.btnComenzar.click();
  })
  time.classList.add("repeat-capture");
  global.btnFinalizar.classList.remove("btn-mas");
  global.btnFinalizar.classList.add("none");
  global.btnSubirGifo.classList.remove("none");
  global.btnSubirGifo.classList.add("btn-mas");
  recorder.stopRecording((recording) => {
    form = new FormData();
    form.append("file", recorder.getBlob(), "myGif.gif");
    console.log(form.get("file"));
  });
});
global.btnSubirGifo.addEventListener("click", async () => {
  global.btnSubirGifo.classList.add("none");
  global.pasos.children[1].classList.remove("step-active");
  global.pasos.lastElementChild.classList.add("step-active");
  global.cronometro.classList.add("none");

  let card = document.createElement("div");
  card.setAttribute("class", "card-icons-cg");

  let divIconDownload = document.createElement("div");
  divIconDownload.setAttribute("class", "div-icons");
  let image1 = document.createElement("img");
  image1.setAttribute("src", "assets/icon-download.svg");
  image1.setAttribute("class", "icono");
  divIconDownload.appendChild(image1);
  let divIconLink = document.createElement("div");
  divIconLink.setAttribute("class", "div-icons");
  let image3 = document.createElement("img");
  image3.setAttribute("src", "assets/icon-link-normal.svg");
  image3.setAttribute("class", "icono");    
  divIconLink.appendChild(image3);  
  divIconLink.addEventListener("click",()=>{
    window.location.assign("index.html#section-mis-gifos");
  })
  global.cardSubiendoGifo.appendChild(card);
  global.cardSubiendoGifo.classList.remove("none");
  global.cardSubiendoGifo.style.display = "flex";
  global.video.classList.add("camera-hover");
  try {
    let response = await fetch(
      `https://upload.giphy.com/v1/gifs?api_key=${global.API_KEY}`,
      {
        method: "POST",
        body: form,
      }
    );
    let res = await response.json();
    let resData = res.data;    
    card.appendChild(divIconDownload);
    card.appendChild(divIconLink);
    global.cardSubiendoGifo.appendChild(card);
    let check = global.cardSubiendoGifo.firstElementChild;
    check.setAttribute("src", "assets/check.svg");
    global.cardSubiendoGifo.children[1].textContent = "GIFO subido con éxito";    
    let resGif = await fetch(
      `https://api.giphy.com/v1/gifs/${resData.id}?api_key=${global.API_KEY}`
    );
    let myGifData = await resGif.json();
    misGifs.push(myGifData.data);    
    divIconDownload.addEventListener("click",()=>{
      global.downloadGif(myGifData.data.images.original.url);
    })
    localStorage.setItem("mis-gifos", JSON.stringify(misGifs));
  } catch (error) {
    global.cardSubiendoGifo.children[1].textContent = "Algo salió mal";
    console.log("Algo salió mal ", error);
  }
});
async function activeCamera() {
  try {
    global.video.classList.remove("none");
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    global.video.srcObject = stream;
    recorder = RecordRTC(stream, {
      type: "gif",
      frameRate: 1,
      quality: 10,
      width: 360,
      hidden: 240,
      onGifRecordingStarted: function () {
        console.log("started");
      },
    });
    global.video.play();
    global.btnGrabar.classList.remove("none");
    global.btnGrabar.classList.add("btn-mas");
  } catch (error) {
    console.log(error);
  }
}
function startTime() {
  setChronometer();
  timeStarted = setInterval(setChronometer, 10);
}
function setChronometer() {
  let st, mt, mlst;
  mls++;
  if (mls > 99) {
    s++;
    mls = 0;
  }
  if (s > 59) {
    m++;
    s = 0;
  }
  mlst = ("0" + mls).slice(-2);
  st = ("0" + s).slice(-2);
  mt = ("0" + m).slice(-2);
  time.textContent = `${mt}:${st}:${mlst}`;
}
function stopTime() {
  clearInterval(timeStarted);
}

global.checkDarkMode(global.nocturnoCG);

