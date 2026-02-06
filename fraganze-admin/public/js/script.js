(function ($) {
  "use strict";

  // =========================
  // HEADER STICKY
  // =========================
  function headerSticky() {
    const header = document.querySelector("#header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      header.classList.toggle("sticky", window.scrollY > 1);
    });
  }

  // =========================
  // SWIPER (TESTIMONIOS)
  // =========================
  function initSlider() {
    if (!document.querySelector(".review-swiper")) return;

    new Swiper(".review-swiper", {
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // =========================
  // AOS
  // =========================
  function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
      duration: 1200,
      once: true,
    });
  }

  // =========================
  // COLORBOX
  // =========================
  function initColorbox() {
    if (!$.fn.colorbox) return;

    $(".youtube").colorbox({
      iframe: true,
      innerWidth: 960,
      innerHeight: 585,
    });
  }

  // =========================
  // DOM READY
  // =========================
  $(function () {
    headerSticky();
    initSlider();
    initAOS();
    initColorbox();
  });

})(jQuery);
