//Get All necessary elements from the DOM
const audio = document.querySelector("#audio");
const musicImg = document.querySelector(".image-area img");
const playBtn = document.querySelector("#mainPlayBtn");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const trackTitle = document.querySelector(".track-title");
const artistName = document.querySelector(".artist-name");
const slider = document.querySelector(".slider");
const thumb = document.querySelector(".slider-thumb");
const progress = document.querySelector(".progress");
const time = document.querySelector(".time");
const fullTime = document.querySelector(".fulltime");
const volumeSlider = document.querySelector(".volume-slider .slider");
const volumeProgress = document.querySelector(".volume-slider .progress");
const volumeIcon = document.querySelector(".volume-icon");
const wave = document.getElementById("wave");
const musicList = document.querySelector(".music-list");
const moreMusicBtn = document.querySelector("#more-music");
const closemoreMusic = musicList.querySelector("#close");

//Global Variables
//Is the track playing
let trackPlaying = false;
//Is the volume muted
let volumeMuted = false;
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

//Add a click event on the play button
playBtn.addEventListener("click", playTrack);

//Play Track Function
function playTrack() {
    //If the audio is not playing
    if (trackPlaying === false) {
        //Play the audio
        // Add Wave
        wave.classList.add("loader");
        // Make Image Rotate
        musicImg.classList.add("rotate");
        audio.play();
        //Add a pause icon inside the button
        playBtn.innerHTML = `
      <span class="material-symbols-outlined">
        pause
      </span>
    `;
        /*Set the trackPlaying to true,
    because the track is now playing*/
        trackPlaying = true;
        /*Otherwise, if it is playing*/
    } else {
        //Pause the audio
        // Remove Wave when pausing the audio
        wave.classList.remove("loader");
        // Remove Rotate Image when pausing the audio
        musicImg.classList.remove("rotate");
        audio.pause();
        //Add a play icon inside the button
        playBtn.innerHTML = `
      <span class="material-symbols-outlined">
        play_arrow
      </span>
    `;
        /*Set the trackPlaying to false,
    because the track is now paused again*/
        trackPlaying = false;
    }
}

function playMusic() {
    // document.classList.add("paused");
    wave.classList.add("loader");
    musicImg.classList.add("rotate");
    playBtn.innerHTML = `
      <span class="material-symbols-outlined">
        pause
      </span>
    `;
    audio.play();
}

function pauseTrack() {
    document.classList.remove("paused");
    wave.classList.remove("loader");
    musicImg.classList.remove("rotate");
    playBtn.innerHTML = `
      <span class="material-symbols-outlined">
        pause
      </span>
    `;

    audio.pause();
}

// play or pause button event
// playPauseBtn.addEventListener("click", () => {
//     const isMusicPlay = document.classList.contains("paused");
//     //if isPlayMusic is true then call pauseMusic else call playMusic
//     isMusicPlay ? pauseTrack() : playTrack();
//     playFromPlayList();
// });

window.addEventListener("load", () => {
    loadTrack(musicIndex);
    playFromPlayList();
});

function loadTrack(indexNumb) {
    trackTitle.innerHTML = allMusic[indexNumb - 1].name;
    artistName.innerHTML = allMusic[indexNumb - 1].artist;
    musicImg.src = `assets/images/${allMusic[indexNumb - 1].img}.jpg`;
    audio.src = `assets/music/${allMusic[indexNumb - 1].src}.mp3`;

    //Set the timeline slider to the beginning
    progress.style.width = 0;
    thumb.style.left = 0;
    //Wait for the audio data to load
    audio.addEventListener("loadeddata", () => {
        //Display the duration of the audio file
        setTime(fullTime, audio.duration);
        //Set max value to slider
        slider.setAttribute("max", audio.duration);
    });
}

//Switching tracks function
function switchTrack() {
    //If the audio IS playing
    if (trackPlaying === true) {
        //Keep playing the audio
        audio.play();
    }
}

//Set click event to previous button
btnPrev.addEventListener("click", () => {
    //Decrement track id
    musicIndex--;
    //If the track id goes below 0
    musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
    //Load the track
    loadTrack(musicIndex);
    //Run the switchTrack function
    switchTrack();
});

//Set click event to next button
btnNext.addEventListener("click", nextTrack);

//Next track function
function nextTrack() {
    //Increment track id
    musicIndex++;
    musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    //Load the track
    loadTrack(musicIndex);
    //Run the switchTrack function
    switchTrack();
}

//When the audio ends, switch to next track
audio.addEventListener("ended", nextTrack);

//Format the time
function setTime(output, input) {
    //Calculate minutes from input
    const minutes = Math.floor(input / 60);
    //Calculate seconds from input
    const seconds = Math.floor(input % 60);

    //If the seconds are under 10
    if (seconds < 10) {
        //Add a zero before the first number
        output.innerHTML = minutes + ":0" + seconds;
        //If it is over 10
    } else {
        //Output the time without a zero
        output.innerHTML = minutes + ":" + seconds;
    }
}

//Output the audio track duration

//When the time changes on the audio track
audio.addEventListener("timeupdate", () => {
    //Get the current audio time
    const currentAudioTime = Math.floor(audio.currentTime);
    //Get the percentage
    const timePercentage = (currentAudioTime / audio.duration) * 100 + "%";
    //Output the current audio time
    setTime(time, currentAudioTime);
    //Set the slider progress to the percentage
    progress.style.width = timePercentage;
    thumb.style.left = timePercentage;
});

//Function for handling the slider values
function customSlider() {
    //Get the percentage
    const val = (slider.value / audio.duration) * 100 + "%";
    //Set the thumb and progress to the current value
    progress.style.width = val;
    thumb.style.left = val;
    //Output the audio current time
    setTime(time, slider.value);
    //Set audio current time to slider value
    audio.currentTime = slider.value;
}

//Call function initially
customSlider();

//Repeat the function when the slider is selected
slider.addEventListener("input", customSlider);

//Volume slider current value
let val;

//Volume Slider
function customVolumeSlider() {
    //Get max attribute value from slider
    const maxVal = volumeSlider.getAttribute("max");
    //Get the percentage
    val = (volumeSlider.value / maxVal) * 100 + "%";
    //Set the thumb and progress to the current value
    volumeProgress.style.width = val;
    //Set the audio volume to current value
    audio.volume = volumeSlider.value / 100;
    //Change volume icons
    //If the volume is high
    if (audio.volume > 0.5) {
        //Set the volume up icon
        volumeIcon.innerHTML = `
      <span class="material-symbols-outlined">
        volume_up
      </span>
    `;
        //If the volume is muted
    } else if (audio.volume === 0) {
        //Set the mute icon
        volumeIcon.innerHTML = `
      <span class="material-symbols-outlined">
        volume_off
      </span>
    `;
        //if the volume is low
    } else {
        //Set the volume down icon
        volumeIcon.innerHTML = `
      <span class="material-symbols-outlined">
        volume_down
      </span>
    `;
    }
}

//Run the volume slider function
customVolumeSlider();

/*Run the function again on when
the volume slider is selected*/
volumeSlider.addEventListener("input", customVolumeSlider);

//Add a click event to the volume icon
volumeIcon.addEventListener("click", () => {
    //If the volume is not muted
    if (volumeMuted === false) {
        //Set the muted volume icon
        volumeIcon.innerHTML = `
      <span class="material-symbols-outlined">
        volume_off
      </span>
    `;
        //Mute the audio
        audio.volume = 0;
        //Set the volume slider to zero
        volumeProgress.style.width = 0;
        /*Set the volumeMuted to true,
    because the volume is now muted*/
        volumeMuted = true;
        //If the volume is muted
    } else {
        //Set the volume down icon
        volumeIcon.innerHTML = `
      <span class="material-symbols-outlined">
        volume_down
      </span>
    `;
        /*Unmute the volume by
    setting it to anything above zero*/
        audio.volume = 0.5;
        //Set the volume progress slider to the current value
        volumeProgress.style.width = val;
        /*Set the volumeMuted to false,
    because the volume is no longer muted*/
        volumeMuted = false;
    }
});

// Show PlayList
moreMusicBtn.addEventListener("click", showPlayList);
function showPlayList() {
    musicList.classList.toggle("show");
}

// Hide PlayList
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});

function hidePlayList() {
    musicList.classList.toggle("show");
}

const ulTag = document.querySelector("ul");
// Create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
    //Pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span class="material-symbols-outlined" style=" background: linear-gradient(-90deg, #335bf4 0%, #2ae9c9 100%); border-radius: 50%; color: #ddd; "> play_arrow </span>
                <audio class="${allMusic[i].src}" src="assets/tracks/${
        allMusic[i].src
    }.mp3"></audio>
              </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
}

//play particular song from the list onclick of li tag
function playFromPlayList() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

//particular li clicked function
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadTrack(musicIndex);
    playMusic();
    hidePlayList();
    playFromPlayList();
}
