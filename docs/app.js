const input = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const previewWrap = document.getElementById("previewWrap");
const dropzone = document.getElementById("dropzone");
const analyzeButton = document.getElementById("analyzeButton");
const results = document.getElementById("results");
const emptyState = document.getElementById("emptyState");
let selectedFile = null;
let previewUrl = null;

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    showError("Please choose a JPG, PNG, or WEBP photo.");
    input.value = "";
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showError("That photo is over 8 MB. Please choose a smaller image.");
    input.value = "";
    return;
  }
  selectedFile = file;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  dropzone.hidden = true;
  previewWrap.hidden = false;
  analyzeButton.disabled = false;
  results.hidden = true;
  emptyState.hidden = false;
  emptyState.innerHTML = '<div class="empty-illustration">◉</div><strong>Your results will appear here</strong><span>Ready when you are.</span>';
});

document.getElementById("changePhoto").addEventListener("click", () => input.click());

analyzeButton.addEventListener("click", async () => {
  if (!selectedFile) return;
  analyzeButton.disabled = true;
  analyzeButton.textContent = "Checking your plate…";
  const form = new FormData();
  form.append("photo", selectedFile);
  try {
    const response = await fetch("/api/analyze", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not analyse this photo.");
    renderResults(data);
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.innerHTML = 'Check my plate <span>→</span>';
  }
});

function showError(message) {
  results.hidden = false;
  emptyState.hidden = true;
  results.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

function renderResults(data) {
  emptyState.hidden = true;
  results.hidden = false;
  const groups = Array.isArray(data.groups) ? data.groups : [];
  const rows = groups.map(group => {
    const status = ["visible", "possibly_missing", "unclear"].includes(group.status) ? group.status : "unclear";
    const label = status === "visible" ? "Visible" : status === "possibly_missing" ? "Not obvious" : "Unclear";
    return `<div class="group-row"><div class="group-top"><span>${escapeHtml(group.name || "Food group")}</span><span class="status ${status}">${label}</span></div><p>${escapeHtml(group.examples || "")}</p></div>`;
  }).join("");
  const ideas = Array.isArray(data.ideas) ? data.ideas : [];
  results.innerHTML = `
    <p style="font-size:12px;line-height:1.55;color:#627269;margin:0 0 13px">${escapeHtml(data.mealSummary || "Here are the food groups that may be visible.")}</p>
    <div class="group-list">${rows}</div>
    <div class="ideas"><h3>Ideas for variety</h3><ul>${ideas.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
    <p class="uncertainty">${escapeHtml(data.uncertainty || "A photo cannot show every ingredient or tell what you eat across the whole day.")}</p>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}


const chatForm = document.getElementById("chatForm");
if (chatForm) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = document.getElementById("chatQuestion").value.trim();
    const answer = document.getElementById("chatAnswer");
    const button = document.getElementById("chatButton");
    if (!question) return;
    button.disabled = true;
    button.textContent = "Thinking…";
    answer.textContent = "Connecting to the AI service…";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({question})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The AI service is not connected yet.");
      answer.textContent = data.answer || "I couldn't create an answer. Please try again.";
    } catch (error) {
      answer.textContent = "The online AI connection is not set up yet. Your question feature is ready, and we'll connect its free AI service next.";
    } finally {
      button.disabled = false;
      button.textContent = "Ask a food question →";
    }
  });
}
