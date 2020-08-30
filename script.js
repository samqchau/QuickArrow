


/* Things to work on
1. Settings (Amount of time Drop down Menu);
2. Anitmations (Keypress)
3. Buttons

*/

//Game Variables
let timer;
let score = 0;
let combo = null;
let currentArray = [];
let nextArray = [];
let waveNumber = 0;
//record number of combos
let maxCombos = 0;
//highest combo for this game
let highestCombo = 0;
let highScore = 0;
let timestamp;
let selectedTime = 60;
let runningTimeInMili;
let keysCorrect = 0;
let keysWrong = 0;
let highestWave = 0;
let isPaused = false;
let gameTimeLeft = 0;
let gameRestarted = false;
let arrowsPerMinute;
let speedRecord = 0;
let speedRecordText = document.querySelector('.speed-record');

let comboText = document.querySelector('.combo');
let scoreText = document.querySelector('.score');
let maxCombosText = document.querySelector('.max-combos');
let highScoreText = document.querySelector('.high-score');
let startButton = document.querySelector('.start-button');
let textToUser = document.querySelector('.text-to-user');
let currentSet = document.querySelector('.current-set');
let nextSet = document.querySelector('.next-set');
let testButton = document.querySelector('.test-button');
let restartButton = document.querySelector('.restart-button');
let pauseButton = document.querySelector('.pause-button');
let roundScoreText = document.querySelector('.round-score');
let highestComboText = document.querySelector('.round-highest-combo');
let arrowsHitText = document.querySelector('.arrows-hit');
let arrowsMissedText = document.querySelector('.arrows-missed');
let percentCorrectText = document.querySelector('.percent-correct');
let wavesCompletedText = document.querySelector('.waves-completed');
let keysPressedText = document.querySelector('.keys-pressed');
let highestWaveText = document.querySelector('.highest-wave');
let arrowsPerMinuteText = document.querySelector('.arrows-per-minute');
let roundContainer = document.querySelector('.round-container');

//audio
let keyTap = document.body.querySelectorAll('#audio1');
let keyTapTracker = 0;
function playKepTap(){
    keyTap[keyTapTracker%5].play();
    keyTapTracker++;
}

let correctKey = document.body.querySelectorAll('#audio2');
let correctKeyTracker = 0;
function playCorrectKey(){
    correctKey[correctKeyTracker%5].play();
    correctKeyTracker++;
}

let wrongKey = document.body.querySelectorAll('#audio3');
let wrongKeyTracker = 0;
function PlayWrongKey(){
    wrongKey[wrongKeyTracker%5].play();
    wrongKeyTracker++;
}

let arrowMap = ['images/Up.png','images/Right.png','images/Down.png','images/Left.png'];
let arrowValuesMap = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3
};

restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', Countdown);
pauseButton.addEventListener('click', TogglePause);

restartButton.style.display = 'none';
pauseButton.disabled = true;
pauseButton.style.visibility = 'hidden';

function TogglePause(){
    if(isPaused === false){
        pauseButton.textContent = 'Resume';
        textToUser.textContent = 'Paused';
    } else{
        pauseButton.textContent = 'Pause';
        gameTimeLeft = timer;

    }
    isPaused = !isPaused;
    timestamp = Date.now();
}

function changePrompt(myString){
    textToUser.textContent = myString;
}

function Countdown(){
    isPaused = false;
    pauseButton.textContent = 'Pause';
    highestCombo = 0;
    score = 0;
    combo = 0;
    waveNumber = 0;
    keysCorrect = 0;
    gameTimeLeft = selectedTime;
    removeAllChildNodes(currentSet);
    removeAllChildNodes(nextSet);
    currentArray = [];
    nextArray = [];

    scoreText.innerHTML = null;
    comboText.textContent = null;
    restartButton.style.display = 'block';
    restartButton.disabled = true;
    startButton.style.display = 'none';
    textToUser.style.display = 'block';
    setTimeout(changePrompt, 500, 'Ready');
    setTimeout(changePrompt, 1000, 'Set');
    setTimeout(changePrompt, 1500, 'Go!');
    setTimeout(startGame, 2000);
    setTimeout(GameRestartedFalse, 2000);
}

function GameRestartedFalse(){
    gameRestarted = false;
    restartButton.disabled = false;
    pauseButton.style.visibility = 'visible';
    pauseButton.disabled = false;
    ClearStatsWindow();
    scoreText.innerHTML = '0';
    comboText.innerHTML = '0';
    combo.text
}

function startGame(){
    //addEventListener to accept input for arrowkeys
    //countdown from selected time
    setTimeout(changePrompt(null),500);
    generateArrows(currentSet);
    generateArrows(nextSet);
    window.addEventListener('keydown', ArrowKeyListener);
    timestamp = Date.now();

    const stopClock = setInterval(function(){
        scoreText.innerHTML = score;
        if(gameRestarted === true){
            clearInterval(stopClock);
        }
        
        if(isPaused === false){
            currentSet.style.display = 'block';
            nextSet.style.display = 'block';
            runningTimeInMili = Date.now() - timestamp;
            timer = Math.floor(gameTimeLeft - runningTimeInMili/1000);
            textToUser.textContent = timer;
        
            if(timer <= 0){
                clearInterval(stopClock);
                endGame();
            }
        }

        else{
            currentSet.style.display = 'none';
            nextSet.style.display = 'none';
            //textToUser.textContent = 'Paused';
        }

    }, 20);
}

function generateArrows(parentContainer){
    if(waveNumber === 0){
        for(let i = 0; i < 9; i++){
            let img = document.createElement('img');
            let num = oneThruFour();
            img.src = arrowMap[num];
            currentArray.push(num);
            parentContainer.appendChild(img);
        }
        waveNumber++; 
    }
    else{
        for(let i = 0; i < 9; i++){
            let img = document.createElement('img');
            let num = oneThruFour();
            img.src = arrowMap[num];
            nextArray.push(num);
            parentContainer.appendChild(img);
        }
        waveNumber++;
    }
}

function waveCompleted(){
    score += (waveNumber-1) * 100;
    //scoreText.innerHTML = score;
}

function oneThruFour(){
    return Math.floor(Math.random()*4);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function ArrowKeyListener(event){
    {
        if(event.keyCode<=40 && event.keyCode >= 37){
            playKepTap();
            
            if(currentArray[0]===arrowValuesMap[event.key]){
                playCorrectKey();
                currentSet.childNodes[9-currentArray.length].style.backgroundColor = '#A0D365';
                score += 100 + 100 * combo/10;
                //scoreText.innerHTML = score;
                combo += 1;
                keysCorrect++;
                comboText.textContent = combo;
                currentArray.shift();
            }
            else{
                currentSet.childNodes[9-currentArray.length].style.backgroundColor = '#D365A0';
                PlayWrongKey();

                keysWrong++;
                combo = 0;
            }

            if(currentArray.length === 0){
                waveCompleted();
                removeAllChildNodes(currentSet);
                removeAllChildNodes(nextSet);
                currentArray = nextArray;
                nextArray = [];
                for(let i = 0; i < currentArray.length; i++){
                    let img = document.createElement('img');
                    img.src = arrowMap[currentArray[i]];
                    currentSet.appendChild(img);
                }
                
                generateArrows(nextSet);
            }
            if(score>highScore){
                highScore = score;
                highScoreText.textContent = `high score: ${highScore}`;
            }
            if(combo > highestCombo){
                highestCombo = combo;
            }
            if(highestCombo > maxCombos){
                maxCombos = highestCombo;
                maxCombosText.textContent = `highest combos: ${maxCombos}`;
            }

            if(waveNumber-2 > highestWave){
                highestWave = waveNumber - 2;
                highestWaveText.textContent = `highest wave: ${highestWave}`;
            }
        }
    }
}

function endGame(){
    window.removeEventListener('keydown', ArrowKeyListener);
    textToUser.textContent = 'Game Over';
    pauseButton.style.visibility = 'hidden';
    arrowsPerMinute = 60/selectedTime*(keysCorrect);
    if(arrowsPerMinute > speedRecord){
        speedRecord = arrowsPerMinute;
        speedRecordText.textContent = `most arrows per minute: ${speedRecord}`;
    }
    if(keysWrong > 0 || keysCorrect > 0){
       updateStatsWindow();
    }
    clearGameValues();
    startButton.textContent = 'Play';
    startButton.style.display = 'block';
    restartButton.style.display = 'none';
}

function updateStatsWindow(){
    roundContainer.style.display = 'block';
    roundScoreText.textContent = `Score: ${score}`;
    highestComboText.textContent = `Highest Combo: ${highestCombo}`;
    arrowsHitText.textContent = `Keys Correct: ${keysCorrect}`;
    arrowsMissedText.textContent = `Keys Missed: ${keysWrong}`;
    percentCorrectText.textContent = `Accuracy: ${(keysCorrect/(keysCorrect+keysWrong)*100).toFixed(2)}%`;
    wavesCompletedText.textContent = `Waves Cleared: ${waveNumber-2}`;
    keysPressedText.textContent = `total keys: ${keysCorrect+keysWrong}`;
    arrowsPerMinuteText.textContent = `Speed: ${arrowsPerMinute}/min`;
}

function clearGameValues(){
    highestCombo = 0;
    score = 0;
    combo = 0;
    waveNumber = 0;
    keysCorrect = 0;
    removeAllChildNodes(currentSet);
    removeAllChildNodes(nextSet);
    currentArray = [];
    nextArray = [];
}

function restartGame(){
    restartButton.disabled = true;
    pauseButton.style.visibility = 'hidden';
    gameRestarted = true;
    Countdown();
}

function ClearStatsWindow(){
    roundScoreText.textContent = null;
    highestComboText.textContent = null;
    arrowsHitText.textContent = null;
    arrowsMissedText.textContent = null;
    percentCorrectText.textContent = null;
    wavesCompletedText.textContent = null;
    keysPressedText.textContent = null;
    arrowsPerMinuteText.textContent = null;
}