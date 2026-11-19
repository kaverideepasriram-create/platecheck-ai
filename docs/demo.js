(function(){
  const samples = {
    "01-vegetarian-indian-thali.jpg": ["Vegetarian Indian thali","Rice, roti, dal, paneer, vegetables and curd appear visible.",["This meal already shows grains, protein-rich foods, vegetables and a calcium-rich food.","No fruit is obvious in the photo. You could add papaya, guava or orange if you would like."]],
    "02-non-vegetarian-indian-thali.jpg": ["Non-vegetarian Indian thali","Rice, roti, chicken and egg curry appear visible.",["Protein and grains are visible.","A clear vegetable side is not obvious. You could add beans, carrots or spinach. Fruit can add variety too."]],
    "03-grilled-chicken-meal.jpg": ["Grilled chicken meal","Chicken, potato, broccoli and carrots appear visible.",["Chicken provides protein, and broccoli and carrots provide vegetables.","No fruit is obvious. You could add an orange or berries. Yogurt is another possible calcium-rich addition."]],
    "04-vegetable-pasta.jpg": ["Vegetable pasta","Pasta, tomato sauce and salad vegetables appear visible. A protein-rich ingredient is not obvious.",["You could add chickpeas, beans, lentils, tofu or cheese to include a protein-rich food.","Fruit could add variety too."]],
    "05-japanese-bento.jpg": ["Japanese bento box","Rice, fish or chicken, egg and vegetables appear visible.",["Several food groups are visible, including grains, protein-rich foods and vegetables.","No fruit is obvious. You could add orange slices or berries. A calcium-rich food could add variety."]],
    "06-tofu-rice-bowl.jpg": ["Tofu and rice bowl","Rice, tofu, broccoli and peppers appear visible.",["Rice, tofu and vegetables are visible.","You could add fruit, such as a banana or orange. Fortified soy milk or another calcium-rich food is another option."]],
    "07-south-indian-breakfast-idli-dosa.jpg": ["South Indian idli and dosa breakfast","Idli, dosa, sambar and chutneys appear visible. Lentils in sambar provide some protein.",["Idli and dosa provide grains, and lentils in sambar provide some protein.","You could add peanut chutney or roasted chana for another protein-rich option. Fruit could add variety too."]]
  };
  let demoSelectedFilename = null;
  function show(filename){
    const d=samples[filename], target=document.getElementById("results"), empty=document.getElementById("emptyState");
    if(!d||!target||!empty)return false;
    target.innerHTML='<p style="font-size:12px;color:#627269;font-weight:700">SAMPLE DEMONSTRATION RESULT</p><h3>'+d[0]+'</h3><p>'+d[1]+'</p><div class="ideas"><h3>What could you add?</h3><ul>'+d[2].map(x=>'<li>'+x+'</li>').join('')+'</ul></div><p class="uncertainty">This is a prepared example, not live AI analysis. “Not obvious” means not clearly visible in this photo, not missing from your overall diet.</p>';
    empty.hidden=true;target.hidden=false;target.scrollIntoView({behavior:"smooth",block:"nearest"});return true;
  }
  document.addEventListener("click",function(e){
    const b=e.target.closest("[data-sample]");
    if(b){e.preventDefault();demoSelectedFilename=b.getAttribute("data-sample");show(demoSelectedFilename);}
  });
  document.querySelectorAll("[data-sample]").forEach(function(card){
    card.setAttribute("draggable","true");
    card.addEventListener("dragstart",function(event){
      demoSelectedFilename=card.getAttribute("data-sample");
      event.dataTransfer.setData("text/plain",demoSelectedFilename);
      event.dataTransfer.effectAllowed="copy";
    });
  });
  const dropzone=document.getElementById("dropzone");
  const preview=document.getElementById("preview");
  const previewWrap=document.getElementById("previewWrap");
  const analyzeButton=document.getElementById("analyzeButton");
  if(dropzone){
    dropzone.addEventListener("dragover",function(event){event.preventDefault();dropzone.style.outline="3px dashed #174c3a";});
    dropzone.addEventListener("dragleave",function(){dropzone.style.outline="";});
    dropzone.addEventListener("drop",function(event){
      event.preventDefault();dropzone.style.outline="";
      const filename=event.dataTransfer.getData("text/plain");
      if(!samples[filename])return;
      demoSelectedFilename=filename;
      if(preview)preview.src=filename;
      dropzone.hidden=true;
      if(previewWrap)previewWrap.hidden=false;
      if(analyzeButton){analyzeButton.disabled=false;analyzeButton.textContent="Show PlateCheck result →";}
      const empty=document.getElementById("emptyState");
      if(empty){empty.hidden=false;empty.innerHTML="<strong>Sample photo added</strong><span>Press the button to see its matching demo result.</span>";}
      const results=document.getElementById("results");if(results)results.hidden=true;
    });
  }
  if(analyzeButton) analyzeButton.addEventListener("click",function(){
    if(demoSelectedFilename){show(demoSelectedFilename);analyzeButton.textContent="Sample result shown";}
  });
  const analyze=document.getElementById("analyzeButton"), input=document.getElementById("photoInput");
  if(analyze) analyze.addEventListener("click",function(){
    const file=input&&input.files&&input.files[0];
    if(!file)return;
    if(show(file.name)){analyze.textContent="Sample result shown";return;}
    const target=document.getElementById("results"),empty=document.getElementById("emptyState");
    empty.hidden=true;target.hidden=false;
    target.innerHTML='<div class="ideas"><h3>Photo uploaded successfully</h3><p>This photo is not one of the seven prepared samples. Live AI photo recognition is not connected yet, so this image cannot be analysed automatically.</p></div>';
  });
})();