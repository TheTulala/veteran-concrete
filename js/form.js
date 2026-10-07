// Estimate form: accessible inline validation, then a Web3Forms POST. See forms/SKILL.md.
(function () {
  "use strict";

  const form = document.getElementById("estimate-form");
  if (!form) {
    return;
  }

  const thankYou = document.getElementById("estimate-thankyou");
  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.textContent;
  const fallback = "Something went wrong sending your request. Please call (805) 717-5173 and we'll take it from there.";

  const messageFor = (field) => {
    if (field.validity.valueMissing) {
      return field.dataset.required || "This field is required.";
    }
    if (field.validity.typeMismatch || field.validity.patternMismatch) {
      return field.dataset.invalid || "Please check this entry.";
    }
    return "";
  };

  const showError = (field, message) => {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    field.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
      error.classList.add("is-visible");
    }
  };

  const clearError = (field) => {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    field.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
      error.classList.remove("is-visible");
    }
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
        clearError(field);
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("is-visible");

    const fields = [...form.querySelectorAll("[aria-describedby]")];
    const invalid = fields.filter((field) => !field.checkValidity());
    fields.forEach((field) => (invalid.includes(field) ? showError(field, messageFor(field)) : clearError(field)));

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: window.AbortSignal.timeout(15000)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error("Submission failed");
      }

      form.hidden = true;
      thankYou.hidden = false;
      thankYou.focus();
    } catch {
      status.textContent = fallback;
      status.classList.add("is-visible");
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
})();
