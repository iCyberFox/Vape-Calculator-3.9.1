const flavorsContainer = document.getElementById('flavors');

document.querySelector('.btn-add').addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'flavor-row';
  row.innerHTML = `
    <div class="flavor-input-wrapper">
      <label>Назва ароматизатора</label>
      <input type="text" class="flavorName" value="Ароматизатор">
    </div>
    <div class="flavor-input-wrapper input-ml-wrapper">
      <label>Обʼєм (мл.)</label>
      <input type="number" class="flavorVolume" value="10" min="0" step="0.1">
    </div>
    <div class="flavor-input-wrapper input-percent-wrapper">
      <label>Концентрація (%)</label>
      <input type="number" class="flavorPercent" value="1" min="0" max="100" step="0.1">
    </div>
    <button class="btn-remove">✖</button>
  `;
  flavorsContainer.appendChild(row);

  row.querySelector('.btn-remove').addEventListener('click', () => row.remove());
});

document.querySelectorAll('.btn-remove').forEach(btn => {
  btn.addEventListener('click', function(){
    this.parentElement.remove();
  });
});

document.getElementById('calculate').addEventListener('click', function(){
  const names = document.querySelectorAll('.flavorName');
  const volumes = document.querySelectorAll('.flavorVolume');
  const percents = document.querySelectorAll('.flavorPercent');

  let totalPercent = 0;
  percents.forEach(p => totalPercent += parseFloat(p.value));

  let maxShotVolumes = [];
  for(let i=0;i<names.length;i++){
    const vol = parseFloat(volumes[i].value);
    const pct = parseFloat(percents[i].value);
    if(pct > 0){
      maxShotVolumes.push(vol * totalPercent / pct);
    }
  }

  if(maxShotVolumes.length === 0){
    alert('Вкажіть хоча б один ароматизатор з % > 0');
    return;
  }

  const maxShot = Math.min(...maxShotVolumes);

  let usageHTML = '<h4>Використано ароматизаторів:</h4>';
  let leftoversHTML = '<h4>Залишок ароматизаторів:</h4>';
  for(let i=0;i<names.length;i++){
    const name = names[i].value;
    const vol = parseFloat(volumes[i].value);
    const pct = parseFloat(percents[i].value);
    const used = pct > 0 ? maxShot * pct / totalPercent : 0;
    const left = vol - used;
    usageHTML += `<p>${name}: ${used.toFixed(2)} мл</p>`;
    leftoversHTML += `<p>${name}: ${left.toFixed(2)} мл</p>`;
  }

  document.getElementById('maxVolume').innerText = `Максимальний обʼєм шоту: ${maxShot.toFixed(2)} мл`;
  document.getElementById('usage').innerHTML = usageHTML;
  document.getElementById('leftovers').innerHTML = leftoversHTML;
  document.getElementById('result').style.display = 'block';
});