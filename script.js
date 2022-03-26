const jsmediatags = window.jsmediatags;
const image = document.querySelector("img");
const inputFiles = document.getElementById("file-input");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prev = document.getElementById("prev");
const play = document.getElementById("play");
const next = document.getElementById("next");
let image_blur = 'https://e-cdns-images.dzcdn.net/images/cover/256d2f17d6dfde632b845e757ac41746/500x500-000000-80-0-0.jpg';
let isPlaying = false;
let currentSongIndex = 0;
let songList = [];

function playSong() {
    document.body.style.backgroundImage = `url('${image_blur}')`;
    play.classList.replace("fa-play", "fa-pause");
    play.setAttribute("title", "Pause");
    if (!isPlaying) {
        music.play();
    }
    isPlaying = true;
}

function pauseSong() {
    isPlaying = false;
    document.body.style.backgroundImage = '';
    play.classList.replace("fa-pause", "fa-play");
    play.setAttribute("title", "Play");
    music.pause();
}

function updateProgressBar(event) {
    if (isPlaying) {
        const { currentTime, duration } = event.srcElement;
        progress.style.width = `${(currentTime / duration) * 100}%`;
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }
        const currentTimeMinutes = Math.floor(currentTime / 60);
        let currentTimeSeconds = Math.floor(currentTime % 60);
        if (currentTimeSeconds < 10) {
            currentTimeSeconds = `0${currentTimeSeconds}`;
        }
        if (!durationSeconds) {
            durationEl.textContent = '0:00';
        }
        else {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        currentTimeEl.textContent = `${currentTimeMinutes}:${currentTimeSeconds}`;
    }
}

function setProgressBar(event) {
    const width = this.clientWidth;
    const clicks = event.offsetX;
    const { duration } = music;
    music.currentTime = (clicks / width) * duration;
}

function playNext() {
    isPlaying = false;
    currentSongIndex++;
    if (currentSongIndex > songList.length - 1)
    {
        currentSongIndex = 0;
    }
    newAudioFile(currentSongIndex)
}

function playPrevious() {
    isPlaying = false;
    currentSongIndex--;
    if (currentSongIndex === -1)
    {
        currentSongIndex = songList.length - 1;
    }
    console.log(currentSongIndex);
    newAudioFile(currentSongIndex);
}

function newAudioFile(index) {
    const file = songList[index];
    jsmediatags.read(file, {
        onSuccess: function (tag) {
            console.log(tag.tags.artist);
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
            }
			titleEl.textContent = tag.tags.title;
			artistEl.textContent = tag.tags.artist;
			image.src = image_blur = `data:${format};base64,${window.btoa(base64String)}`;
			music.src = URL.createObjectURL(file);
            console.log(URL.createObjectURL(file))
			music.load();
			playSong();
        },
        onError: function (error) {
            console.log(error);
        },
    });
}

function loadAudioFiles(event) {
    var files = this.files;
    var file;
    for (var i = 0; i < files.length; i++) {
        file = files.item(i);
        file = files[i];
        songList.push(file);
    }
    if (!isPlaying) {
        newAudioFile(currentSongIndex);
    }
}

inputFiles.addEventListener("change", loadAudioFiles);
play.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);
next.addEventListener('click', playNext);
prev.addEventListener('click', playPrevious);
music.addEventListener('ended', playNext);