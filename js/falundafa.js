const levelBtns = [...document.querySelectorAll('.level-btn')];
const songs = [...document.querySelectorAll('.song')];
const nowTitle = document.getElementById('nowTitle');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const player = document.getElementById('player');

let currentLevel = 'C1';
let selectedSong = null;
let playing = false;

// Update nút play/pause
function updatePlayBtn() {
  playBtn.textContent = playing ? '⏸' : '▶️';
}

// Lọc bài theo cấp độ
function getLevelSongs() {
  return songs.filter(s => s.dataset.level === currentLevel);
}

// Chọn bài
function selectSong(song) {
  if (!song) return;
  if (selectedSong) selectedSong.classList.remove('selected');
  selectedSong = song;
  selectedSong.classList.add('selected');

  nowTitle.textContent = selectedSong.dataset.title;

  // Gán nhạc
  player.src = selectedSong.dataset.src;

  // Tự động phát
  playing = true;
  player.play();
  updatePlayBtn();
}

// Đổi cấp độ
function setLevel(level) {
  currentLevel = level;

  // Cập nhật nút
  levelBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.level === level));

  // Mờ bài không cùng cấp độ
  songs.forEach(song => {
    song.style.opacity = song.dataset.level === level ? "1" : "0.45";
  });

  // Reset bài đang chọn
  selectedSong = null;
  player.pause();
  playing = false;
  updatePlayBtn();
  nowTitle.textContent = "— Chưa có bài được chọn —";

  // Chọn bài đầu tiên của cấp độ mới
  const list = getLevelSongs();
  if (list.length > 0) {
    selectSong(list[0]);
  }
}

// Prev bài
prevBtn.addEventListener('click', () => {
  const list = getLevelSongs();
  if (!selectedSong) return;
  let i = list.indexOf(selectedSong);
  if (i > 0) selectSong(list[i - 1]);
});

// Next bài
nextBtn.addEventListener('click', () => {
  const list = getLevelSongs();
  if (!selectedSong) return;
  let i = list.indexOf(selectedSong);
  if (i < list.length - 1) selectSong(list[i + 1]);
});

// Auto next
player.addEventListener("ended", () => {
  const list = getLevelSongs();
  if (!selectedSong) return;
  let i = list.indexOf(selectedSong);
  if (i < list.length - 1) {
    selectSong(list[i + 1]);
  } else {
    playing = false;
    updatePlayBtn();
  }
});

// Click vào bài
songs.forEach(song => {
  song.addEventListener("click", () => selectSong(song));
});

// Click play/pause
playBtn.addEventListener("click", () => {
  if (!selectedSong) {
    const first = getLevelSongs()[0];
    if (first) selectSong(first);
    return;
  }
  playing = !playing;
  playing ? player.play() : player.pause();
  updatePlayBtn();
});

// Click chọn cấp độ
levelBtns.forEach(btn => btn.addEventListener("click", () => setLevel(btn.dataset.level)));

// Khởi động
setLevel(currentLevel);
updatePlayBtn();
