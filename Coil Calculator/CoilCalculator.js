        // Color temperature to RGB conversion
        function colorTemperatureToRGB(kelvin) {
            var temp = kelvin / 100;
            var red, green, blue;
            
            if (temp <= 66) {
                red = 255;
                green = temp;
                green = 99.4708025861 * Math.log(green) - 161.1195681661;
                if (green < 0) green = 0;
                if (green > 255) green = 255;
                
                if (temp <= 19) {
                    blue = 0;
                } else {
                    blue = temp - 10;
                    blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
                    if (blue < 0) blue = 0;
                    if (blue > 255) blue = 255;
                }
            } else {
                red = temp - 60;
                red = 329.698727446 * Math.pow(red, -0.1332047592);
                if (red < 0) red = 0;
                if (red > 255) red = 255;
                
                green = temp - 60;
                green = 288.1221695283 * Math.pow(green, -0.0755148492);
                if (green < 0) green = 0;
                if (green > 255) green = 255;
                
                blue = 255;
            }
            
            return {
                r: Math.round(red),
                g: Math.round(green),
                b: Math.round(blue)
            };
        }

        // Twisted wire effect
        function twistedatt() {
            var numwire = Number($("input[name=wires_number]:checked").val());
            if (numwire == 1) {
                document.getElementById("twistatt").style.backgroundColor = "#FF0000";
            }
            setTimeout(function() { 
                document.getElementById("twistatt").style.backgroundColor = "" 
            }, 500);
        }

        // Main calculation function
        function compute() {
            var c1 = Number($("input[name=wires_number]:checked").val());
            var c2 = Number($("input[name=coils_number]:checked").val());
            var c3 = Number($("#wire_diam").val());
            var c4 = Number($("#coil_diam").val());
            var c5 = Number($("#windings_number").val());
            var c6 = Number($("#voltage").val());
            var c61 = 1; // резерв
            var c7 = Number($("#legs_length").val());
            var c8 = Number($("#wire_type").val());
            var c9 = Number($("input[name=ct]:checked").val());
            var c10 = Number(document.getElementById("ohmcorrection").checked);
            var c11 = Number(document.getElementById("twisted").checked);
            var pi = 3.14159265359;
            var ohm_correct = 1.1;

            var cldiam = Number($("#clap_w_diam").val());
            var cltype = Number($("#clap_w_type").val());

            // Скрыть/Раскрыть панель Клэптона и предупредить о отсутствии Расчетной мощности
            if (c9 == 3) {
                document.getElementById("clptbar").style.display = "block";
                document.getElementById("clpatt").style.visibility = "visible";
            } else {
                document.getElementById("clptbar").style.display = "none";
                document.getElementById("clpatt").style.visibility = "hidden";
            }

            // Площадь сечения S mm2
            var r_area = pi * (Math.pow((c3 / 2), 2));

            // Длина провода спирали (одного) mm
            var av_diam = c3 + c4;
            var r_wirelength = (Math.sqrt(Math.pow((pi * av_diam), 2) + Math.pow(c3 * c1 * c9, 2))) * c5 + (c7 * 2);
            if (c11 == 1 && c1 >= 2) { r_wirelength = r_wirelength * 1.2; }
            if (c1 == 1) { document.getElementById("twisted").checked = 0; }

            // Длинна обмотки Клэптона
            var clp_wirelength = Math.round(c3 * pi * (r_wirelength / cldiam) * (c1 / 10 * 6 + 0.4));

            // Сопротивление обмотки Клэптона
            var clp_area = pi * (Math.pow((cldiam / 2), 2));
            var clp_resist = (cltype * clp_wirelength / clp_area / 100);

            // Сопротивление спирали R ом
            var r_resist = (c8 * (r_wirelength + (c1 * c3)) / r_area / 1000) / (c2 * c1);
            if (c10 == 1) { r_resist = r_resist * ohm_correct; }
            // Добавляем параллельное сопротивление Клэптона
            if (c9 == 3) { r_resist = (r_resist * clp_resist) / (r_resist + clp_resist); }

            // Мощность P ватт
            var r_power = Math.pow((c6), 2) / r_resist;

            // Ток I ампер
            var r_curent = c6 / r_resist;

            // Ширина спирали mm (за шаг принято сечение провода)
            var r_cowidth = c1 * (c3 * c9) * c5;

            // Power density (Поверхностная мощность) W/mm²
            var r_powden = r_power / ((pi * 2) * ((av_diam / 2) * ((c3 * 2 * (c2 * c1 * 1.8)) * c5)));

            //
            var mm_ras = (((pi * 2) * ((av_diam / 2) * ((c3 * 2 * (c2 * c1 * 1.8)) * c5)))) * 0.3;

            var koef = (43 - mm_ras) / 100;
            if (koef <= 0.2) { koef = 0.2; }

            var den_kon = koef;
            var den_low = koef - 0.05;
            var den_hea = koef + 0.05;
            var den_ovh = koef + 0.1;

            // Opt Power (оптимальная мощность)
            var r_optpower = ((pi * 2) * ((av_diam / 2) * ((c3 * 2 * (c2 * c1 * 1.8)) * c5))) * den_kon;

            // Температура спирали К (сухая) отдельно считаем сопротивление и ток для одной спирали
            var a_resist = (c8 * (r_wirelength + (c1 * c3)) / r_area / 1000) / (c1);
            if (c10 == 1) { a_resist = a_resist * ohm_correct; }
            var a_curent = c6 / a_resist;
            var r_tempk = Math.pow((c6 * a_curent) / (0.31 * pi * 5.67 * Math.pow(10, -8) * c3 * Math.pow(10, -3) * r_wirelength * Math.pow(10, -3)), (1 / 4));

            // Температура в цвете
            var rgb_color = colorTemperatureToRGB(r_tempk);
            var r_tempcolor = "rgb(" + (rgb_color['r']).toFixed(0) + "," + (rgb_color['g']).toFixed(0) + ", " + (rgb_color['b']).toFixed(0) + ")";

            // Рекомендуемые значения мощности
            var cool_hot = "Оптимальна";
            var cool_hot_col = "rgb(0,200,0)";
            if (r_powden >= 0.40) {
                cool_hot = "Висока";
                cool_hot_col = "rgb(200,180,00)";
            }
            if (r_powden >= 0.45) {
                cool_hot = "Перегрів";
                cool_hot_col = "rgb(200,0,70)";
            }
            if (r_powden <= 0.2) {
                cool_hot = "Недостатня";
                cool_hot_col = "rgb(100,100,200)";
            }

            // Цветовое кодирование фона под Мощностью
            var c_r = 0;
            var c_g = Math.round((170 - (20 / r_powden)) * 2);
            var c_b = 0;

            if (r_powden <= 0.17) {
                c_g = 100;
            }

            if (r_powden <= 0.24) {
                c_b = Math.round((20 / r_powden) * 2);
            }

            if (r_powden >= 0.35) {
                c_r = Math.round((70 - (20 / r_powden)) * 10);
                c_g = Math.round((100 - r_powden * 200) * 10);
            }

            if (c_r >= 230) { c_r = 230; }
            if (c_r <= 0) { c_r = 0; }
            if (c_g >= 200) { c_g = 200; }
            if (c_g <= 0) { c_g = 0; }
            if (c_b >= 220) { c_b = 220; }
            if (c_b <= 0) { c_b = 0; }

            var pw_color = "rgb(" + c_r + "," + c_g + "," + c_b + ")";
            document.getElementById("pw_color").style.backgroundColor = pw_color;

            // Overrate (кратность перегрева)
            var overrate = "";
            if (r_power > r_optpower * 2) {
                overrate = r_power / r_optpower;
                overrate = " x" + overrate.toFixed();
            }

            // TCR display
            var tc_disp;
            switch (c8) {
                case 0.09: tc_disp = "0.00520"; break;
                case 0.24: tc_disp = "0.00506"; break;
                case 0.28: tc_disp = "0.00320"; break;
                case 0.36: tc_disp = "0.00405"; break;
                case 0.42: tc_disp = "0.00350"; break;
                case 0.74: tc_disp = "0.00095"; break;
                case 0.8: tc_disp = "0.00105"; break;
                case 1.08: tc_disp = "0.00012"; break;
                case 1.11: tc_disp = "0.00018"; break;
                case 1.39: tc_disp = "0.00004"; break;
                case 1.35: tc_disp = "0.00005"; break;
                case 1.45: tc_disp = "0.00001"; break;
                default: tc_disp = " ";
            }

            document.getElementById("tc").textContent = tc_disp;

            // Вывод
            document.getElementById("r_resist").textContent = r_resist.toFixed(2);
            document.getElementById("r_wirelength").textContent = r_wirelength.toFixed(2);
            document.getElementById("x_wire").textContent = (c1 * c2).toFixed(0);
            document.getElementById("r_power").textContent = r_power.toFixed(2);
            document.getElementById("r_optpower").textContent = r_optpower.toFixed(2);
            document.getElementById("r_curent").textContent = r_curent.toFixed(2);
            document.getElementById("r_powden").textContent = r_powden.toFixed(2);
            document.getElementById("r_cowidth").textContent = r_cowidth.toFixed(1);

            document.getElementById("r_tempk").textContent = r_tempk.toFixed();
            document.getElementById("r_tempcolor").style.backgroundColor = r_tempcolor;

            document.getElementById("cool_hot").textContent = cool_hot + overrate;
            document.getElementById("cool_hot").style.color = cool_hot_col;
        }

        // Initialize calculator
        $(document).ready(function() {
            // Set up event listeners
            $("input[name=wires_number], input[name=coils_number], input[name=ct]").change(compute);
            $("#wire_diam, #coil_diam, #windings_number, #legs_length, #wire_type, #clap_w_diam, #clap_w_type, #voltage").change(compute);
            $("#ohmcorrection, #twisted").change(compute);

            // Initial calculation
            compute();
        });