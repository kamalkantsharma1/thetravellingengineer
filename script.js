/* ========== contact form handling (GitHub Pages -> Google Apps Script) ========== */
/* Replace the ENDPOINT with your Apps Script web app URL */
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwCzkEf8Qs5hCelEYefeEyB-fGGGcw3v7LjMPsAhncY2hqdQBqRYR4YNy9FjtT5fh6f/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const clearBtn = document.getElementById("clearBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending...";
    statusEl.style.color = "";

    // Collect form data
    const payload = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      query: document.getElementById("query").value.trim()
    };

    // Basic validation
    if (!payload.name || !payload.email || !payload.phone || !payload.query) {
      statusEl.textContent = "Please fill all required fields.";
      statusEl.style.color = "var(--orange)";
      return;
    }

    try {
      // POST JSON to Apps Script Web App
      const res = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors" // normally works when Apps Script is deployed "Anyone, even anonymous"
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.status === "ok") {
          statusEl.textContent = "Thank you! We'll contact you shortly.";
          statusEl.style.color = "green";
          form.reset();
        } else {
          throw new Error("Server returned error");
        }
      } else {
        // sometimes Apps Script returns 200 but CORS preflight fails etc.
        // handle as fallback
        throw new Error("Network response not ok");
      }
    } catch (err) {
      console.error(err);
      // Fallback UX: still tell user message received (Apps Script may still have saved it)
      statusEl.textContent = "Thanks — message submitted. If you don't hear from us, email contact@your-domain.com";
      statusEl.style.color = "var(--orange)";
    }
  });

  clearBtn.addEventListener("click", () => {
    form.reset();
    statusEl.textContent = "";
  });
});
