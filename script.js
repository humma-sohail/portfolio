document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 800,           // Speed of animation
        easing: 'ease-out-cubic',// Kinetic curve
        once: false,             // CRITICAL FIX: Animate elements every single time you scroll up/down
        offset: 100              // Distance from viewport element activation
    });

    typewriterEffect(".hero-title", 28);
    initVoiceIntro();
});

// Speaks a spoken-word intro aloud via the Web Speech API, preferring a
// female system voice, and toggles off if clicked again mid-speech.
function initVoiceIntro() {
    var INTRO_TEXT =
        "I am Humma Sohail, a Computer Science student at the University of " +
        "Central Punjab with a strong interest in full-stack web development. " +
        "I have hands-on experience building web applications using JavaScript, " +
        "Node.js, Express.js, MongoDB, and REST APIs. I am also an AWS Certified " +
        "Cloud Practitioner and enjoy learning new technologies. I am a quick " +
        "learner, a team player, and always eager to improve my skills.";

    var btn = document.getElementById("voiceIntroBtn");
    var icon = btn ? btn.querySelector(".voice-icon") : null;
    if (!btn || !("speechSynthesis" in window)) {
        if (btn) btn.style.display = "none";
        return;
    }

    var voices = [];
    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    var FEMALE_HINTS = [
        "female", "zira", "samantha", "victoria", "susan", "karen",
        "tessa", "moira", "fiona", "aria", "jenny", "google uk english female",
        "google us english"
    ];

    function pickFemaleVoice() {
        var byHint = voices.find(function (v) {
            var n = v.name.toLowerCase();
            return FEMALE_HINTS.some(function (hint) { return n.indexOf(hint) !== -1; });
        });
        if (byHint) return byHint;
        var english = voices.find(function (v) { return v.lang && v.lang.indexOf("en") === 0; });
        return english || voices[0] || null;
    }

    function setSpeakingState(isSpeaking) {
        btn.classList.toggle("is-speaking", isSpeaking);
        btn.setAttribute("aria-label", isSpeaking ? "Stop voice introduction" : "Play voice introduction");
        if (icon) icon.innerHTML = isSpeaking ? "&#9209;" : "&#128264;";
    }

    btn.addEventListener("click", function () {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setSpeakingState(false);
            return;
        }

        var utterance = new SpeechSynthesisUtterance(INTRO_TEXT);
        var voice = pickFemaleVoice();
        if (voice) utterance.voice = voice;
        utterance.pitch = 1.05;
        utterance.rate = 1;
        utterance.onstart = function () { setSpeakingState(true); };
        utterance.onend = function () { setSpeakingState(false); };
        utterance.onerror = function () { setSpeakingState(false); };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    });
}

// Types out the hero title one character at a time, in document order,
// so the .highlight / .highlight-lime pill boxes grow along with their text.
function typewriterEffect(selector, speed) {
    var el = document.querySelector(selector);
    if (!el) return;

    // Lock in the final rendered height so the page below doesn't jump
    // around while the title grows line by line.
    el.style.minHeight = el.offsetHeight + "px";

    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
        nodes.push({ node: node, full: node.textContent });
        node.textContent = "";

        var parent = node.parentElement;
        if (parent && (parent.classList.contains("highlight") || parent.classList.contains("highlight-lime"))) {
            parent.classList.add("pill-pending");
        }
    }

    var cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    el.appendChild(cursor);

    var ni = 0, ci = 0;

    function tick() {
        if (ni >= nodes.length) {
            return; // done — cursor keeps blinking in place via CSS
        }
        var entry = nodes[ni];
        ci++;
        entry.node.textContent = entry.full.slice(0, ci);

        var parent = entry.node.parentElement;
        if (ci === 1 && parent) parent.classList.remove("pill-pending");

        if (ci >= entry.full.length) {
            ni++;
            ci = 0;
        }
        setTimeout(tick, speed);
    }

    setTimeout(tick, 300);
}

console.log("%c👋 Theme loaded: mono / matcha.", "color: #12240D; background:#C6E265; padding:2px 8px; border-radius:4px; font-size: 14px; font-weight: bold;");