function updateTotalPercent() {
  const percents = document.querySelectorAll('.flavorPercent');
  let total = 0;
  percents.forEach(p => {
    const val = parseFloat(p.value);
    if(!isNaN(val)) total += val;
  });
  const totalDiv = document.querySelector('.total-percent');
  totalDiv.innerText = `Сумарний %: ${total.toFixed(1)}%`;
  totalDiv.style.color = total > 100 ? 'red' : '#555';
}

function updateResult() {
  const shotVolume = parseFloat(document.getElementById('shotVolume').value);
  const names = document.querySelectorAll('.flavorName');
  const percents = document.querySelectorAll('.flavorPercent');

  let totalPercent = 0;
  names.forEach((n,i)=>{
    const val = parseFloat(percents[i].value);
    if(!isNaN(val)) totalPercent += val;
  });

  if(totalPercent === 0){
    document.getElementById('result').style.display = 'none';
    return;
  }

  let resultHTML = '';
  names.forEach((name,i)=>{
    const n = name.value.trim();
    const p = parseFloat(percents[i].value);
    if(!n || isNaN(p)) return;
    const ml = (p/totalPercent)*shotVolume;
    resultHTML += `<p>${n}: ${ml.toFixed(2)} мл</p>`;
  });

  document.getElementById('resultContent').innerHTML = resultHTML;
  document.getElementById('result').style.display = 'block';
}

document.getElementById('shotVolume').addEventListener('input', updateResult);

document.getElementById('addFlavor').addEventListener('click', function(){
  const flavorDiv = document.createElement('div');
  flavorDiv.className = 'flavor-row';
  flavorDiv.innerHTML = `
    <input type="text" placeholder="Ароматизатор" class="flavorName" value="Ароматизатор">
    <div class="input-percent-wrapper">
      <input type="number" placeholder="ароматизатора" class="flavorPercent" min="0" max="100" step="0.1">
    </div>
    <button class="btn-remove removeFlavor">×</button>
  `;
  document.getElementById('flavors').appendChild(flavorDiv);
});

document.getElementById('flavors').addEventListener('click', function(e){
  if(e.target.classList.contains('removeFlavor')){
    e.target.parentElement.remove();
    updateTotalPercent();
    updateResult();
  }
});

document.getElementById('calculate').addEventListener('click', function(){
  updateTotalPercent();
  updateResult();
});

// Ініціалізація
updateTotalPercent();
updateResult();

