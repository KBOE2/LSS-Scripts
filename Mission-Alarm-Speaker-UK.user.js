// ==UserScript==
// @name         LSS-Mission-Alarm-Speaker UK
// @version      1.0.1
// @description  Speaks alarmed vehicles out
// @author       Jan (jxn_30)
// @include      /https:\/\/www.missionchief.co.uk/missions/\d+/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const useVehicleType = true;
    const playGong = false;
    const gongUrl = '';

    const alarmBtns = document.getElementById('mission_alarm_btn').parentElement.children;
    Array.from(alarmBtns).forEach(btn => btn.addEventListener('click', () => {
        const vehicles = Array.from(document.querySelectorAll('#vehicle_show_table_body_all .vehicle_select_table_tr')).filter(r => r.querySelector('.vehicle_checkbox:checked'));
        const buildings = {};
        vehicles.forEach(vehicle => {
            const building = vehicle.querySelector('a[href^="/buildings/"]');
            if (!building) return;
            const buildingCaption = building.textContent.trim();
            const buildingId = building.href.match(/\d+$/)[0];
            if (!buildings.hasOwnProperty(buildingId)) buildings[buildingId] = {caption: buildingCaption, vehicles: []};
            //buildings[buildingId].vehicles.push(vehicle.querySelector('.mission_vehicle_label').textContent.trim());
            buildings[buildingId].vehicles.push(useVehicleType ? vehicle.getAttribute('vehicle_type') : vehicle.querySelector('.mission_vehicle_label').textContent.trim());
        });
        let speech = 'Alarm for: ' + Object.values(buildings).map(b => `at station ${b.caption}: ${b.vehicles}!`).join(' ') + ' for: ' + document.getElementById('missionH1').textContent.trim();
        speech = speech.replace(/ +/g, ' ');

        tellParent(`const alarmt2s = new SpeechSynthesisUtterance();alarmt2s.text = ${JSON.stringify(speech)};alarmt2s.lang = speechSynthesis.getVoices().find(voice => voice.lang === 'en');alarmt2s.rate = 1;${playGong ? `const gong = new Audio('${gongUrl}');gong.addEventListener('ended', () => ` : ''}speechSynthesis.speak(alarmt2s)${playGong ? `);gong.play();` : ''}`);
    }));
})();
