        let flavorCount = 0;

        function addFlavor(name = '', percent = '5') {
            const container = document.getElementById('flavorsContainer');
            const div = document.createElement('div');
            div.className = 'flavor-row';
            div.id = `flavor-${flavorCount}`;
            
            div.innerHTML = `
                <input type="text" id="flavorName-${flavorCount}" placeholder="Назва ароматизатора" 

value="${name || 'Ароматизатор'}">
                <div class="input-percent-wrapper">
                    <input type="number" id="flavorPercent-${flavorCount}" min="0" max="100" 

step="0.1" value="${percent}">
                </div>
                <button type="button" class="btn-remove" onclick="removeFlavor

(${flavorCount})">×</button>
            `;
            container.appendChild(div);
            flavorCount++;
        }

        function removeFlavor(id) {
            const element = document.getElementById(`flavor-${id}`);
            if (element) element.remove();
        }

        function calculate() {
            try {
                const totalVolume = parseFloat(document.getElementById('totalVolume').value);
                const baseType = document.getElementById('baseType').value;
                const nicotineStrength = parseFloat(document.getElementById

('nicotineStrength').value);
                const [baseVG, basePG] = baseType.split('/').map(Number);

                const flavors = [];
                let totalFlavorPercent = 0;

                for (let i = 0; i < flavorCount; i++) {
                    const nameElement = document.getElementById(`flavorName-${i}`);
                    const percentElement = document.getElementById(`flavorPercent-${i}`);
                    if (nameElement && percentElement) {
                        const name = nameElement.value.trim();
                        const percent = parseFloat(percentElement.value) || 0;
                        if (name && percent > 0) {
                            flavors.push({ name, percent });
                            totalFlavorPercent += percent;
                        }
                    }
                }

                if (isNaN(totalVolume) || totalVolume <= 0) {
                    alert('Будь ласка, введіть коректний загальний об\'єм');
                    return;
                }

                if (flavors.length === 0) {
                    alert('Будь ласка, додайте хоча б один ароматизатор');
                    return;
                }

                if (totalFlavorPercent <= 0 || totalFlavorPercent > 30) {
                    alert('Загальний відсоток ароматизаторів повинен бути від 0.1% до 30%');
                    return;
                }

                const flavorVolume = totalVolume * totalFlavorPercent / 100;
                const baseVolume = totalVolume - flavorVolume;

                const totalPGFromBase = baseVolume * basePG / 100;
                const totalVGFromBase = baseVolume * baseVG / 100;
                const totalPGFromFlavors = flavorVolume;
                const finalPG = totalPGFromBase + totalPGFromFlavors;
                const finalVG = totalVGFromBase;
                const finalTotal = finalPG + finalVG;

                const finalVGRatio = Math.round((finalVG / finalTotal) * 1000) / 10;
                const finalPGRatio = Math.round((finalPG / finalTotal) * 1000) / 10;

                const finalNicotineStrength = (baseVolume * nicotineStrength) / totalVolume;

                document.getElementById('baseResult').innerHTML = 
                    `<strong>База:</strong> ${baseVolume.toFixed(1)} мл (${baseVG} VG / ${basePG} 

PG), ${nicotineStrength} мг/мл нікотину`;

                let flavorsText = '<strong>Ароматизатори:</strong><br>';
                flavors.forEach(flavor => {
                    const volume = totalVolume * flavor.percent / 100;
                    const drops = volume * 35;
                    
                    // Визначаємо точність відображення об'єму
                    let volumeDisplay;
                    if (volume < 0.1) {
                        volumeDisplay = volume.toFixed(3); // Для дуже малих об'ємів
                    } else if (volume < 1) {
                        volumeDisplay = volume.toFixed(2); // Для об'ємів менше 1 мл
                    } else {
                        volumeDisplay = volume.toFixed(1); // Для об'ємів 1 мл і більше
                    }
                    
                    flavorsText += `${flavor.name}: ${volumeDisplay} мл (${flavor.percent.toFixed

(1)}%)`;
                    
                    if (drops > 0) {
                        flavorsText += ` — приблизно ${drops.toFixed(0)} крапель`;
                    }
                    
                    // Додаємо примітку для малих об'ємів
                    if (volume < 0.1) {
                        flavorsText += `<div class="small-volume-note">Примітка: це дуже малий об'єм, 

вимірюйте обережно!</div>`;
                    }
                    
                    flavorsText += '<br>';
                });
                document.getElementById('flavorsResult').innerHTML = flavorsText;

                document.getElementById('finalVolume').innerHTML =
                    `<strong>Кінцевий об'єм:</strong> ${totalVolume.toFixed(1)} мл`;
                document.getElementById('finalRatio').innerHTML = 
                    `<strong>Кінцеве співвідношення:</strong> ${finalVGRatio.toFixed(1)} VG / 

${finalPGRatio.toFixed(1)} PG`;
                document.getElementById('nicotineResult').innerHTML = 
                    `<strong>Вміст нікотину:</strong> ${finalNicotineStrength.toFixed(1)} мг/мл`;

                const resultDiv = document.getElementById('result');
                const warningDiv = document.getElementById('vgWarning');

                if (finalVGRatio < 50) {
                    const neededVG = (0.5 * finalTotal - finalVG) / 0.5;
                    const newTotal = totalVolume + neededVG;
                    const newFinalVG = finalVG + neededVG;
                    const newFinalPG = finalPG;
                    const newFlavorVolume = flavorVolume;
                    const newNicotineStrength = (baseVolume * nicotineStrength) / newTotal;

                    const newVGPercent = Math.round((newFinalVG / newTotal) * 1000) / 10;
                    const newPGPercent = Math.round((newFinalPG / newTotal) * 1000) / 10;
                    const newFlavorPercent = Math.round((newFlavorVolume / newTotal) * 1000) / 10;

                    warningDiv.innerHTML = `
                        <strong>Увага:</strong> VG менше 50%. Додайте ${neededVG.toFixed(1)} мл 

чистого VG для досягнення 50/50 співвідношення.<br>
                        <div class="new_param" style="color:#2c3e50;">
                            <strong>Нові параметри після додавання VG:</strong><br>
                            - Новий об'єм: ${newTotal.toFixed(1)} мл<br>
                            - VG/PG: ${newVGPercent.toFixed(1)} / ${newPGPercent.toFixed(1)}<br>
                            - Ароматизатори: ${newFlavorPercent.toFixed(1)}%<br>
                            - Нікотин: ${newNicotineStrength.toFixed(1)} мг/мл
                        </div>
                    `;
                    warningDiv.className = 'warning';
                } else {
                    warningDiv.innerHTML = '';
                    warningDiv.className = '';
                }

                resultDiv.style.display = 'block';
            } catch (e) {
                alert('Сталася помилка при розрахунку: ' + e.message);
                console.error(e);
            }
        }

        window.onload = function() {
            addFlavor('Перший ароматизатор', 15);
        };
