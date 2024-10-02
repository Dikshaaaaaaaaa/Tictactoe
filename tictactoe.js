let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#newBtn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let timerDisplay = document.querySelector("#timer");

let turn0 = true; 
let count = 0; 
let timeLeft = 10; 
let timer;


const soundFiles = {
    win: new Audio('winning.mp3'),
    draw: new Audio('losing.mp3'),
    lose: new Audio('losing.mp3'),
    ticking: new Audio('timer.mp3'),
};

soundFiles.ticking.loop = true;

const playSound = (sound) => {
    try {
        sound.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
};


const stopSound = (sound) => {
    try {
        sound.pause();
        sound.currentTime = 0; 
    } catch (error) {
        console.error('Error stopping sound:', error);
    }
};

const startTickingSound = () => {
    playSound(soundFiles.ticking);
};

const stopTickingSound = () => {
    stopSound(soundFiles.ticking);
};

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const startTimer = () => {
    timeLeft = 10; 
    timerDisplay.innerText = `Time left: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            switchTurnsAutomatically(); 
        }
    }, 1000);
    startTickingSound();
};

const switchTurnsAutomatically = () => {
    if (turn0) {
        turn0 = false;
        alert("Time's up! Switching to X.");
    } else {
        turn0 = true;
        alert("Time's up! Switching to 0.");
    }
    stopTickingSound(); 
    startTimer();
};

const resetGame = () => {
    turn0 = true; // playerX, player0
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    clearInterval(timer); 
    stopTickingSound(); 
    startTimer(); 
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turn0) {
            box.innerText = '0';
            box.style.color = "blue";
            turn0 = false;
        } else {
            box.innerText = "X";
            box.style.color = "green";
            turn0 = true;
        }
        box.disabled = true;
        count++;
        clearInterval(timer); 
        stopTickingSound();
        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        } else if (!isWinner) {
            startTimer(); 
        }
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw :(`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    playSound(soundFiles.draw); 
    clearInterval(timer); 
    stopTickingSound();
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations🎊, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    if (winner === "0" || winner === "X") {
        playSound(soundFiles.win); 
    }
    clearInterval(timer); 
    stopTickingSound(); 
};

const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

startTimer();
