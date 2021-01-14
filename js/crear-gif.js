import * as global from "./global.js";
let recorder = RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: function() {
     console.log('started')
   },
});

global.btnComenzar.addEventListener("click",async()=>{    
    try {        
        global.btnComenzar.classList.remove('btn-mas')
        global.btnComenzar.classList.add('none')
        global.cameraWindow.classList.remove('camera-window-content');
        global.cameraWindow.classList.add('none');
        global.cameraWindow2.classList.remove('none');
        global.cameraWindow2.classList.add('camera-window.content');
        await activeCamera()         
    } catch (error) {
        console.log(error);
    }
    
})

async function activeCamera(){
    try {                
        global.video.classList.remove('none');
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video:true
        })
        global.video.srcObject = stream;
        global.video.play()
        global.btnGrabar.classList.remove('none');
        global.btnGrabar.classList.add('btn-mas');
    } catch (error) {
        console.log(error);
    }
}