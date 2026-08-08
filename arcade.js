/*==========================================================
 BAAKAA LOVE ARCADE
 Version 3.0
 PART 1
 Foundation Engine
==========================================================*/

"use strict";

/*==========================================================
GLOBAL OBJECT
==========================================================*/

const Arcade = {};

/*==========================================================
CONFIG
==========================================================*/

Arcade.Config = {

    crystalGoal: 4,

    version: "3.0",

    fps: 60

};

/*==========================================================
STATE
==========================================================*/

Arcade.State = {

    crystals: 0,

    completedGames: [],

    bossUnlocked: false,

    activeGame: null

};

/*==========================================================
UTILITIES
==========================================================*/

Arcade.Utils = {

    random(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;

    },

    clamp(value, min, max) {

        return Math.max(min, Math.min(max, value));

    },

    hasCrystal(game) {

        return Arcade.State.completedGames.includes(game);

    }

};

/*==========================================================
CRYSTAL MANAGER
==========================================================*/

Arcade.Crystals = {

    add(gameName) {

        if (Arcade.Utils.hasCrystal(gameName))
            return;

        Arcade.State.completedGames.push(gameName);

        Arcade.State.crystals++;

        this.refresh();

    },

    refresh() {

        const counter = document.getElementById("crystalCount");

        if (counter) {

            counter.textContent =
                Arcade.State.crystals +
                " / " +
                Arcade.Config.crystalGoal;

        }

        if (
            Arcade.State.crystals >=
            Arcade.Config.crystalGoal
        ) {

            Arcade.State.bossUnlocked = true;

            const boss =
                document.getElementById("bossButton");

            if (boss) {

                boss.disabled = false;

                boss.textContent =
                    "👑 PLAY FINAL BOSS";

            }

        }

    }

};

/*==========================================================
BASE GAME
==========================================================*/

Arcade.BaseGame = class {

    constructor(name) {

        this.name = name;

        this.completed = false;

    }

    start() {}

    stop() {}

    destroy() {}

    complete() {

        if (this.completed)
            return;

        this.completed = true;

        Arcade.Crystals.add(this.name);

    }

};

/*==========================================================
SCENE MANAGER
==========================================================*/

Arcade.Scene = {

    current: null,

    change(scene) {

        if (
            this.current &&
            this.current.stop
        ) {

            this.current.stop();

        }

        this.current = scene;

        if (
            this.current &&
            this.current.start
        ) {

            this.current.start();

        }

    }

};

/*==========================================================
GAME REGISTRY
==========================================================*/

Arcade.Games = {

    list: {},

    register(name, object) {

        this.list[name] = object;

    },

    get(name) {

        return this.list[name];

    }

};

/*==========================================================
MODAL HELPERS
==========================================================*/

Arcade.Modal = {

    open(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.add("show");

    },

    close(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.remove("show");

    }

};

/*==========================================================
INITIALIZATION
==========================================================*/

Arcade.init = function () {

    Arcade.Crystals.refresh();

    console.log(
        "❤️ BAAKAA Arcade Engine Ready"
    );

};

document.addEventListener(
    "DOMContentLoaded",
    Arcade.init
);
/*==========================================================
 GIFT GRAB GAME
 PART 2
==========================================================*/

Arcade.GiftGrab = new (class extends Arcade.BaseGame {

    constructor() {

        super("Gift Grab");

        this.modal = null;
        this.playButton = null;
        this.closeButton = null;
        this.grid = null;
        this.result = null;
        this.continueButton = null;

        this.cards = [];

        this.goldenGift = 0;

        this.finished = false;
        this.lives = 5;
this.remaining = 5;
this.selected = [];

    }

    start() {

        this.modal = document.getElementById("giftGrabModal");

        this.playButton = document.getElementById("giftGameBtn");

        this.closeButton = document.getElementById("closeGiftGrab");

        this.grid = document.getElementById("giftGrid");

        this.result = document.getElementById("giftResult");

        this.continueButton =
            document.getElementById("giftContinue");

        this.cards = [
            ...document.querySelectorAll(".arcade-gift")
        ];

        this.registerEvents();

    }

    registerEvents() {

        this.playButton.addEventListener("click", () => {

            this.open();

        });

        this.closeButton.addEventListener("click", () => {

            this.close();

        });

        this.continueButton.addEventListener("click", () => {

            this.close();

        });

        this.cards.forEach((card, index) => {

            card.addEventListener("click", () => {

                this.pick(index);

            });

        });

    }

    open() {

        if (Arcade.Utils.hasCrystal(this.name)) {

            this.result.innerHTML =
                "❤️ You already earned this Memory Crystal.";

            this.continueButton.style.display = "inline-block";

            Arcade.Modal.open("giftGrabModal");

            return;

        }

        this.reset();

        Arcade.Modal.open("giftGrabModal");

    }

    close() {

        Arcade.Modal.close("giftGrabModal");

    }

    reset() {

        this.finished = false;
        this.remaining = this.lives;
this.selected = [];

this.result.innerHTML =
    "❤️ Lives: " + this.remaining;

        this.result.innerHTML = "";

        this.continueButton.style.display = "none";

        this.goldenGift =
            Arcade.Utils.random(0, 11);

        this.cards.forEach(card => {

            card.innerHTML = "🎁";

            card.style.pointerEvents = "auto";

            card.classList.remove("winner");

            card.classList.remove("loser");

        });

    }

    pick(index) {

    if (this.finished) return;

if (this.selected.includes(index))
    return;

this.selected.push(index);

        this.finished = true;


        if (index === this.goldenGift) {

            this.win(index);

        }

        else {

            this.lose(index);

        }

    }

    win(index) {

        this.cards[index].innerHTML = "🏆";
        this.cards[index].style.pointerEvents = "none";

        this.cards[index].classList.add("winner");

        this.result.innerHTML =
            "✨ You found the Golden Gift!";

        this.complete();

        this.continueButton.style.display =
            "inline-block";

    }

   lose(index) {

    this.remaining--;

    this.cards[index].innerHTML = "💔";

    this.cards[index].classList.add("loser");

    this.cards[index].style.pointerEvents = "none";

    if (this.remaining <= 0) {

        this.cards[this.goldenGift].innerHTML = "🏆";

        this.cards[this.goldenGift]
            .classList.add("winner");

        

        this.result.innerHTML =
            "💀 Game Over! Click PLAY to try again.";

        this.continueButton.style.display = "inline-block";

        return;

    }

    this.finished = false;

    this.result.innerHTML =
        "❤️ Lives Left: " + this.remaining;

}

})();

Arcade.Games.register(
    "gift",
    Arcade.GiftGrab
);

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Arcade.GiftGrab.start();

    }
);
/*==========================================================
SAVE OUR MEMORIES
==========================================================*/

Arcade.MemoryGame = new (class extends Arcade.BaseGame {

    constructor() {

        super("Memory Game");

        this.modal = null;
        this.board = null;
        this.status = null;
        this.button = null;

        this.cards = [];

        this.first = null;
        this.second = null;

        this.lock = false;

        this.matches = 0;

        this.icons = [

            "❤️","❤️",
            "🏍","🏍",
            "🌸","🌸",
            "📞","📞",
            "🎁","🎁",
            "💍","💍"

        ];

    }

    start(){

        this.modal=document.getElementById("memoryGameModal");

        this.board=document.getElementById("memoryBoard");

        this.status=document.getElementById("memoryStatus");

        this.button=document.getElementById("memoryContinue");

        document
        .getElementById("memoryGameBtn")
        .onclick=()=>this.open();

        document
        .getElementById("closeMemoryGame")
        .onclick=()=>this.close();

        this.button.onclick=()=>this.close();

    }

    open(){

        if(Arcade.Utils.hasCrystal(this.name)){

            this.status.innerHTML=
            "❤️ Crystal already collected.";

            this.button.style.display="block";

            Arcade.Modal.open("memoryGameModal");

            return;

        }

        this.build();

        Arcade.Modal.open("memoryGameModal");

    }

    close(){

        Arcade.Modal.close("memoryGameModal");

    }

    build(){

        this.board.innerHTML="";

        this.matches=0;

        this.first=null;

        this.second=null;

        this.lock=false;

        this.button.style.display="none";

        this.status.innerHTML="Find all 6 pairs ❤️";

        const data=[...this.icons];

        data.sort(()=>Math.random()-.5);

        data.forEach(icon=>{

            const card=document.createElement("div");

            card.className="arcade-gift";

            card.innerHTML="❓";

            card.dataset.icon=icon;

            card.dataset.open="false";

            card.onclick=()=>this.flip(card);

            this.board.appendChild(card);

        });

    }

    flip(card){

        if(this.lock) return;

        if(card.dataset.open==="true") return;

        card.dataset.open="true";

        card.innerHTML=card.dataset.icon;

        if(!this.first){

            this.first=card;

            return;

        }

        this.second=card;

        this.lock=true;

        if(this.first.dataset.icon===this.second.dataset.icon){

            this.matches++;

            this.first=null;

            this.second=null;

            this.lock=false;

            if(this.matches===6){

                this.complete();

                this.status.innerHTML=
                "💎 Memory Crystal Earned!";

                this.button.style.display="block";

            }

        }

        else{

            setTimeout(()=>{

                this.first.dataset.open="false";

                this.second.dataset.open="false";

                this.first.innerHTML="❓";

                this.second.innerHTML="❓";

                this.first=null;

                this.second=null;

                this.lock=false;

            },700);

        }

    }

})();

Arcade.Games.register(
    "memory",
    Arcade.MemoryGame
);

document.addEventListener(
    "DOMContentLoaded",
    ()=>{
        Arcade.MemoryGame.init();
    }
);
/*==========================================================
SAVE OUR MEMORIES
SECTION 2
==========================================================*/

Arcade.MemoryGame = {

    correctOrder: [

        "❤️ First Meeting",

        "🏍 First Bike Ride",

        "📞 13 Hour Call",

        "🏡 Home Stay",

        "🌧 Dangerous Sux",

        "🎁 Surprise"

    ],

    currentOrder: [],

    firstSelected: null,

    init() {

        const play =
            document.getElementById("memoryGameBtn");

        const close =
            document.getElementById("closeMemoryGame");

        const check =
            document.getElementById("checkMemoryOrder");

        const cont =
            document.getElementById("memoryContinue");

        play.onclick = () => this.open();

        close.onclick = () => Arcade.Modal.close("memoryGameModal");

        cont.onclick = () => Arcade.Modal.close("memoryGameModal");

        check.onclick = () => this.check();

    },

    open() {

        if (Arcade.Utils.hasCrystal("Memory Game")) {

            document.getElementById("memoryStatus").innerHTML =
                "❤️ Memory Crystal already collected.";

            document.getElementById("memoryContinue").style.display =
                "block";

            Arcade.Modal.open("memoryGameModal");

            return;

        }

        this.build();

        Arcade.Modal.open("memoryGameModal");

    },

    build() {

        if (this.currentOrder.length === 0) {

    this.currentOrder =
        [...this.correctOrder]
        .sort(() => Math.random() - 0.5);

}

        this.firstSelected = null;

        const board =
            document.getElementById("memoryBoard");

        board.innerHTML = "";

        document.getElementById("memoryContinue").style.display =
            "none";

        document.getElementById("memoryStatus").innerHTML =
            "Tap two memories to swap them ❤️";

        this.currentOrder.forEach((memory, index) => {

            const card =
                document.createElement("div");

            card.className = "memory-card";

            card.dataset.index = index;

            card.innerHTML =

                "<span>" +

                memory +

                "</span>";

            card.onclick = () =>
                this.select(card);

            board.appendChild(card);

        });

    },

    select(card) {

    if (!this.firstSelected) {

        this.firstSelected = card;

        card.classList.add("selected");

        return;

    }

    if (card === this.firstSelected)
        return;

    const a = Number(this.firstSelected.dataset.index);

    const b = Number(card.dataset.index);

    // Swap in array
    [
        this.currentOrder[a],
        this.currentOrder[b]
    ] = [
        this.currentOrder[b],
        this.currentOrder[a]
    ];

    // Update only the two cards
    const cards = document.querySelectorAll(".memory-card");

    cards[a].querySelector("span").textContent =
        this.currentOrder[a];

    cards[b].querySelector("span").textContent =
        this.currentOrder[b];

    // Remove selection
    cards.forEach(c =>
        c.classList.remove("selected"));

    this.firstSelected = null;

    },

    check() {

        let correct = true;

        for (

            let i = 0;

            i < this.correctOrder.length;

            i++

        ) {

            if (

                this.correctOrder[i] !==

                this.currentOrder[i]

            ) {

                correct = false;

                break;

            }

        }

        if (!correct) {

            document.getElementById("memoryStatus").innerHTML =

                "❌ Not quite... Keep trying ❤️";

            return;

        }

        Arcade.Crystals.add("Memory Game");

        document.getElementById("memoryStatus").innerHTML =

            "💎 Timeline Restored ❤️";

        document.getElementById("memoryContinue").style.display =

            "block";

    }

};

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Arcade.MemoryGame.init();

    }

);
/*==========================================================
MEDICAL JARGON GAME
FINAL VERSION
==========================================================*/

Arcade.BikeGame = {

    questions: [

    {
        question:
            "A patient has an abnormally fast heart rate that remains above the normal resting range. Which medical term describes this finding?",

        options: [
            "Bradycardia",
            "Tachycardia",
            "Tachypnea",
            "Arrhythmia"
        ],

        answer: "Tachycardia"
    },

    {
        question:
            "A patient complains of difficulty swallowing food but does not necessarily experience pain during swallowing. Which term best describes this symptom?",

        options: [
            "Dysphasia",
            "Odynophagia",
            "Dysphagia",
            "Aphagia"
        ],

        answer: "Dysphagia"
    },

    {
        question:
            "A patient reports an unusually intense and persistent desire to drink fluids, accompanied by excessive water consumption. Which medical term describes this symptom?",

        options: [
            "Polyuria",
            "Polydipsia",
            "Oliguria",
            "Dysuria"
        ],

        answer: "Polydipsia"
    },

    {
        question:
            "A patient describes persistent tingling and a 'pins and needles' sensation in both hands, while strength and movement remain intact. Which term most accurately describes this abnormal sensation?",

        options: [
            "Hypoesthesia",
            "Dysesthesia",
            "Paresthesia",
            "Anesthesia"
        ],

        answer: "Paresthesia"
    },

    {
        question:
            "A patient passes black, sticky and tar-like stools, suggesting that blood has been altered during its passage through the gastrointestinal tract. Which term describes this finding?",

        options: [
            "Hematochezia",
            "Steatorrhea",
            "Hematemesis",
            "Melena"
        ],

        answer: "Melena"
    },

    {
        question:
            "During abdominal examination, the spleen is found to be enlarged beyond its expected anatomical size. Which medical term describes this finding?",

        options: [
            "Hepatomegaly",
            "Splenomegaly",
            "Splenitis",
            "Hepatosplenitis"
        ],

        answer: "Splenomegaly"
    },

    {
        question:
            "A patient develops involuntary, irregular movements that appear unpredictable and seem to flow continuously from one muscle group to another. Which movement disorder is being described?",

        options: [
            "Myoclonus",
            "Dystonia",
            "Chorea",
            "Tremor"
        ],

        answer: "Chorea"
    },

    {
        question:
            "A patient develops marked sweating that occurs independently of environmental heat or physical exertion. Which medical term best describes this finding?",

        options: [
            "Seborrhea",
            "Diaphoresis",
            "Xerosis",
            "Hyperthermia"
        ],

        answer: "Diaphoresis"
    },

    {
        question:
            "A patient is unable to recognize a familiar object despite having intact primary vision and being able to see the object's individual features. Which neurological term describes this deficit?",

        options: [
            "Apraxia",
            "Agnosia",
            "Aphasia",
            "Ataxia"
        ],

        answer: "Agnosia"
    },

    {
        question:
            "A patient suddenly develops a brief, involuntary muscle jerk without a sustained contraction or prolonged abnormal posture. Which term best describes this movement?",

        options: [
            "Dystonia",
            "Chorea",
            "Fasciculation",
            "Myoclonus"
        ],

        answer: "Myoclonus"
    }

],
    currentQuestion: 0,

    score: 0,

    lives: 3,

    timeLeft: 240,

    playing: false,

    timerInterval: null,

    answered: false,


    /*======================================================
    INITIALIZE
    ======================================================*/

    init() {

        const playButton =
            document.getElementById("bikeGameBtn");

        const closeButton =
            document.getElementById("closeBikeGame");

        const continueButton =
            document.getElementById("medicalContinue");


        if (playButton) {

            playButton.onclick = () => {

                this.open();

            };

        }


        if (closeButton) {

            closeButton.onclick = () => {

                this.close();

            };

        }


        if (continueButton) {

            continueButton.onclick = () => {

                this.close();

            };

        }

    },


    /*======================================================
    OPEN
    ======================================================*/

    open() {

        this.reset();

        Arcade.Modal.open("bikeGameModal");

    },


    /*======================================================
    CLOSE
    ======================================================*/

    close() {

        this.stop();

        Arcade.Modal.close("bikeGameModal");

    },


    /*======================================================
    RESET
    ======================================================*/

    reset() {

        this.stop();

        this.currentQuestion = 0;

        this.score = 0;

        this.lives = 3;

        this.timeLeft = 240;

        this.playing = true;

        this.answered = false;


        const status =
            document.getElementById("medicalStatus");

        const continueButton =
            document.getElementById("medicalContinue");


        if (status) {

            status.textContent = "";

        }


        if (continueButton) {

            continueButton.style.display = "none";

        }


        this.updateHUD();

        this.showQuestion();

        this.startTimer();

    },


    /*======================================================
    TIMER
    ======================================================*/

    startTimer() {

        clearInterval(this.timerInterval);


        this.timerInterval = setInterval(() => {

            if (!this.playing) {

                return;

            }


            this.timeLeft--;

            this.updateTimer();


            if (this.timeLeft <= 0) {

                this.timeUp();

            }

        }, 1000);

    },


    stop() {

        this.playing = false;

        clearInterval(this.timerInterval);

        this.timerInterval = null;

    },


    /*======================================================
    TIMER DISPLAY
    ======================================================*/

    updateTimer() {

        const timer =
            document.getElementById("medicalTimer");

        if (!timer) {

            return;

        }


        const minutes =
            Math.floor(this.timeLeft / 60);

        const seconds =
            this.timeLeft % 60;


        timer.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    },


    /*======================================================
    HUD
    ======================================================*/

    updateHUD() {

        const lives =
            document.getElementById("medicalLives");

        const score =
            document.getElementById("medicalScore");


        if (lives) {

            lives.textContent =
                "❤️".repeat(this.lives) +
                "🖤".repeat(3 - this.lives);

        }


        if (score) {

            score.textContent =
                "Score: " + this.score;

        }


        this.updateTimer();

    },


    /*======================================================
    SHOW QUESTION
    ======================================================*/

    showQuestion() {

        if (!this.playing) {

            return;

        }


        if (this.currentQuestion >= this.questions.length) {

            this.win();

            return;

        }


        this.answered = false;


        const question =
            this.questions[this.currentQuestion];


        const questionElement =
            document.getElementById("medicalQuestion");

        const progress =
            document.getElementById("medicalProgress");

        const optionsContainer =
            document.getElementById("medicalOptions");

        const status =
            document.getElementById("medicalStatus");


        if (questionElement) {

            questionElement.textContent =
                question.question;

        }


        if (progress) {

            progress.textContent =
                "Question " +
                (this.currentQuestion + 1) +
                " / " +
                this.questions.length;

        }


        if (status) {

            status.textContent = "";

        }


        if (!optionsContainer) {

            return;

        }


        optionsContainer.innerHTML = "";


        question.options.forEach((option) => {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "medical-option";

            button.textContent =
                option;


            button.addEventListener("click", () => {

                this.answer(option, button);

            });


            optionsContainer.appendChild(button);

        });

    },


    /*======================================================
    ANSWER
    ======================================================*/

    answer(selectedAnswer, selectedButton) {

        if (!this.playing || this.answered) {

            return;

        }


        this.answered = true;


        const question =
            this.questions[this.currentQuestion];


        const optionButtons =
            document.querySelectorAll(
                ".medical-option"
            );


        optionButtons.forEach((button) => {

            button.disabled = true;

        });


        if (selectedAnswer === question.answer) {

            selectedButton.classList.add("correct");

            this.score += 100;

            this.updateHUD();


            const status =
                document.getElementById("medicalStatus");


            if (status) {

                status.textContent =
                    "✅ Correct!";

            }


            setTimeout(() => {

                if (!this.playing) {

                    return;

                }

                this.currentQuestion++;

                this.showQuestion();

            }, 700);

        }

        else {

            selectedButton.classList.add("wrong");


            optionButtons.forEach((button) => {

                if (
                    button.textContent ===
                    question.answer
                ) {

                    button.classList.add("correct");

                }

            });


            this.lives--;

            this.updateHUD();


            const status =
                document.getElementById("medicalStatus");


            if (status) {

                status.textContent =
                    "❌ Incorrect";

            }


            if (this.lives <= 0) {

                setTimeout(() => {

                    this.gameOver();

                }, 900);

                return;

            }


            setTimeout(() => {

                if (!this.playing) {

                    return;

                }

                this.currentQuestion++;

                this.showQuestion();

            }, 1000);

        }

    },


    /*======================================================
    GAME OVER
    ======================================================*/

    gameOver() {

        this.stop();


        const questionElement =
            document.getElementById("medicalQuestion");

        const optionsContainer =
            document.getElementById("medicalOptions");

        const progress =
            document.getElementById("medicalProgress");

        const status =
            document.getElementById("medicalStatus");

        const continueButton =
            document.getElementById("medicalContinue");


        if (progress) {

            progress.textContent =
                "Game Over";

        }


        if (questionElement) {

            questionElement.textContent =
                "❤️ You ran out of lives!";

        }


        if (optionsContainer) {

            optionsContainer.innerHTML = "";

        }


        if (status) {

            status.textContent =
                "Score: " + this.score;

        }


        if (continueButton) {

            continueButton.textContent =
                "Try Again ❤️";

            continueButton.style.display =
                "inline-block";

            continueButton.onclick = () => {

                this.reset();

            };

        }

    },


    /*======================================================
    TIME UP
    ======================================================*/

    timeUp() {

        this.stop();


        const questionElement =
            document.getElementById("medicalQuestion");

        const optionsContainer =
            document.getElementById("medicalOptions");

        const progress =
            document.getElementById("medicalProgress");

        const status =
            document.getElementById("medicalStatus");

        const continueButton =
            document.getElementById("medicalContinue");


        if (progress) {

            progress.textContent =
                "Time's Up!";

        }


        if (questionElement) {

            questionElement.textContent =
                "⏰ Time's Up!";

        }


        if (optionsContainer) {

            optionsContainer.innerHTML = "";

        }


        if (status) {

            status.textContent =
                "Score: " + this.score;

        }


        if (continueButton) {

            continueButton.textContent =
                "Try Again ❤️";

            continueButton.style.display =
                "inline-block";

            continueButton.onclick = () => {

                this.reset();

            };

        }

    },


    /*======================================================
    WIN
    ======================================================*/

    win() {

        this.stop();


        const questionElement =
            document.getElementById("medicalQuestion");

        const optionsContainer =
            document.getElementById("medicalOptions");

        const progress =
            document.getElementById("medicalProgress");

        const status =
            document.getElementById("medicalStatus");

        const continueButton =
            document.getElementById("medicalContinue");


        if (progress) {

            progress.textContent =
                "10 / 10 Complete";

        }


        if (questionElement) {

            questionElement.textContent =
                "🩺 Medical Genius! ❤️";

        }


        if (optionsContainer) {

            optionsContainer.innerHTML = "";

        }


        if (status) {

            status.textContent =
                "💎 Memory Crystal Earned!";

        }


        if (continueButton) {

            continueButton.textContent =
                "Continue ❤️";

            continueButton.style.display =
                "inline-block";

            continueButton.onclick = () => {

                this.close();

            };

        }


        if (
            Arcade.Crystals &&
            typeof Arcade.Crystals.add === "function"
        ) {

            Arcade.Crystals.add("Medical Jargon");

        }

    }

};


/*==========================================================
INITIALIZE MEDICAL JARGON
==========================================================*/

function initializeMedicalJargon() {

    if (
        Arcade.BikeGame &&
        typeof Arcade.BikeGame.init === "function"
    ) {

        Arcade.BikeGame.init();

    }

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMedicalJargon
    );

} else {

    initializeMedicalJargon();

}
/*==========================================================
PROMISE LOCK
SECTION 3 — GAME ENGINE
==========================================================*/

Arcade.PromiseLock = {

    /*======================================================
    FINAL REWARD CODE
    ======================================================*/

    finalCode: "7482",


    /*======================================================
    FOUR PUZZLES
    ======================================================*/

    puzzles: [

        {
            question:
                "You are running a race and overtake the person in second place. What position are you now?",

            options: [
                "First place",
                "Second place",
                "Third place",
                "Last place"
            ],

            answer: "Second place",

            reward: "7"
        },


        {
            question:
                "A farmer has 10 sheep. All but 3 run away. How many sheep remain?",

            options: [
                "3",
                "7",
                "10",
                "0"
            ],

            answer: "3",

            reward: "4"
        },


        {
            question:
                "A man looks at a photograph and says: \"Brothers and sisters I have none, but this man's father is my father's son.\" Who is in the photograph?",

            options: [
                "His brother",
                "His father",
                "His son",
                "His nephew"
            ],

            answer: "His son",

            reward: "8"
        },


        {
            question:
                "Two fathers and two sons go to a restaurant. They order only three meals, and everyone gets one. How is this possible?",

            options: [
                "One person was not hungry",
                "They shared the meals",
                "They were grandfather, father and son",
                "One person left before eating"
            ],

            answer:
                "They were grandfather, father and son",

            reward: "2"
        }

    ],


    /*======================================================
    GAME STATE
    ======================================================*/

    currentPuzzle: 0,

    earnedDigits: [],

    lifeline1Used: false,

    lifeline2Used: false,

    playing: false,


    /*======================================================
    INITIALIZE
    ======================================================*/

    init() {

        const playButton =
    document.getElementById("promiseGameBtn");

        const closeButton =
            document.getElementById("closePromiseLock");

        const startButton =
            document.getElementById("promiseStart");

        const lifeline1 =
            document.getElementById("promiseLifeline1");

        const lifeline2 =
            document.getElementById("promiseLifeline2");

        const lifelineDone =
            document.getElementById("promiseLifelineDone");

        const unlockButton =
            document.getElementById("promiseUnlock");

        const continueButton =
            document.getElementById("promiseContinue");


        if (playButton) {

            playButton.onclick = () => {

                this.open();

            };

        }


        if (closeButton) {

            closeButton.onclick = () => {

                this.close();

            };

        }


        if (startButton) {

            startButton.onclick = () => {

                this.startGame();

            };

        }


        if (lifeline1) {

            lifeline1.onclick = () => {

                this.useLifeline(1);

            };

        }


        if (lifeline2) {

            lifeline2.onclick = () => {

                this.useLifeline(2);

            };

        }


        if (lifelineDone) {

            lifelineDone.onclick = () => {

                this.closeLifeline();

            };

        }


        if (unlockButton) {

            unlockButton.onclick = () => {

                this.checkFinalCode();

            };

        }


        if (continueButton) {

            continueButton.onclick = () => {

                this.close();

            };

        }

    },


    /*======================================================
    OPEN
    ======================================================*/

    open() {

        this.reset();

        Arcade.Modal.open("promiseLockModal");

    },


    /*======================================================
    CLOSE
    ======================================================*/

    close() {

        this.playing = false;

        Arcade.Modal.close("promiseLockModal");

    },


    /*======================================================
    RESET
    ======================================================*/

    reset() {

        this.currentPuzzle = 0;

        this.earnedDigits = [];

        this.lifeline1Used = false;

        this.lifeline2Used = false;

        this.playing = false;


        const intro =
            document.getElementById("promiseIntro");

        const puzzle =
            document.getElementById("promisePuzzle");

        const final =
            document.getElementById("promiseFinal");

        const popup =
            document.getElementById("promiseLifelinePopup");

        const status =
            document.getElementById("promiseStatus");

        const finalStatus =
            document.getElementById("promiseFinalStatus");


        if (intro) {

            intro.style.display = "block";

        }


        if (puzzle) {

            puzzle.style.display = "none";

        }


        if (final) {

            final.style.display = "none";

        }


        if (popup) {

            popup.style.display = "none";

        }


        if (status) {

            status.textContent = "";

        }


        if (finalStatus) {

            finalStatus.textContent = "";

        }


        this.updateDigits();

        this.resetLifelines();

    },


    /*======================================================
    START GAME
    ======================================================*/

    startGame() {

        this.playing = true;

        this.currentPuzzle = 0;

        this.earnedDigits = [];

        this.showPuzzle();

        const intro =
            document.getElementById("promiseIntro");

        const puzzle =
            document.getElementById("promisePuzzle");


        if (intro) {

            intro.style.display = "none";

        }


        if (puzzle) {

            puzzle.style.display = "block";

        }

    },


    /*======================================================
    SHOW PUZZLE
    ======================================================*/

    showPuzzle() {

        if (!this.playing) {

            return;

        }


        if (this.currentPuzzle >= this.puzzles.length) {

            this.showFinalLock();

            return;

        }


        const puzzle =
            this.puzzles[this.currentPuzzle];


        const progress =
            document.getElementById("promiseProgress");

        const question =
            document.getElementById("promiseQuestion");

        const options =
            document.getElementById("promiseOptions");

        const status =
            document.getElementById("promiseStatus");


        if (progress) {

            progress.textContent =
                "Puzzle " +
                (this.currentPuzzle + 1) +
                " / 4";

        }


        if (question) {

            question.textContent =
                puzzle.question;

        }


        if (status) {

            status.textContent = "";

        }


        if (!options) {

            return;

        }


        options.innerHTML = "";


        puzzle.options.forEach((option) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "promise-option";

            button.textContent =
                option;


            button.onclick = () => {

                this.answerPuzzle(
                    option,
                    button
                );

            };


            options.appendChild(button);

        });

    },


    /*======================================================
    ANSWER PUZZLE
    ======================================================*/

    answerPuzzle(selected, selectedButton) {

        if (!this.playing) {

            return;

        }


        const puzzle =
            this.puzzles[this.currentPuzzle];


        const buttons =
            document.querySelectorAll(
                ".promise-option"
            );


        buttons.forEach((button) => {

            button.disabled = true;

        });


        if (selected === puzzle.answer) {

            selectedButton.classList.add("correct");


            const status =
                document.getElementById("promiseStatus");


            if (status) {

                status.textContent =
                    "✅ Correct!";

            }


            setTimeout(() => {

                this.awardDigit(puzzle.reward);

            }, 700);

        }

        else {

            selectedButton.classList.add("wrong");


            const status =
                document.getElementById("promiseStatus");


            if (status) {

                status.textContent =
                    "❌ Not quite. Try again.";

            }


            buttons.forEach((button) => {

                button.disabled = false;

            });

        }

    },


    /*======================================================
    AWARD DIGIT
    ======================================================*/

    awardDigit(digit) {

        this.earnedDigits.push(digit);

        this.updateDigits();


        const status =
            document.getElementById("promiseStatus");


        if (status) {

            status.textContent =
                "🎁 Secret digit earned: " +
                digit;

        }


        setTimeout(() => {

            this.currentPuzzle++;

            this.showPuzzle();

        }, 1200);

    },


    /*======================================================
    UPDATE EARNED DIGITS
    ======================================================*/

    updateDigits() {

        const container =
            document.getElementById("promiseDigits");


        if (!container) {

            return;

        }


        const slots =
            container.querySelectorAll("span");


        slots.forEach((slot, index) => {

            slot.textContent =
                this.earnedDigits[index] || "_";

        });

    },


    /*======================================================
    LIFELINES
    ======================================================*/

    useLifeline(number) {

        if (!this.playing) {

            return;

        }


        if (number === 1) {

            if (this.lifeline1Used) {

                return;

            }


            this.lifeline1Used = true;


            this.showLifeline(
                "🆘 Lifeline 1",
                "💋 Kiss Satt for 10 seconds."
            );

        }


        if (number === 2) {

            if (this.lifeline2Used) {

                return;

            }


            this.lifeline2Used = true;


            this.showLifeline(
                "🆘 Lifeline 2",
                "🥪 Sandwich Satt."
            );

        }


        this.resetLifelineButton(number);

    },


    /*======================================================
    SHOW LIFELINE
    ======================================================*/

    showLifeline(title, task) {

        const popup =
            document.getElementById(
                "promiseLifelinePopup"
            );

        const popupTitle =
            document.getElementById(
                "promiseLifelineTitle"
            );

        const popupTask =
            document.getElementById(
                "promiseLifelineTask"
            );


        if (popupTitle) {

            popupTitle.textContent =
                title;

        }


        if (popupTask) {

            popupTask.textContent =
                "Your task: " + task +
                "\n\n❤️ Complete the task, then continue solving.";

        }


        if (popup) {

            popup.style.display = "block";

        }

    },


    /*======================================================
    CLOSE LIFELINE POPUP
    ======================================================*/

    closeLifeline() {

        const popup =
            document.getElementById(
                "promiseLifelinePopup"
            );


        if (popup) {

            popup.style.display = "none";

        }


        const status =
            document.getElementById("promiseStatus");


        if (status) {

            status.textContent =
                "❤️ Lifeline completed. Keep solving!";

        }

    },


    /*======================================================
    DISABLE USED LIFELINE
    ======================================================*/

    resetLifelineButton(number) {

        const button =
            document.getElementById(
                number === 1
                    ? "promiseLifeline1"
                    : "promiseLifeline2"
            );


        if (!button) {

            return;

        }


        button.disabled = true;

        button.textContent =
            "Lifeline " +
            number +
            " ✅ Used";

    },


    /*======================================================
    RESET LIFELINES
    ======================================================*/

    resetLifelines() {

        const button1 =
            document.getElementById(
                "promiseLifeline1"
            );

        const button2 =
            document.getElementById(
                "promiseLifeline2"
            );


        if (button1) {

            button1.disabled = false;

            button1.textContent =
                "Lifeline 1";

        }


        if (button2) {

            button2.disabled = false;

            button2.textContent =
                "Lifeline 2";

        }

    },


    /*======================================================
    FINAL LOCK
    ======================================================*/

    showFinalLock() {

        const puzzle =
            document.getElementById("promisePuzzle");

        const final =
            document.getElementById("promiseFinal");


        if (puzzle) {

            puzzle.style.display = "none";

        }


        if (final) {

            final.style.display = "block";

        }

    },


    /*======================================================
    CHECK FINAL CODE
    ======================================================*/

    checkFinalCode() {

        const digits = [

            document.getElementById(
                "promiseDigit1"
            )?.value,

            document.getElementById(
                "promiseDigit2"
            )?.value,

            document.getElementById(
                "promiseDigit3"
            )?.value,

            document.getElementById(
                "promiseDigit4"
            )?.value

        ].join("");


        const status =
            document.getElementById(
                "promiseFinalStatus"
            );


        if (digits === this.finalCode) {

            if (status) {

                status.textContent =
                    "🔓 Promise Lock Opened!";

            }


            if (
                Arcade.Crystals &&
                typeof Arcade.Crystals.add ===
                "function"
            ) {

                Arcade.Crystals.add(
                    "Promise Lock"
                );

            }


            const continueButton =
                document.getElementById(
                    "promiseContinue"
                );


            if (continueButton) {

                continueButton.style.display =
                    "inline-block";

            }

        }

        else {

            if (status) {

                status.textContent =
                    "🔒 Incorrect combination. Try again ❤️";

            }

        }

    }

};


/*==========================================================
INITIALIZE PROMISE LOCK
==========================================================*/

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            Arcade.PromiseLock.init();

        }
    );

} else {

    Arcade.PromiseLock.init();

}
/*==========================================================
FINAL BOSS UNLOCK SYSTEM
==========================================================*/

Arcade.FinalBoss = {

    init() {

        const bossButton =
            document.getElementById("bossButton");

        if (bossButton) {

            bossButton.onclick = () => {

                this.enterBoss();

            };

        }

        this.update();

    },


    update() {

        const crystals =
            this.getCrystalCount();

        const status =
            document.getElementById(
                "bossCrystalStatus"
            );

        const description =
            document.getElementById(
                "bossDescription"
            );

        const locks =
            document.querySelectorAll(
                "#bossLocks span"
            );

        const bossButton =
            document.getElementById(
                "bossButton"
            );


        /* Update crystal counter */

        if (status) {

            status.textContent =
                "💎 " +
                crystals +
                " / 4 Crystals";

        }


        /* Update locks */

        locks.forEach((lock, index) => {

            if (index < crystals) {

                lock.textContent = "🔓";

            } else {

                lock.textContent = "🔒";

            }

        });


        /* Unlock Final Boss */

        if (crystals >= 4) {

            if (description) {

                description.textContent =
                    "💎 All 4 Crystals collected. The locks are open!";

            }


            if (bossButton) {

                bossButton.disabled = false;

                bossButton.textContent =
                    "👑 ENTER FINAL BOSS";

            }


            const lockContainer =
                document.getElementById(
                    "bossLocks"
                );

            if (lockContainer) {

                lockContainer.classList.add(
                    "unlocked"
                );

            }

        }

        else {

            if (description) {

                description.textContent =
                    "Locked until all 4 Memory Crystals are collected.";

            }


            if (bossButton) {

                bossButton.disabled = true;

                bossButton.textContent =
                    "🔒 LOCKED";

            }

        }

    },


    getCrystalCount() {

    const crystalDisplay =
        document.getElementById("crystalCount");

    if (!crystalDisplay) {
        return 0;
    }

    const text =
        crystalDisplay.textContent.trim();

    const match =
        text.match(/(\d+)\s*\/\s*4/);

    if (!match) {
        return 0;
    }

    return Number(match[1]);

},


    enterBoss() {

        if (this.getCrystalCount() < 4) {

            return;

        }

        /*
         * Final Boss will be connected here.
         * We are NOT building the boss yet.
         */

        alert(
            "👑 FINAL BOSS UNLOCKED!"
        );

    }

};
setInterval(() => {

    if (Arcade.FinalBoss) {
        Arcade.FinalBoss.update();
    }

}, 500);


/*==========================================================
INITIALIZE FINAL BOSS
==========================================================*/

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            Arcade.FinalBoss.init();

        }
    );

} else {

    Arcade.FinalBoss.init();

}
/* ==========================================================
   FINAL BOSS — KNOW YOUR SATT
   SECTION 3 — GAME ENGINE
   ========================================================== */

Arcade.KnowYourSatt = {

    questions: [

        {
            question:
                "What is something Satt can never say no to?",

            options: [
                "Good food",
                "Shopping",
                "A late-night conversation",
                "Baakaa"
            ],

            correct: ["D"]
        },


        {
            question:
                "What kind of gift would genuinely make Satt happiest?",

            options: [
                "Something expensive",
                "Something handmade",
                "Something she specifically asked for",
                "A surprise experience"
            ],

            correct: ["B"]
        },


        {
            question:
                "What does Satt value most in a relationship?",

            options: [
                "Trust & respect",
                "Communication",
                "Quality time",
                "Feeling understood"
            ],

            correct: ["A"]
        },


        {
            question:
    "When Satt has to make an important decision, what is he most likely to trust?",

            options: [
    "Logic",
    "His feelings",
    "Other people's advice",
    "His first instinct"
],

            correct: ["A"]
        },


        {
            question:
                "What is something that can instantly make Satt's mood better?",

            options: [
                "Her favorite food",
                "A good conversation",
                "A thoughtful surprise",
                "Spending time with Baakaa"
            ],

            correct: ["D"]
        },


        {
            question:
                "What kind of situation makes Satt feel most appreciated?",

            options: [
                "Someone remembering a small detail about her",
                "Someone giving her a thoughtful gift",
                "Someone spending uninterrupted time with her",
                "Someone helping her without being asked"
            ],

            correct: ["A"]
        },


        {
            question:
                "What is Satt most likely to overthink?",

            options: [
                "Something she said",
                "A decision she made",
                "What someone meant by something they said",
                "Something that hasn't even happened yet"
            ],

            correct: ["A", "B"]
        },


        {
            question:
                "If Satt could choose one perfect way to spend an evening, what would she prefer?",

            options: [
                "Going out somewhere nice",
                "Staying home and relaxing",
                "Going out for food",
                "Spending quality time with someone special"
            ],

            correct: ["B", "D"]
        },


        {
            question:
                "How much do you love Satt?",

            options: [
                "Some",
                "Very much",
                "More than anything",
                "Say it to Satt directly"
            ],

            correct: ["D"]
        }

    ],


    currentQuestion: 0,

    score: 0,

    answered: false,


    /* ======================================================
       INITIALIZE
       ====================================================== */

    init() {

        const bossButton =
            document.getElementById("bossButton");

        const closeButton =
            document.getElementById("closeKnowSatt");

        const startButton =
            document.getElementById("knowSattStart");

        const nextButton =
            document.getElementById("knowSattNext");

        const finishButton =
            document.getElementById("knowSattFinish");


        if (bossButton) {

            bossButton.onclick = () => {

                this.open();

            };

        }


        if (closeButton) {

            closeButton.onclick = () => {

                this.close();

            };

        }


        if (startButton) {

            startButton.onclick = () => {

                this.start();

            };

        }


        if (nextButton) {

            nextButton.onclick = () => {

                this.nextQuestion();

            };

        }


        if (finishButton) {

            finishButton.onclick = () => {

                this.finish();

            };

        }

    },


    /* ======================================================
       OPEN
       ====================================================== */

    open() {

        if (
            Arcade.FinalBoss &&
            typeof Arcade.FinalBoss.getCrystalCount ===
            "function"
        ) {

            if (
                Arcade.FinalBoss.getCrystalCount() < 4
            ) {

                return;

            }

        }


        const modal =
            document.getElementById(
                "knowSattModal"
            );


        if (modal) {

            modal.classList.add("show");

        }


        this.reset();

    },


    /* ======================================================
       CLOSE
       ====================================================== */

    close() {

        const modal =
            document.getElementById(
                "knowSattModal"
            );


        if (modal) {

            modal.classList.remove("show");

        }

    },


    /* ======================================================
       RESET
       ====================================================== */

    reset() {

        this.currentQuestion = 0;

        this.score = 0;

        this.answered = false;


        const intro =
            document.getElementById(
                "knowSattIntro"
            );

        const quiz =
            document.getElementById(
                "knowSattQuiz"
            );

        const result =
            document.getElementById(
                "knowSattResult"
            );


        if (intro) {

            intro.style.display = "block";

        }


        if (quiz) {

            quiz.style.display = "none";

        }


        if (result) {

            result.style.display = "none";

        }

    },


    /* ======================================================
       START
       ====================================================== */

    start() {

        this.currentQuestion = 0;

        this.score = 0;

        this.answered = false;


        const intro =
            document.getElementById(
                "knowSattIntro"
            );

        const quiz =
            document.getElementById(
                "knowSattQuiz"
            );

        const result =
            document.getElementById(
                "knowSattResult"
            );


        if (intro) {

            intro.style.display = "none";

        }


        if (quiz) {

            quiz.style.display = "block";

        }


        if (result) {

            result.style.display = "none";

        }


        this.showQuestion();

    },


    /* ======================================================
       SHOW QUESTION
       ====================================================== */

    showQuestion() {

        const questionData =
            this.questions[
                this.currentQuestion
            ];


        this.answered = false;


        const progress =
            document.getElementById(
                "knowSattProgress"
            );

        const question =
            document.getElementById(
                "knowSattQuestion"
            );

        const options =
            document.getElementById(
                "knowSattOptions"
            );

        const status =
            document.getElementById(
                "knowSattStatus"
            );

        const nextButton =
            document.getElementById(
                "knowSattNext"
            );


        if (progress) {

            progress.textContent =
                "Question " +
                (this.currentQuestion + 1) +
                " / 9";

        }


        if (question) {

            question.textContent =
                questionData.question;

        }


        if (status) {

            status.textContent = "";

        }


        if (nextButton) {

            nextButton.style.display =
                "none";

        }


        if (!options) {

            return;

        }


        options.innerHTML = "";


        questionData.options.forEach(
            (option, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type = "button";

                button.className =
                    "know-satt-option";

                button.textContent =
                    option;


                button.onclick = () => {

                    this.answer(
                        index,
                        button
                    );

                };


                options.appendChild(button);

            }
        );

    },


    /* ======================================================
       ANSWER
       ====================================================== */

    answer(selectedIndex, selectedButton) {

        if (this.answered) {

            return;

        }


        this.answered = true;


        const questionData =
            this.questions[
                this.currentQuestion
            ];


        const selectedLetter =
            String.fromCharCode(
                65 + selectedIndex
            );


        const isCorrect =
            questionData.correct.includes(
                selectedLetter
            );


        const buttons =
            document.querySelectorAll(
                ".know-satt-option"
            );


        buttons.forEach((button) => {

            button.disabled = true;

        });


        if (isCorrect) {

            this.score++;

            selectedButton.classList.add(
                "correct"
            );


            const status =
                document.getElementById(
                    "knowSattStatus"
                );


            if (status) {

                status.textContent =
                    "Correct! ❤️";

            }

        }

        else {

            selectedButton.classList.add(
                "wrong"
            );


            /*
             * Highlight the correct answer.
             * This also handles questions with
             * more than one correct answer.
             */

            questionData.correct.forEach(
                (letter) => {

                    const correctIndex =
                        letter.charCodeAt(0) - 65;

                    if (
                        buttons[correctIndex]
                    ) {

                        buttons[
                            correctIndex
                        ].classList.add(
                            "correct"
                        );

                    }

                }
            );


            const status =
                document.getElementById(
                    "knowSattStatus"
                );


            if (status) {

                status.textContent =
                    "Not quite ❤️";

            }

        }


        const nextButton =
            document.getElementById(
                "knowSattNext"
            );


        if (nextButton) {

            nextButton.style.display =
                "inline-block";

        }

    },


    /* ======================================================
       NEXT QUESTION
       ====================================================== */

    nextQuestion() {

        if (!this.answered) {

            return;

        }


        this.currentQuestion++;


        if (
            this.currentQuestion >=
            this.questions.length
        ) {

            this.showResult();

            return;

        }


        this.showQuestion();

    },


    /* ======================================================
       RESULT
       ====================================================== */

    showResult() {

        const quiz =
            document.getElementById(
                "knowSattQuiz"
            );

        const result =
            document.getElementById(
                "knowSattResult"
            );

        const score =
            document.getElementById(
                "knowSattScore"
            );

        const message =
            document.getElementById(
                "knowSattResultMessage"
            );


        if (quiz) {

            quiz.style.display = "none";

        }


        if (result) {

            result.style.display = "block";

        }


        if (score) {

            score.textContent =
                this.score + " / 9";

        }


        if (message) {

            if (this.score === 9) {

                message.textContent =
                    "You know Satt perfectly. ❤️";

            }

            else if (this.score >= 7) {

                message.textContent =
                    "You really know your Satt. ❤️";

            }

            else if (this.score >= 5) {

                message.textContent =
                    "Not bad, Baakaa. You know Satt pretty well. ❤️";

            }

            else {

                message.textContent =
                    "Looks like Satt still has a few secrets left. ❤️";

            }

        }

    },


    /* ======================================================
       FINISH
       ====================================================== */

    finish() {

        this.close();

    }

};


/* ==========================================================
   INITIALIZE KNOW YOUR SATT
   ========================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            Arcade.KnowYourSatt.init();

        }
    );

} else {

    Arcade.KnowYourSatt.init();

}