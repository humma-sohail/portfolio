// Initialize AOS with continuous execution parameters
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 800,           // Speed of animation
        easing: 'ease-out-cubic',// Kinetic curve
        once: false,             // CRITICAL FIX: Animate elements every single time you scroll up/down
        offset: 100              // Distance from viewport element activation
    });
});

console.log("%c👋 Systems Recalibrated. High-Contrast & Infinite Transitions Active.", "color: #00f2fe; font-size: 14px; font-weight: bold;");