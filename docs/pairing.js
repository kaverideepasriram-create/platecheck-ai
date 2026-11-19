// Reliable offline food-pairing helper for the published GitHub Pages site.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const field = document.getElementById("chatQuestion");
  const output = document.getElementById("chatAnswer");
  if (!form || !field || !output || form.dataset.pairingReady === "yes") return;
  form.dataset.pairingReady = "yes";

  const ideas = [
    [["roti","chapati","phulka"],"Try dal or chana, a vegetable sabzi and curd. You could also pair roti with egg curry or chicken curry and vegetables."],
    [["rice","biryani"],"Try rice with dal or rajma, vegetables and raita. For a non-vegetarian option, egg, fish or chicken curry can be served with vegetables."],
    [["dosa","idli"],"Sambar adds lentils and vegetables, and coconut chutney makes a tasty accompaniment. An egg dish is another optional side."],
    [["pasta","spaghetti"],"Add tomato sauce and vegetables, then include beans, lentils or cheese. Egg, chicken or fish are other protein options."],
    [["bread","toast","sandwich"],"Try paneer, hummus, beans or cheese with cucumber and tomato. Egg, tuna or chicken are other filling options."],
    [["noodles","ramen"],"Add plenty of vegetables and tofu or edamame. Egg, chicken or prawns are other options."],
    [["potato","aloo"],"Pair potatoes with dal, chickpeas, paneer or egg, and add a vegetable or salad."],
    [["oats","porridge"],"Try milk or fortified soy milk, fruit, and nuts or seeds. Yogurt is another option."],
    [["salad"],"Add chickpeas, kidney beans, tofu, paneer or nuts. If you eat non-vegetarian foods, egg, tuna, fish or chicken also work."],
    [["soup"],"Have soup with whole-grain toast and beans, lentils or tofu. Egg or chicken can be added if you eat them."],
    [["pizza"],"Add vegetable toppings such as mushrooms, peppers and spinach, with a side salad. Beans or chicken can add protein."],
    [["burger"],"Try a bean or veggie patty, or a chicken patty, with lettuce and tomato. Add a side salad or corn."],
    [["egg","eggs","omelette","omelet"],"Eggs go well with whole-grain toast and vegetables such as tomatoes or spinach. For an egg-free alternative, try beans, tofu or paneer."],
    [["chicken"],"Serve chicken with rice, roti or potatoes and a colourful vegetable side such as carrots, broccoli or salad."],
    [["fish","salmon","tuna","prawns","shrimp"],"Serve fish or prawns with rice or potatoes and vegetables such as peas, broccoli or salad."],
    [["curry"],"Pair curry with rice or roti and a vegetable side. Protein choices can include dal, chickpeas, paneer, egg, fish or chicken."]
  ];

  form.addEventListener("submit", event => {
    event.preventDefault();
    const q = field.value.trim().toLowerCase();
    if (!q) {
      output.textContent = "Please type a food or a question first, for example: What can I eat with roti?";
      return;
    }
    const match = ideas.find(([keys]) => keys.some(key => q.includes(key)));
    let answer;
    if (match) {
      answer = match[1];
    } else if (/balanced|healthy|food pyramid|food groups/.test(q)) {
      answer = "A varied meal can include grains or other starchy foods, vegetables or fruit, and a protein-rich food. Dairy or a fortified alternative can also provide useful nutrients. The food pyramid is a general learning guide, not a strict rule for every meal.";
    } else if (/protein|vegetarian|veg/.test(q)) {
      answer = "Protein-rich choices include dal, chickpeas, rajma, beans, tofu, paneer, milk, curd, nuts and seeds. If you eat non-vegetarian foods, eggs, fish and chicken are also options.";
    } else {
      answer = "I can help with pairings for roti, rice, dosa, idli, pasta, bread, noodles, potatoes, oats, salad, soup, pizza, burgers, eggs, chicken and fish. Try asking, “What can I serve with rice?”";
    }
    output.textContent = answer + " This is an educational food-pairing guide, not a live AI service.";
  });
});
