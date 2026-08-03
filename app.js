document.addEventListener("DOMContentLoaded", () => {

    const beginJourney = document.getElementById("beginJourney");
    const intro = document.getElementById("intro");
    const timeline = document.getElementById("timeline");

    const loadingScreen = document.getElementById("loadingScreen");
    const loadingProgress = document.getElementById("loadingProgress");
    const loadingText = document.getElementById("loadingText");

    const startStory = document.getElementById("startStory");

    const messages = [
        "Recovering conversations...",
        "Finding Mulund Home Stay...",
        "Loading bike rides...",
        "Unlocking Baakaa's heart...",
        "Almost ready ❤️"
    ];

    if (beginJourney) {

        beginJourney.addEventListener("click", () => {

            loadingScreen.classList.remove("hidden");

            let progress = 0;
            let index = 0;

            loadingText.textContent = messages[0];

            const interval = setInterval(() => {

                progress += 20;

                loadingProgress.style.width = progress + "%";

                if (index < messages.length - 1) {
                    index++;
                    loadingText.textContent = messages[index];
                }

                if (progress >= 100) {

                    clearInterval(interval);

                    setTimeout(() => {

                        loadingScreen.classList.add("hidden");

                        intro.scrollIntoView({
                            behavior: "smooth"
                        });

                    }, 500);

                }

            }, 600);

        });

    }

    if (startStory) {

        startStory.addEventListener("click", () => {

            timeline.scrollIntoView({
                behavior: "smooth"
            });

        });

    }

});
/* ==========================
   STORY CARD ANIMATIONS
========================== */

const storyCards = document.querySelectorAll(".story-card");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.25

});

storyCards.forEach((card) => {

    observer.observe(card);

});