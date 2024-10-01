let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#newBtn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let timerDisplay = document.querySelector("#timer");

let turn0 = true; // Track turns (Player0 vs PlayerX)
let count = 0; // Track the number of moves to check for a draw
let timeLeft = 10; // Time limit per turn (in seconds)
let timer; // Variable to store the setInterval

// Sound effect files
const soundFiles = {
    win: new Audio('winning.mp3'),
    draw: new Audio('losing.mp3'), // Ensure these paths are correct
    lose: new Audio('losing.mp3'),
    ticking: new Audio('timer.mp3'),
};

// Set the ticking sound to loop continuously
soundFiles.ticking.loop = true;

// Function to play a sound
const playSound = (sound) => {
    try {
        sound.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
};

// Function to stop a sound
const stopSound = (sound) => {
    try {
        sound.pause();
        sound.currentTime = 0; // Reset sound to the beginning
    } catch (error) {
        console.error('Error stopping sound:', error);
    }
};

// Function to start the ticking sound
const startTickingSound = () => {
    playSound(soundFiles.ticking);
};

// Function to stop the ticking sound
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

// Function to start the timer
const startTimer = () => {
    timeLeft = 10; // Reset the time for each turn
    timerDisplay.innerText = `Time left: ${timeLeft}s`;
    clearInterval(timer); // Clear any previous timer
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            switchTurnsAutomatically(); // Auto-switch turns if time runs out
        }
    }, 1000);
    startTickingSound(); // Start ticking sound whenever the timer starts
};

// Function to switch turns if time runs out
const switchTurnsAutomatically = () => {
    if (turn0) {
        turn0 = false;
        alert("Time's up! Switching to X.");
    } else {
        turn0 = true;
        alert("Time's up! Switching to 0.");
    }
    stopTickingSound(); // Stop ticking sound when switching
    startTimer(); // Restart timer for the next player
};

// Reset the game
const resetGame = () => {
    turn0 = true; // playerX, player0
    count = 0; // to track draw
    enableBoxes();
    msgContainer.classList.add("hide");
    clearInterval(timer); // Clear the timer when resetting
    stopTickingSound(); // Stop ticking sound during reset
    startTimer(); // Start the timer again for a new game
};

// Adding sounds to box click and move logic
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
        clearInterval(timer); // Stop the timer once a player makes a move
        stopTickingSound(); // Stop the ticking sound after the move is made
        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw(); // Call gameDraw if the board is full and no winner
        } else if (!isWinner) {
            startTimer(); // Restart the timer for the next turn if no winner
        }
    });
});

// Function to handle a draw
const gameDraw = () => {
    msg.innerText = `Game was a Draw :(`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    playSound(soundFiles.draw); // Play draw sound
    clearInterval(timer); // Stop the timer when the game is drawn
    stopTickingSound(); // Stop ticking sound when game ends
};

// Function to show winner and play winning sound
const showWinner = (winner) => {
    msg.innerText = `Congratulations🎊, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    if (winner === "0" || winner === "X") {
        playSound(soundFiles.win); // Play winning sound for the winner
    }
    clearInterval(timer); // Stop the timer when there's a winner
    stopTickingSound(); // Stop ticking sound when the game ends
};

// Function to disable all boxes after the game ends
const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

// Function to enable all boxes for a new game
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

// Check for a winner based on the win patterns
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

// Event listeners for resetting and starting a new game
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Start the timer when the game is first loaded
startTimer();
