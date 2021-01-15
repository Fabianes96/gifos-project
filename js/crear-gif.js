import * as global from "./global.js";
let recorder;
let timeStarted = 0;
let time  = document.getElementById("time");
let m = 0;
let s = 0;
let mls= 0;
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
});
global.btnGrabar.addEventListener("click",()=>{
    global.btnGrabar.classList.remove('btn-mas');
    global.btnGrabar.classList.add('none');
    global.btnFinalizar.classList.remove('none');
    global.btnFinalizar.classList.add('btn-mas');
    recorder.startRecording();
    startTime();
})
global.btnFinalizar.addEventListener("click",()=>{    
    stopTime();
    recorder.stopRecording(async (recording)=>{
        console.log("grabacion ", recording);
        const form = new FormData();
        form.append("file", recorder.getBlob(), "myGif.gif");
        console.log(form.get('file'));
        try {
            let response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${global.API_KEY}`,{
                method: "POST",
                body: form                
            })            
            let res = await response.json()
            let resData = res.data
            console.log(resData); // {id: "LQ90hdO1ePVZtgZ6Oo"}
        } catch (error) {
            console.log("Algo salió mal ", error);
        }
    });
})
async function activeCamera(){
    try {                
        global.video.classList.remove('none');
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video:true
        })
        global.video.srcObject = stream;
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
             console.log('started')
           },
        });
        global.video.play()
        global.btnGrabar.classList.remove('none');
        global.btnGrabar.classList.add('btn-mas');
    } catch (error) {
        console.log(error);
    }
}
function startTime(){        
    setChronometer();
    timeStarted = setInterval(setChronometer,10);    
}
function setChronometer(){
    let st, mt, mlst;
    mls++;    
    if(mls>99){
        s++;
        mls = 0;
    }
    if(s>59){
        m++;
        s = 0;
    }    
    mlst = ('0' + mls).slice(-2);    
    st = ('0'+s).slice(-2);
    mt = ('0' +m ).slice(-2);
    time.textContent = `${mt}:${st}:${mlst}`    
}
function stopTime(){
    clearInterval(timeStarted);
}