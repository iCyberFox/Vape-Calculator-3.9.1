    let flavorCount = 0;

    function addFlavor(defaultName = '', defaultCurrent = '', defaultTarget = '') {
      flavorCount++;
      const container = document.getElementById('flavors');
      const wrapper = document.createElement('div');
      wrapper.className = 'flavor-container';

      const row = document.createElement('div');
      row.className = 'flavor-row';
      row.innerHTML = `
        <input type="text" value="${defaultName || `Ароматизатор ${flavorCount}`}" />
        <input type="number" placeholder="% поточний" step="0.01" value="${defaultCurrent}"/>
        <input type="number" placeholder="% цільовий" step="0.01" value="${defaultTarget}"/>
        <button class="remove-btn" onclick="removeFlavor(this)">×</button>
      `;
      wrapper.appendChild(row);
      container.appendChild(wrapper);
    }

    function removeFlavor(button) {
      button.closest('.flavor-container').remove();
      flavorCount = 0;
      const rows = document.querySelectorAll('#flavors .flavor-row');
      rows.forEach((row, index) => {
        const input = row.querySelector('input[type="text"]');
        input.value = `Ароматизатор ${index + 1}`;
        flavorCount++;
      });
    }

    function calculate() {
      const volume = parseFloat(document.getElementById('volume').value);
      const rows = document.querySelectorAll('#flavors .flavor-row');
      let resultText = '';

      rows.forEach((row, index) => {
        const inputs = row.querySelectorAll('input');
        const name = inputs[0].value;
        const current = parseFloat(inputs[1].value);
        const target = parseFloat(inputs[2].value);
        const currentFlavor = volume * (current / 100);
        const x = (target / 100 * volume - currentFlavor) / (1 - target / 100);

        if (x >= 0 && isFinite(x)) {
          const drops = x * 33;
          resultText += `${name}: додати ${x.toFixed(3)} мл (${drops.toFixed(0)} каплі)\n`;
        } else {
          resultText += `${name}: помилка в розрахунках\n`;
        }
      });

      document.getElementById('increaseResult').innerText = resultText.trim();
    }

    function calculateDilution() {
      const V1 = parseFloat(document.getElementById('currentVolume').value);
      const C1 = parseFloat(document.getElementById('currentPercent').value);
      const C2 = parseFloat(document.getElementById('targetPercent').value);

      if (isNaN(V1) || isNaN(C1) || isNaN(C2) || C2 >= C1 || C2 <= 0 || C1 <= 0) {
        document.getElementById('dilutionResult').innerText = 'Помилка: перевірте введені значення.';
        return;
      }

      const V2 = V1 * C1 / C2;
      const additional = V2 - V1;

      document.getElementById('dilutionResult').innerText =
        `Додати ${additional.toFixed(2)} мл бази.\nКінцевий обʼєм: ${V2.toFixed(2)} мл.`;
    }

    addFlavor();