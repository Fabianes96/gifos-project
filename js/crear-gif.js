import * as global from "./global.js";

global.btnComenzar.addEventListener("click",async()=>{
    try {        
        global.cameraWindow.style.display = 'none'
        global.video.classList.remove('none');
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video:true
        })
        global.video.srcObject = stream;
    } catch (error) {
        console.log(error);
    }
})