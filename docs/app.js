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


// PlateCheck food-pairing helper. This is a transparent, offline rule-based demo,
 // not an AI model. It works on GitHub Pages without a server or API key.
const chatForm = document.getElementById("chatForm");
if (chatForm) {
  const pairings = [
    { keys: ["roti", "chapati", "phulka"], group: "grain", veg: "dal or chana, a vegetable sabzi such as bhindi or mixed vegetables, and curd", nonveg: "egg curry or chicken curry with a vegetable sabzi and curd" },
    { keys: ["rice", "biryani"], group: "grain", veg: "dal or rajma, a vegetable dish, and raita", nonveg: "egg, fish or chicken curry, plus a vegetable side and raita" },
    { keys: ["dosa", "idli"], group: "grain", veg: "sambar for lentils and vegetables, plus coconut chutney", nonveg: "sambar and chutney; if you want a non-vegetarian side, an egg dish can also go with it" },
    { keys: ["pasta", "spaghetti"], group: "grain", veg: "tomato and vegetable sauce with beans, lentils or cheese", nonveg: "tomato and vegetable sauce with egg, chicken or fish" },
    { keys: ["bread", "toast", "sandwich"], group: "grain", veg: "paneer, hummus, beans or cheese, with cucumber and tomato", nonveg: "egg, tuna or chicken, with lettuce, cucumber or tomato" },
    { keys: ["noodles", "ramen"], group: "grain", veg: "tofu or edamame with plenty of mixed vegetables", nonveg: "egg, chicken or prawns with mixed vegetables" },
    { keys: ["potato", "aloo"], group: "starch", veg: "dal, chickpeas or paneer, plus a vegetable or salad", nonveg: "egg, fish or chicken, plus a vegetable side" },
    { keys: ["oats", "porridge"], group: "grain", veg: "milk or fortified soy milk, nuts or seeds, and fruit", nonveg: "milk or yoghurt, nuts or seeds, and fruit; an egg can be another option on the side" },
    { keys: ["salad"], group: "vegetable", veg: "chickpeas, kidney beans, tofu, paneer or nuts, with whole-grain bread", nonveg: "egg, tuna, fish or chicken, with whole-grain bread" },
    { keys: ["soup"], group: "vegetable", veg: "whole-grain toast and beans, lentils or tofu", nonveg: "whole-grain toast with egg, chicken or fish" },
    { keys: ["pancake", "waffle"], group: "grain", veg: "Greek yoghurt or regular yoghurt, nut butter, and fresh berries or banana", nonveg: "eggs and yoghurt, with fresh berries or banana" },
    { keys: ["burger", "cheeseburger"], group: "grain", veg: "a bean, lentil or veggie patty, with lettuce, tomato and a side salad or corn", nonveg: "a chicken, turkey or beef patty, with lettuce, tomato and a side salad or corn" },
    { keys: ["pizza"], group: "grain", veg: "vegetable toppings such as mushrooms, peppers and spinach, plus a side salad or beans", nonveg: "chicken or tuna topping with vegetables, plus a side salad" },
    { keys: ["taco", "tacos", "burrito", "quesadilla"], group: "grain", veg: "black beans, cheese or tofu, with lettuce, tomato, peppers and avocado", nonveg: "chicken, fish or lean beef, with lettuce, tomato, peppers and beans" },
    { keys: ["fried rice"], group: "grain", veg: "tofu or edamame with peas, carrots and other vegetables", nonveg: "egg, chicken or prawns with peas, carrots and other vegetables" },
    { keys: ["chicken"], group: "protein", veg: "if you want a vegetarian alternative, try chickpeas, tofu or paneer; add rice, potatoes or whole-grain bread and vegetables", nonveg: "rice, whole-grain bread or potatoes, with a colourful vegetable side such as broccoli, carrots or salad" },
    { keys: ["fish", "salmon", "tuna", "prawns", "shrimp"], group: "protein", veg: "if you want a vegetarian alternative, try beans, lentils, tofu or paneer; add rice or potatoes and vegetables", nonveg: "rice, whole-grain bread or potatoes, with vegetables such as broccoli, peas or salad" },
    { keys: ["egg", "eggs", "omelette", "omelet", "scrambled eggs"], group: "protein", veg: "for an egg-free option, try beans, tofu or paneer; add whole-grain toast and fruit or vegetables", nonveg: "whole-grain toast, tomatoes, spinach or mushrooms, and fruit" },
    { keys: ["steak", "beef", "lamb", "pork", "meatballs"], group: "protein", veg: "if you want a vegetarian alternative, try lentil patties, beans, tofu or mushrooms; add potatoes or whole grains and vegetables", nonveg: "potatoes, brown rice or whole-grain bread, with green vegetables or salad" },
    { keys: ["cereal", "granola"], group: "grain", veg: "milk, yoghurt or fortified soy milk, with fruit and a few nuts or seeds", nonveg: "milk or yoghurt with fruit; eggs can be served on the side if you like" },
    { keys: ["sushi"], group: "grain", veg: "tofu, edamame or vegetable rolls, with cucumber, carrots and miso soup", nonveg: "salmon, tuna or cooked prawn sushi, with edamame and cucumber or seaweed salad" },
    { keys: ["curry"], group: "meal", veg: "dal, chickpeas, paneer or tofu, with rice or roti and a vegetable side", nonveg: "chicken, fish or egg curry, with rice or roti and a vegetable side" }
  ];
  const form = chatForm;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = document.getElementById("chatQuestion").value.trim();
    const answer = document.getElementById("chatAnswer");
    if (!question) return;
    const q = question.toLowerCase();
    const match = pairings.find(item => item.keys.some(key => q.includes(key)));
    const matchedFood = match ? match.keys.find(key => q.includes(key)) : "";
    let response;
    if (match) {
      response = "A few ideas to go with " + matchedFood + ":\n\nVegetarian: " + match.veg + ".\n\nIf you eat non-vegetarian foods: " + match.nonveg + ".\n\nA helpful balance is to combine a grain or starchy food with protein-rich foods and vegetables or fruit. Choose the combinations you enjoy and that fit your usual meals.";
    } else if (/non.?veg|non vegetarian|meat|chicken|fish|egg|seafood/.test(q)) {\n      response = "Non-vegetarian protein choices can include eggs, fish, chicken and other meats. Pair them with vegetables or fruit and a grain or starchy food such as rice, potatoes, roti or whole-grain bread. For example, grilled chicken goes well with brown rice and vegetables; fish can go with potatoes and salad; eggs can go with whole-grain toast and tomatoes. Vegetarian alternatives include beans, lentils, tofu and paneer.";\n    } else if (/western|american|italian|mexican|european/.test(q)) {\n      response = "Some balanced Western-style meal ideas: veggie or chicken pasta with tomato sauce and salad; a bean or chicken burger with lettuce and tomato; vegetable or chicken tacos with beans; omelette with whole-grain toast and fruit; or baked fish with potatoes and vegetables. Choose the version that suits your preferences.";\n    } else if (/protein|vegetarian|veg options/.test(q)) {
      response = "Some protein-rich choices include dal, chickpeas, rajma, beans, soy foods, tofu, paneer, milk, curd, nuts and seeds. If you eat non-vegetarian foods, eggs, fish and chicken are also options. You can pair one with rice, roti, bread or another grain, plus vegetables.";
    } else if (/balanced|healthy|food pyramid|food groups/.test(q)) {
      response = "A varied meal can include a grain or starchy food, vegetables or fruit, and a protein-rich food. Dairy or a fortified alternative can contribute calcium and other nutrients. The food pyramid is a learning guide, not a strict rule for every meal.";
    } else {
      response = "I can suggest pairings for common foods such as roti, rice, dosa, idli, pasta, bread, noodles, potatoes, oats, salad, soup, burgers, pizza, tacos, eggs, chicken, fish and sushi. You can ask about vegetarian or non-vegetarian options, too. Try: “What can I serve with grilled chicken?” or “What can I add to a veggie burger?”";
    }
    answer.textContent = response + "\n\nDemo note: This version uses a small built-in food-pairing guide, not a live AI model. The AI chat and photo recognition are planned future upgrades.";
  });
}
