const pgvg1 = document.getElementById('pgvg1');
    const pgvg2 = document.getElementById('pgvg2');
    const label1 = document.getElementById('pgvgLabel1');
    const label2 = document.getElementById('pgvgLabel2');
    const vg1Field = document.getElementById('vg1');
    const pg1Field = document.getElementById('pg1');
    const vg2Field = document.getElementById('vg2');
    const pg2Field = document.getElementById('pg2');

    function syncSliderAndFields(slider, vgInput, pgInput, label) {
      slider.oninput = () => {
        const pg = parseInt(slider.value);
        const vg = 100 - pg;
        vgInput.value = vg;
        pgInput.value = pg;
        label.textContent = `${vg}/${pg}`;
      };

      vgInput.oninput = () => {
        let vg = parseInt(vgInput.value);
        if (isNaN(vg) || vg < 0) vg = 0;
        if (vg > 100) vg = 100;
        const pg = 100 - vg;
        pgInput.value = pg;
        slider.value = pg;
        label.textContent = `${vg}/${pg}`;
      };

      pgInput.oninput = () => {
        let pg = parseInt(pgInput.value);
        if (isNaN(pg) || pg < 0) pg = 0;
        if (pg > 100) pg = 100;
        const vg = 100 - pg;
        vgInput.value = vg;
        slider.value = pg;
        label.textContent = `${vg}/${pg}`;
      };
    }

    syncSliderAndFields(pgvg1, vg1Field, pg1Field, label1);
    syncSliderAndFields(pgvg2, vg2Field, pg2Field, label2);

    function calculate() {
      const v1 = parseFloat(document.getElementById('volume1').value);
      const n1 = parseFloat(document.getElementById('nic1').value);
      const pg1 = parseFloat(pg1Field.value);
      const vg1 = parseFloat(vg1Field.value);

      const v2 = parseFloat(document.getElementById('volume2').value);
      const n2 = parseFloat(document.getElementById('nic2').value);
      const pg2 = parseFloat(pg2Field.value);
      const vg2 = parseFloat(vg2Field.value);

      const totalVol = v1 + v2;
      const totalNic = (v1 * n1) + (v2 * n2);
      const finalNic = (totalNic / totalVol).toFixed(2);

      const pg = (v1 * (pg1 / 100)) + (v2 * (pg2 / 100));
      const vg = (v1 * (vg1 / 100)) + (v2 * (vg2 / 100));
      const finalPG = ((pg / totalVol) * 100).toFixed(1);
      const finalVG = ((vg / totalVol) * 100).toFixed(1);

      const resultBlock = document.getElementById('result');
      resultBlock.style.display = 'block';

      resultBlock.innerHTML = `
        <div class="results-title">Результати:</div>
        <p><span class="result-label">База:</span>${totalVol.toFixed(1)} мл</p>
        <p><span class="result-label">Кінцеве співвідношення:</span>${finalVG} VG / ${finalPG} PG</p>
        <p><span class="result-label">Вміст нікотину:</span>${finalNic} мг/мл</p>
      `;
    }