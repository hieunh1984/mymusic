  const levelBtns = [...document.querySelectorAll('.level-btn')];
  const songs = [...document.querySelectorAll('.song')];
  const nowTitle = document.getElementById('nowTitle');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const player = document.getElementById('player');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');

  let currentLevel = 'C1';
  let selectedSong = null;
  let playing = false;

  // Update nút play/pause
  function updatePlayBtn() {
    playBtn.textContent = playing ? '⏸️' : '▶️';
  }

  // Lọc bài theo cấp độ
  function getLevelSongs() {
    return songs.filter(s => s.dataset.level === currentLevel);
  }

  // Chọn bài
  function selectSong(song) {
    if (!song) return;

    songs.forEach(s => s.classList.remove('selected'));

    selectedSong = song;
    selectedSong.classList.add('selected');

    const file = selectedSong.dataset.file;

    if (file) {
      // Lấy nội dung file txt
      fetch(file)
        .then(response => response.text())
        .then(text => {
          nowTitle.innerHTML = text; // <br> trong file sẽ xuống dòng
        })
        .catch(err => {
          nowTitle.textContent = "Không tải được nội dung";
          console.error(err);
        });
    } else {
      nowTitle.innerHTML = selectedSong.dataset.title || "— Chưa có bài được chọn —";
    }

    player.src = selectedSong.dataset.src;
    playing = true;
    player.play();
    updatePlayBtn();

    const level = selectedSong.dataset.level;
    currentLevel = level;
    levelBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.level === level));

    songs.forEach(s => {
      s.style.opacity = s.dataset.level === level ? "1" : "0.45";
    });
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

  // ----------------------
  // Thanh nhạc
  player.addEventListener('timeupdate', () => {
    const progress = (player.currentTime / player.duration) * 100;
    seekBar.value = progress || 0;

    currentTimeEl.textContent = formatTime(player.currentTime);
    durationEl.textContent = formatTime(player.duration);
  });

  // Khi người kéo thanh
  seekBar.addEventListener('input', () => {
    const time = (seekBar.value / 100) * player.duration;
    player.currentTime = time;
  });

  // Format thời gian hiển thị
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0'+sec : sec}`;
  }
