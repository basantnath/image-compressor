// FAQ Accordion
document.querySelectorAll(".faq-button").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const icon = button.querySelector("svg");

    // Toggle the answer
    answer.classList.toggle("hidden");

    // Rotate the icon
    if (answer.classList.contains("hidden")) {
      icon.style.transform = "rotate(0deg)";
    } else {
      icon.style.transform = "rotate(180deg)";
    }
  });
});

// Testimonials Slider
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonials-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".testimonial-prev");
  const nextButton = document.querySelector(".testimonial-next");
  const dotsContainer = document.querySelector(".dots-container");

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Create dots for mobile navigation
  function createDots() {
    // Clear existing dots first
    dotsContainer.innerHTML = "";

    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add(
        "w-2.5",
        "h-2.5",
        "rounded-full",
        "bg-gray-300",
        "transition-all",
        "duration-300",
        "hover:bg-gray-400",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        "focus:ring-indigo-500"
      );
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    updateDots();
  }

  // Update dots active state
  function updateDots() {
    const dots = dotsContainer.querySelectorAll("button");
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.remove("bg-gray-300", "w-2.5");
        dot.classList.add("bg-indigo-600", "w-5"); // Make active dot wider
      } else {
        dot.classList.remove("bg-indigo-600", "w-5");
        dot.classList.add("bg-gray-300", "w-2.5");
      }
    });
  }

  function updateSlider() {
    const isMobile = window.innerWidth < 768;
    const shift = isMobile ? 100 : 33.333;
    track.style.transform = `translateX(-${currentIndex * shift}%)`;
    updateDots();
    updateButtonStates();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  function moveSlide(direction) {
    const isMobile = window.innerWidth < 768;
    const maxIndex = isMobile ? cards.length - 1 : cards.length - 3;

    if (direction === "next") {
      currentIndex = Math.min(currentIndex + 1, maxIndex);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateSlider();
  }

  // Touch events for mobile swipe
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const touchDiff = touchStartX - touchEndX;
    if (Math.abs(touchDiff) > 50) {
      // Minimum swipe distance
      if (touchDiff > 0) {
        moveSlide("next");
      } else {
        moveSlide("prev");
      }
    }
  }

  // Event listeners
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => moveSlide("prev"));
    nextButton.addEventListener("click", () => moveSlide("next"));
  }

  track.addEventListener("touchstart", handleTouchStart, { passive: true });
  track.addEventListener("touchmove", handleTouchMove, { passive: true });
  track.addEventListener("touchend", handleTouchEnd);

  // Handle resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const wasMobile = window.innerWidth < 768;
      const isMobile = window.innerWidth < 768;

      // Only reset if switching between mobile and desktop
      if (wasMobile !== isMobile) {
        currentIndex = 0;
        createDots(); // Recreate dots when switching views
      }
      updateSlider();
    }, 100);
  });

  // Initialize
  createDots();
  updateSlider();

  // Add swipe hint for mobile (optional)
  if (window.innerWidth < 768) {
    const swipeHint = document.createElement("div");
    swipeHint.classList.add(
      "text-sm",
      "text-gray-500",
      "text-center",
      "mt-4",
      "md:hidden"
    );
    swipeHint.textContent = "Swipe left or right to see more";
    dotsContainer.parentNode.insertBefore(swipeHint, dotsContainer.nextSibling);
  }
});
