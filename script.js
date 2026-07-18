document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 800,           // Speed of animation
        easing: 'ease-out-cubic',// Kinetic curve
        once: false,             // CRITICAL FIX: Animate elements every single time you scroll up/down
        offset: 100              // Distance from viewport element activation
    });

    typewriterEffect(".hero-title", 28);
});

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

console.log("%c👋 Theme loaded: mono / hot-pink.", "color: #4A0E2E; background:#FF6FB5; padding:2px 8px; border-radius:4px; font-size: 14px; font-weight: bold;");