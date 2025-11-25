// Sample playlist
const playlist = [
  {id:1,title:'Only Time - Enya',src:'mp4/onlytime.mp4',type:'video',lyrics:'Lời bài hát\n(English lines...)',vietsub:'...'},
  {id:2,title:'Forever Young - Alphaville',src:'mp4/foreveryoung.mp4',type:'video',lyrics:'...\n(Another line...)',vietsub:'...'},
  {id:3,title:'Leave Out All The Rest - Linkin Park',src:'mp4/LeaveOutAllTheRest.mp4',type:'video',lyrics:'...',vietsub:'...'},
    
{    id: 4,
    title: "Reality - Lost Frequencies ft. Janieck Devy",
    src: "mp4/Reality.mp4",
    type: "video",
    lyrics: `I can fly high, I can go low
Today I got a million, tomorrow I don't know
Decisions as I go, to anywhere I flow
...`,
    vietsub: "..."
},
  {id:5,title:'The Humming - Enya',src:'mp4/thehumming.mp4',type:'video',lyrics:'...',vietsub:'...'},
  {id:6,title:'Bring Me To Life - Evanescence',src:'mp4/BringMeToLife.mp4',type:'video',lyrics:'...',vietsub:'...'},
   {id:7,title:'Disturbed - The Sound of Silence',src:'mp4/TheSoundofSilence.mp4',type:'video',lyrics:'...',vietsub:'...'},
{id:8,title:'Một Đường Nở Hoa (一路生花) - Ôn Dịch Tâm (温奕心)',src:'mp4/motduongnohoa.mp4',type:'video',lyrics:'...',vietsub:'...'},
{id:9,title:'Mad World - Gary Jules',src:'mp4/MadWorld.mp4',type:'video',lyrics:'...',vietsub:'...'}
];

let current = 0;
let mode = {sequential:true, shuffle:false};

const audio = document.getElementById('audioPlayer');
const video = document.getElementById('videoPlayer');
const playlistEl = document.getElementById('playlist');
const currentTitle = document.getElementById('currentTitle');
const status = document.getElementById('status');
const lyricsBox = document.getElementById('lyricsBox');

function renderPlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((t,i)=>{
        const el = document.createElement('div');
        el.className = 'track';
        el.dataset.index = i;
        el.innerHTML = `
          <div>
            <div class="title">▶ ${t.title}</div>
            <div class="meta">${t.type} — ${t.src}</div>
          </div>
        `;
        el.addEventListener('click', ()=>playIndex(i));
        playlistEl.appendChild(el);
    });
    highlightCurrent();
}

function highlightCurrent() {
    document.querySelectorAll('.track').forEach((el,i)=>{
        el.classList.toggle('active', i===current);
    });
}

function playIndex(i){
    if(i<0||i>=playlist.length) return;
    current = i;
    const t = playlist[current];
    currentTitle.textContent = t.title;

    // render lyrics với toggle
    lyricsBox.innerHTML = `
      <div id="lyrContent">
        ${(t.lyrics||'').replace(/\n/g,'<br>')}
        <br><br>---<br>
        <span class="vietsub" style="display:none;">${(t.vietsub||'(chưa có vietsub)').replace(/\n/g,'<br>')}</span>
      </div>
      <div class="toggle-lyrics" id="toggleLyr">Hiện đầy đủ</div>
    `;

    const toggleLyr = document.getElementById("toggleLyr");
    toggleLyr.onclick = () => {
        const vs = lyricsBox.querySelector(".vietsub");
        if(vs.style.display === "none") {
            vs.style.display = "inline";
            lyricsBox.classList.add("expanded");
            toggleLyr.textContent = "Ẩn bớt";
        } else {
            vs.style.display = "none";
            lyricsBox.classList.remove("expanded");
            toggleLyr.textContent = "Hiện đầy đủ";
        }
    };

    status.textContent = 'loading';
    if(t.type==='video'){
        audio.style.display='none'; video.style.display='block';
        video.src = t.src; video.currentTime=0; video.play();
        video.onplay = ()=>status.textContent='playing';
        video.onpause = ()=>status.textContent='paused';
        video.onended = ()=>onTrackEnded();
    } else {
        video.pause(); video.style.display='none'; audio.style.display='block';
        audio.src=t.src; audio.currentTime=0; audio.play();
        audio.onplay=()=>status.textContent='playing';
        audio.onpause=()=>status.textContent='paused';
        audio.onended=()=>onTrackEnded();
    }
    highlightCurrent();
}

function onTrackEnded(){
    if(mode.sequential&&!mode.shuffle){nextTrack();}
    else if(mode.shuffle){playRandom();}
}

function nextTrack(){ playIndex((current+1)%playlist.length); }
function prevTrack(){ playIndex((current-1+playlist.length)%playlist.length); }
function replayTrack(){ 
    const t=playlist[current]; 
    if(!t) return; 
    if(t.type==='video'){video.currentTime=0;video.play();} 
    else {audio.currentTime=0;audio.play();}
}
function playRandom(){ if(playlist.length<=1)return; let idx=current; while(idx===current){idx=Math.floor(Math.random()*playlist.length);} playIndex(idx); }

// buttons
document.getElementById('playBtn').addEventListener('click',()=>{if(video.style.display!=='none'){video.play()} else {audio.play()}});
document.getElementById('pauseBtn').addEventListener('click',()=>{if(video.style.display!=='none'){video.pause()} else {audio.pause()}});
document.getElementById('nextBtn').addEventListener('click',nextTrack);
document.getElementById('prevBtn').addEventListener('click',prevTrack);
document.getElementById('replayBtn').addEventListener('click',replayTrack);
document.getElementById('seqBtn').addEventListener('click',()=>{mode.sequential=true;mode.shuffle=false;toast('Chế độ: Tuần tự');});
document.getElementById('shfBtn').addEventListener('click',()=>{mode.shuffle=true;mode.sequential=false;toast('Chế độ: Ngẫu nhiên');});

// init
renderPlaylist();
playIndex(0);
