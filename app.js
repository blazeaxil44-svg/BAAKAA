document.addEventListener("DOMContentLoaded", () => {
   const loadingScreen = document.getElementById("loadingScreen");

if(sessionStorage.getItem("baakaaVisited")){

    loadingScreen.classList.add("hidden");

}else{

    sessionStorage.setItem("baakaaVisited","true");

}

console.log("❤️ BAAKAA Loaded");

/* ===========================================
   LOADING SCREEN
=========================================== */

const progressBar = document.getElementById("loadingProgress");

const loadingMessage = document.getElementById("loadingMessage");

const beginButton = document.getElementById("beginJourney");

const startStory = document.getElementById("startStory");

const messages = [

"❤️ Collecting our memories...",

"🏡 Visiting Mulund Home Stay...",

"🏍 Remembering our rides...",

"💬 Reading every chat...",

"💖 Almost ready..."

];

function startLoading(callback){

    loadingScreen.classList.remove("hidden");

    let progress = 0;
    let message = 0;

    progressBar.style.width = "0%";
    loadingMessage.textContent = messages[0];

    const loader = setInterval(()=>{

        progress += 2;

        progressBar.style.width = progress + "%";

        if(progress % 20 === 0 && message < messages.length - 1){

            message++;
            loadingMessage.textContent = messages[message];

        }

        if(progress >= 100){

            clearInterval(loader);

            loadingScreen.classList.add("hidden");

            if(callback){

                callback();

            }

        }

    },45);

}
startLoading();
if (beginButton) {

    beginButton.addEventListener("click", () => {

        const chapter = document.getElementById("chapter1");

        if (chapter) {

            chapter.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } else {

            console.error("chapter1 section not found");

        }

    });

}

if(startStory){

startStory.addEventListener("click",()=>{

document.getElementById("timeline").scrollIntoView({

behavior:"smooth"

});

});

}

/* ===========================================
   TIMELINE REVEAL
=========================================== */

const cards = document.querySelectorAll(".timeline-card");

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:.25

});

cards.forEach(card=>observer.observe(card));
/* ===========================================
   MEMORY MODAL
=========================================== */

const memoryModal=document.getElementById("memoryModal");

const memoryImage=document.getElementById("memoryImage");

const memoryTitle=document.getElementById("memoryTitle");

const memoryDescription=document.getElementById("memoryDescription");

const closeMemory=document.getElementById("closeMemory");

cards.forEach(card=>{

card.addEventListener("click",()=>{

const img=card.querySelector("img");

const title=card.querySelector("h3");

const text=card.querySelector("p");

if(img){

memoryImage.src=img.src;

}

memoryTitle.textContent=title.textContent;

memoryDescription.textContent=text.textContent;

memoryModal.classList.add("show");

});

});

if(closeMemory){

closeMemory.addEventListener("click",()=>{

memoryModal.classList.remove("show");

});

}

memoryModal.addEventListener("click",(e)=>{

if(e.target===memoryModal){

memoryModal.classList.remove("show");

}

});

/* ===========================================
   GALLERY
=========================================== */

const galleryImages=document.querySelectorAll(".gallery-grid img");

const galleryModal=document.getElementById("galleryModal");

const galleryPreview=document.getElementById("galleryPreview");

const closeGallery=document.getElementById("closeGallery");

galleryImages.forEach(image=>{

image.addEventListener("click",()=>{

galleryPreview.src=image.src;

galleryModal.classList.add("show");

});

});

if(closeGallery){

closeGallery.addEventListener("click",()=>{

galleryModal.classList.remove("show");

});

}

galleryModal.addEventListener("click",(e)=>{

if(e.target===galleryModal){

galleryModal.classList.remove("show");

}

});

/* ===========================================
   GIFT
=========================================== */

const gift=document.getElementById("giftBox");

const surpriseModal=document.getElementById("surpriseModal");

const closeSurprise=document.getElementById("closeSurprise");

if(gift){

gift.addEventListener("click",()=>{

gift.classList.add("open");

createHearts();

setTimeout(()=>{

surpriseModal.classList.add("show");

},900);

});

}

if(closeSurprise){

closeSurprise.addEventListener("click",()=>{

surpriseModal.classList.remove("show");

gift.classList.remove("open");

});

}

surpriseModal.addEventListener("click",(e)=>{

if(e.target===surpriseModal){

surpriseModal.classList.remove("show");

gift.classList.remove("open");

}

});

/* ===========================================
   FLOATING HEARTS
=========================================== */

function createHearts(){

for(let i=0;i<25;i++){

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";

heart.style.left=Math.random()*window.innerWidth+"px";

heart.style.top=window.innerHeight+"px";

heart.style.fontSize=(20+Math.random()*25)+"px";

heart.style.pointerEvents="none";

heart.style.zIndex="99999";

heart.style.transition="all 3s ease";

document.body.appendChild(heart);

setTimeout(()=>{

heart.style.transform=`translateY(-${window.innerHeight+200}px)
rotate(${Math.random()*360}deg)`;

heart.style.opacity="0";

},50);

setTimeout(()=>{

heart.remove();

},3200);

}

}
/* ===========================================
   LOVE LETTER TYPEWRITER
=========================================== */

const letter=document.getElementById("letterText");

const letterContent=`My Dearest Baakaa ❤️

If you're reading this...

it means you've reached the end of our little journey.

Every memory on this website is a piece of my heart.

Thank you for every smile.

Every laugh.

Every hug.

Every late-night conversation.

Every bike ride.

Every little fight that only made us stronger.

You made ordinary days become unforgettable memories.

No matter where life takes us,

I promise to keep choosing you,

again and again,

every single day.

I love you more than words can ever describe.

Forever Yours,

❤️ Satt`;

let index=0;

function typeLetter(){

if(!letter) return;

if(index<letterContent.length){

letter.textContent+=letterContent.charAt(index);

index++;

setTimeout(typeLetter,35);

}

}

const letterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

letter.textContent="";

index=0;

typeLetter();

letterObserver.disconnect();

}

});

},

{

threshold:.4

});

if(letter){

letterObserver.observe(letter);

}

/* ===========================================
   MUSIC
=========================================== */

const music=document.getElementById("bgMusic");
const musicButton=document.getElementById("musicToggle");

music.loop = true;

let playing=false;

if(musicButton){

musicButton.addEventListener("click",()=>{

if(!playing){

music.play();

playing=true;

musicButton.textContent="🔊";

}else{

music.pause();

playing=false;

musicButton.textContent="🎵";

}

});

}

/* ===========================================
   SCROLL TO TOP
=========================================== */

const scrollButton=document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>600){

scrollButton.classList.add("show");

}else{

scrollButton.classList.remove("show");

}

});

scrollButton.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ===========================================
   TIMELINE ANIMATION
=========================================== */

cards.forEach(card=>{

card.style.opacity="0";

card.style.transform="translateY(50px)";

});

const revealObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.transition="all .8s ease";

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},

{

threshold:.2

});

cards.forEach(card=>{

revealObserver.observe(card);

});

/* ===========================================
   END
=========================================== */
/* ===========================================
   MEMORY LANE
=========================================== */

const storyButtons = document.querySelectorAll(".storybook-section .story-btn");

const storyModal = document.getElementById("storyModal");

const storyImage = document.getElementById("storyImage");

const storyTitle = document.getElementById("storyTitle");

const storyText = document.getElementById("storyText");

const storyJoke = document.getElementById("storyJoke");

const closeStory = document.getElementById("closeStory");

const stories = {

1:{

title:"❤️ The Sudden Stay",

image:"assets/images/story1.jpg",

text:"Sometimes the best stories are the ones we never planned. Three unexpected days together, uncertainty about when Mom would return, a delicious Paneer Subway, your beautiful dance, endless conversations, and laughter that made every moment unforgettable.",

joke:"Last but not least... the muscle closure 😂"

},

2:{

title:"🏍 The Never-Ending Journey",

image:"assets/images/story2.jpg",

text:"Every bike ride became an adventure. Wrong turns, your famous lefts and rights, the unforgettable ride to SNDT College, and the legendary Paper Dosa. Every road became special simply because you were there.",

joke:"Your navigation... Left? Right? Uffff 😂"

},

3:{

title:"🏡 Two Months of Us",

image:"assets/images/story3.jpg",

text:"Two months filled with cuddles, surprises, late evenings, the red lamp, endless laughter and yes... THE EXPENSES 😂. Those ordinary days slowly became some of the happiest memories of my life.",

joke:"'Gharwale nahi aare hai na... BAE kya mei aau aaj?' ❤️"

},

4:{

title:"🌧 Dangerous Sux",

image:"assets/images/story4.jpg",

text:"Probably the craziest chapter of our story. Dangerous moments, unforgettable thrills, and memories that still make my heart race. Looking back, every risky moment became another reason to smile.",

joke:"Baal baal bachna wale harkat hai apne Boo 😂"

},

5:{

title:"📞 The Calls That Never Felt Long Enough",

image:"assets/images/story5.jpg",

text:"From 2017 onwards, countless texts slowly became endless calls. The legendary 13-hour call, sleepless nights, and conversations that made distance disappear completely.",

joke:"'What are we going to do on 8th October?' 😂"

}

};

storyButtons.forEach(button=>{

button.addEventListener("click",()=>{

const id=button.dataset.story;

storyTitle.textContent=stories[id].title;

storyImage.src=stories[id].image;

storyText.textContent=stories[id].text;

storyJoke.textContent=stories[id].joke;

storyModal.classList.add("show");

});

});

closeStory.addEventListener("click",()=>{

storyModal.classList.remove("show");

});

storyModal.addEventListener("click",(e)=>{

if(e.target===storyModal){

storyModal.classList.remove("show");

}

});
});