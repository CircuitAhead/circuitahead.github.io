document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const year = document.querySelector("#current-year");


  /* ---------------------------------------------------------
     HEADER
     --------------------------------------------------------- */

  const updateHeader = () => {
    if (window.scrollY > 15) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;

    menuButton.classList.remove("active");
    mobileNav.classList.remove("open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );
  };


  menuButton?.addEventListener("click", () => {

    const isOpen =
      menuButton.classList.toggle("active");

    mobileNav?.classList.toggle(
      "open",
      isOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  mobileLinks.forEach((link) => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });


  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) {
      closeMenu();
    }
  });


  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  } else {

    const observer =
      new IntersectionObserver(
        (entries, revealObserver) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -45px 0px"
        }
      );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  }


  /* ---------------------------------------------------------
     YEAR
     --------------------------------------------------------- */

  if (year) {
    year.textContent =
      String(new Date().getFullYear());
  }

});