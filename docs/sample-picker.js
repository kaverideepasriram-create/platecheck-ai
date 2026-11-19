(function(){
  const answers={
    "01-vegetarian-indian-thali.jpg":["Vegetarian Indian thali","Rice, roti, dal, paneer, vegetables and curd appear visible.",["This meal shows grains, protein-rich foods, vegetables and curd.","No fruit is obvious. You could add papaya, guava or orange."]],
    "02-non-vegetarian-indian-thali.jpg":["Non-vegetarian Indian thali","Rice, roti, chicken and egg curry appear visible.",["Protein and grains are visible.","A clear vegetable side is not obvious. You could add beans, carrots or spinach."]],
    "03-grilled-chicken-meal.jpg":["Grilled chicken meal","Chicken, potato, broccoli and carrots appear visible.",["Chicken provides protein, and broccoli and carrots provide vegetables.","You could add fruit, such as an orange or berries. Yogurt is another possible calcium-rich addition."]],
    "04-vegetable-pasta.jpg":["Vegetable pasta","Pasta, tomato sauce and salad vegetables appear visible. A protein-rich ingredient is not obvious.",["You could add chickpeas, beans, lentils, tofu or cheese.","Fruit could add variety too."]],
    "05-japanese-bento.jpg":["Japanese bento box","Rice, fish or chicken, egg and vegetables appear visible.",["Grains, protein-rich foods and vegetables are visible.","You could add fruit, such as orange slices or berries."]],
    "06-tofu-rice-bowl.jpg":["Tofu and rice bowl","Rice, tofu, broccoli and peppers appear visible.",["Rice, tofu and vegetables are visible.","You could add fruit, such as a banana or orange. Fortified soy milk is another calcium-rich option."]],
    "07-south-indian-breakfast-idli-dosa.jpg":["South Indian idli and dosa breakfast","Idli, dosa, sambar and chutneys appear visible. Lentils in sambar provide some protein.",["Idli and dosa provide grains, and lentils in sambar provide some protein.","You could add peanut chutney or roasted chana for another protein-rich option."]]
  };
  let chosen=null;
  const el=id=>document.getElementById(id);
  function choose(file){
    if(!answers[file])return;
    chosen=file;
    const preview=el("preview"),wrap=el("previewWrap"),drop=el("dropzone"),button=el("analyzeButton"),results=el("results"),empty=el("emptyState");
    if(preview){preview.src=new URL(file,document.baseURI).href;preview.style.display="block";}
    if(wrap)wrap.hidden=false;
    if(drop)drop.hidden=true;
    if(button){button.disabled=false;button.textContent="Show PlateCheck result →";}
    if(results)results.hidden=true;
    if(empty){empty.hidden=false;empty.innerHTML="<strong>Sample photo selected</strong><span>Press the button to see the matching PlateCheck result.</span>";}
  }
  function render(){
    if(!chosen)return;
    const a=answers[chosen],results=el("results"),empty=el("emptyState");
    results.innerHTML='<p style="font-size:12px;color:#627269;font-weight:700">SAMPLE DEMONSTRATION RESULT</p><h3>'+a[0]+'</h3><p>'+a[1]+'</p><div class="ideas"><h3>What could you add?</h3><ul>'+a[2].map(x=>'<li>'+x+'</li>').join("")+'</ul></div><p class="uncertainty">Prepared example, not live AI analysis. “Not obvious” means not clearly visible in this photo, not missing from your overall diet.</p>';
    empty.hidden=true;results.hidden=false;results.scrollIntoView({behavior:"smooth",block:"nearest"});
    const b=el("analyzeButton");if(b)b.textContent="Sample result shown";
  }
  document.addEventListener("click",function(event){
    const card=event.target.closest("[data-sample]");
    if(!card)return;
    event.preventDefault();event.stopImmediatePropagation();
    choose(card.getAttribute("data-sample"));
  },true);
  document.addEventListener("dragstart",function(event){
    const card=event.target.closest("[data-sample]");if(!card)return;
    event.dataTransfer.setData("text/plain",card.getAttribute("data-sample"));event.dataTransfer.effectAllowed="copy";
  });
  const drop=el("dropzone");
  if(drop){
    drop.addEventListener("dragover",e=>e.preventDefault());
    drop.addEventListener("drop",function(e){e.preventDefault();choose(e.dataTransfer.getData("text/plain"));});
  }
  const button=el("analyzeButton");
  if(button)button.addEventListener("click",function(e){
    if(!chosen)return;
    e.preventDefault();e.stopImmediatePropagation();render();
  },true);
  const input=el("photoInput");
  if(input)input.addEventListener("change",function(){chosen=null;});
})();