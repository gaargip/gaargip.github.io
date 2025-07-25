// --- Global Variables ---
let timerInterval;
let endTime;
let slideshowTimeout;
const SLIDESHOW_INTERVAL = 8000;
let slideIndex = 0;
let isSlideshowPaused = false;

let timerSettings = {
    hours: 1,
    minutes: 0,
    alarm1: 5,
    alarm2: 10,
    alarm3: 20,
    alarm4: 40
};

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    goHome();
    updateLiveTime();
    updateLiveDate();
    // Set up the checkpoint calculator
    calculateCheckpoints();
    document.getElementById('finish-time-input').addEventListener('change', calculateCheckpoints);
    setInterval(updateLiveTime, 1000);
});

// --- Core Navigation ---
function setActiveButton(activeBtnId){const t=document.querySelectorAll(".main-nav-btn");t.forEach(e=>{e.classList.remove("active-nav-btn")});const e=document.getElementById(activeBtnId);e&&e.classList.add("active-nav-btn")}
function goHome(){setActiveButton("btn-home"),clearTimeout(slideshowTimeout);const e=document.getElementById("page-content");e.innerHTML='\n        <div class="slideshow-wrapper">\n            <div id="slideshow-container">\n                <img class="slide" src="images/slide1.png"><img class="slide" src="images/slide2.png"><img class="slide" src="images/slide3.gif"><img class="slide" src="images/slide4.gif"><img class="slide" src="images/slide5.gif"><img class="slide" src="images/slide6.png"><img class="slide" src="images/slide7.png">\n            </div>\n            <div id="slideshow-controls">\n                <button id="prev-btn" class="control-btn">◁</button><button id="pause-play-btn" class="control-btn">||</button><button id="next-btn" class="control-btn">▷</button>\n            </div>\n            <div id="progress-bar"></div>\n        </div>\n    ',initializeSlideshow()}
function loadPage(e){setActiveButton(`btn-${e.toLowerCase()}`),clearTimeout(slideshowTimeout),document.getElementById("total-hours-input")&&(timerSettings.hours=parseInt(document.getElementById("total-hours-input").value)||0,timerSettings.minutes=parseInt(document.getElementById("total-minutes-input").value)||0,timerSettings.alarm1=parseInt(document.getElementById("alarm-input-1").value)||0,timerSettings.alarm2=parseInt(document.getElementById("alarm-input-2").value)||0,timerSettings.alarm3=parseInt(document.getElementById("alarm-input-3").value)||0,timerSettings.alarm4=parseInt(document.getElementById("alarm-input-4").value)||0);const t=document.getElementById("page-content");let l="";const n=e=>`\n        <div class="timer-container" data-alarm-prefix="${e}">\n            <div class="timer-display-wrapper">\n                <div id="timer-display">00:00:00</div>\n                <div class="font-controls">\n                    <button class="font-btn" onclick="changeFontSize(5)">+</button>\n                    <button class="font-btn" onclick="changeFontSize(-5)">-</button>\n                </div>\n            </div>\n            <div class="timer-inputs">\n                <div class="input-row">\n                    <label>Total Time:</label>\n                    <input type="number" id="total-hours-input" min="0" placeholder="HH" value="${timerSettings.hours}"><input type="number" id="total-minutes-input" min="0" max="59" placeholder="MM" value="${timerSettings.minutes}">\n                </div>\n                <div class="input-row">\n                    <label>Alarm at (mins left):</label>\n                    <input type="number" id="alarm-input-4" value="${timerSettings.alarm4}"><input type="number" id="alarm-input-3" value="${timerSettings.alarm3}"><input type="number" id="alarm-input-2" value="${timerSettings.alarm2}"><input type="number" id="alarm-input-1" value="${timerSettings.alarm1}">\n                </div>\n            </div>\n            <div class="timer-controls">\n                <button class="timer-btn start-btn" onclick="startTimer()">Start</button><button class="timer-btn stop-btn" onclick="stopTimer()">Stop</button>\n            </div>\n        </div>`;switch(e){case"Listening":l=`\n                <div class="test-page-wrapper">\n                    <div class="instructions-section" contenteditable="true">\n                        <h2>Listening Test Instructions</h2>\n                        <ul>\n                            <li>Make sure that you write on the Listening side of the Answer Sheet, which is <span style="color: green;">Highlighted in green</span>.</li>\n                            <li>You must use a pen provided.</li>\n                            <li>Write your full name in capital letters exactly as it appears in your Passport and your desk label</li>\n                            <li>The Listening Test will take about 30 minutes. Remember, no bathroom breaks are permitted during the Listening Test.</li>\n                            <li>The CD will give you 10 minutes at the end to transfer your answers to the Answer Sheet.</li>\n                            <li>As you listen to the recording, write your answers in the Question Booklet.</li>\n                            <li>At the end of the test, if you continue to write after you have been asked to stop, you may not receive a Test Report Form.</li>\n                            <li>You do not lose marks for wrong answers, so try to answer all questions.</li>\n                        </ul>\n                    </div>\n                </div>`;break;case"Reading":l=`<div class="test-page-wrapper">${n("alarm")}<div class="instructions-section" contenteditable="true"><h2>Reading Test Instructions</h2><ul><li>This test consists of 3 sections with 40 questions.</li><li>You have 60 minutes to complete the test.</li><li>Read each passage and answer the questions that follow.</li></ul></div></div>`;break;case"Writing":l=`<div class="test-page-wrapper">${n("walarm")}<div class="instructions-section" contenteditable="true"><h2>Writing Test Instructions</h2><ul><li>This test consists of 2 tasks.</li><li>Task 1 requires at least 150 words. Task 2 requires at least 250 words.</li><li>You have 60 minutes to complete both tasks.</li></ul></div></div>`}t.innerHTML=l,timerInterval&&updateTimerDisplay()}

// --- Slideshow Functionality ---
function initializeSlideshow(){isSlideshowPaused=!1;slideIndex=0;const e=document.querySelectorAll(".slide"),t=document.getElementById("progress-bar");t.innerHTML="";e.forEach((e,l)=>{const n=document.createElement("div");n.classList.add("progress-dot"),n.addEventListener("click",()=>jumpToSlide(l)),t.appendChild(n)}),document.getElementById("pause-play-btn").addEventListener("click",togglePausePlay),document.getElementById("next-btn").addEventListener("click",nextSlide),document.getElementById("prev-btn").addEventListener("click",prevSlide),showSlide(),resetAndPlay()}
function resetAndPlay(){clearTimeout(slideshowTimeout),isSlideshowPaused||(slideshowTimeout=setTimeout(()=>{slideIndex++,showSlide(),resetAndPlay()},SLIDESHOW_INTERVAL))}
function showSlide(){const e=document.querySelectorAll(".slide"),t=document.querySelectorAll(".progress-dot");if(0!==e.length){slideIndex>=e.length&&(slideIndex=0),slideIndex<0&&(slideIndex=e.length-1),e.forEach(e=>e.style.display="none"),t.forEach(e=>e.classList.remove("active")),e[slideIndex].style.display="block",t[slideIndex].classList.add("active")}}
function togglePausePlay(){isSlideshowPaused=!isSlideshowPaused;const e=document.getElementById("pause-play-btn");e.innerHTML=isSlideshowPaused?"▶︎":"||",isSlideshowPaused?clearTimeout(slideshowTimeout):resetAndPlay()}
function nextSlide(){slideIndex++,showSlide(),resetAndPlay()}
function prevSlide(){slideIndex--,showSlide(),resetAndPlay()}
function jumpToSlide(e){slideIndex=e,showSlide(),resetAndPlay()}

// --- Timers and Clocks ---

// UPDATED: Replaced populateTimeDropdowns with new checkpoint logic
function calculateCheckpoints() {
    const finishTimeInput = document.getElementById('finish-time-input');
    if (!finishTimeInput.value) return; // Exit if no time is set

    const [hour, minute] = finishTimeInput.value.split(':').map(Number);
    
    const finishDate = new Date();
    finishDate.setHours(hour, minute, 0, 0);

    const checkpoints = [40, 20, 10, 5];
    checkpoints.forEach(mins => {
        const checkpointDate = new Date(finishDate.getTime());
        checkpointDate.setMinutes(finishDate.getMinutes() - mins);
        document.getElementById(`finish-minus-${mins}`).textContent = formatTime(checkpointDate);
    });
}

function formatTime(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // The hour '0' should be '12'
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

function updateLiveTime() {
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        timeDisplay.textContent = new Date().toLocaleTimeString('en-US');
    }
}

function updateLiveDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateElement.textContent = `${day}/${month}/${year}`;
    }
}

function changeFontSize(amount) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    let currentSize = window.getComputedStyle(timerDisplay, null).getPropertyValue('font-size');
    let newSize = parseFloat(currentSize) + amount;
    timerDisplay.style.fontSize = newSize + 'px';
}

function startTimer() {
    const hours = parseInt(document.getElementById('total-hours-input').value) || 0;
    const minutes = parseInt(document.getElementById('total-minutes-input').value) || 0;
    const totalSeconds = (hours * 3600) + (minutes * 60);
    if (totalSeconds <= 0) return;
    clearInterval(timerInterval);
    endTime = Date.now() + totalSeconds * 1000;
    timerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    endTime = null;
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = "00:00:00";
    }
}

function playAlarm(soundFile) {
    const alarm = document.getElementById('timer-alarm');
    alarm.src = `sounds/${soundFile}`;
    alarm.play();
}

function updateTimerDisplay() {
    if (!endTime) return; 

    const remaining = endTime - Date.now();
    const secondsLeft = Math.round(remaining / 1000);
    
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    if (secondsLeft < 0) {
        playAlarm('Alarm0.mp3');
        stopTimer(); 
        return;
    }
    
    const timerContainer = document.querySelector('.timer-container');
    const alarmPrefix = timerContainer ? timerContainer.dataset.alarmPrefix : null;
    const seconds = secondsLeft % 60;
    
    if (alarmPrefix && seconds === 0) {
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const alarmVal1 = parseInt(document.getElementById('alarm-input-1').value);
        const alarmVal2 = parseInt(document.getElementById('alarm-input-2').value);
        const alarmVal3 = parseInt(document.getElementById('alarm-input-3').value);
        const alarmVal4 = parseInt(document.getElementById('alarm-input-4').value);

        if (minutes === alarmVal1) playAlarm(`${alarmPrefix}5.mp3`);
        if (minutes === alarmVal2) playAlarm(`${alarmPrefix}10.mp3`);
        if (minutes === alarmVal3) playAlarm(`${alarmPrefix}20.mp3`);
        if (minutes === alarmVal4) playAlarm(`${alarmPrefix}40.mp3`);
    }
}