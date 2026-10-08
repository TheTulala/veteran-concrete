// Shared behavior: mobile nav toggle and scroll reveal.
(function () {
  "use strict";

  document.documentElement.classList.add("has-js");

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after picking an in-page link (e.g. /#estimate) and on Escape.
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Services dropdown: a disclosure button. Escape and outside clicks close it.
  const subToggle = document.querySelector(".nav-sub__toggle");

  if (subToggle) {
    const setSubOpen = (open) => subToggle.setAttribute("aria-expanded", String(open));

    subToggle.addEventListener("click", () => {
      setSubOpen(subToggle.getAttribute("aria-expanded") !== "true");
    });

    // Capture phase, so Escape closes the dropdown before the mobile menu handler closes the whole menu.
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && subToggle.getAttribute("aria-expanded") === "true") {
          event.stopPropagation();
          setSubOpen(false);
          subToggle.focus();
        }
      },
      true
    );

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-sub")) {
        setSubOpen(false);
      }
    });
  }

  const revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
