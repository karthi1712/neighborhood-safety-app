const BASE = "https://neighborhood-safety-app.onrender.com/api";
initPage(()=>{
  document.getElementById("app").innerHTML = `
    <h2>Emergency SOS</h2>

    <button onclick="sendSOS()" style="
      background:red;color:white;
      padding:20px;font-size:20px;">
      SEND SOS
    </button>
  `;
});

function sendSOS(){
  navigator.geolocation.getCurrentPosition(pos=>{
    alert("SOS sent with location: "+pos.coords.latitude);
  });
}