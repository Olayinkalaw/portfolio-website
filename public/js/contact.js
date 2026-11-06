const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

function show(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = "form-status " + type;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form));

  if (!payload.name.trim() || !/^\S+@\S+\.\S+$/.test(payload.email) || !payload.message.trim()) {
    return show("Please add your name, a valid email and a message.", "err");
  }

  const btn = form.querySelector(".submit");
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Something went wrong.");
    form.reset();
    show("Thanks! Your message has been sent.", "ok");
  } catch (err) {
    show(err.message, "err");
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit";
  }
});