import "./styles/style.css";
import { weatherManager } from "./api";

const domManager = (() => {

  const state = {
    // Accepted Values: [`current`,`hourly`]
    displayMode: "current",
    currentSnapshot: 0,
  };

  const addEventListeners = (snapshotItems) => null

  const populateCurrentSnapshot = (state) => {
    const mainSnapshot = document.querySelector('.selectedSnapShot')


  }

  const populateSnapshotbar = (simpleWeatherArr) => {
    const snapShotItems = document.querySelectorAll('.snapshotItem');
    addEventListeners(snapShotItems);
    for (let i = 0; i<8; i+=1) {
      const weatherObj = simpleWeatherArr[i];
      const snapshotItem = snapShotItems[i];
      // snapShotItems.querySelector()
      // Bro you can run chain query selector from any node wtf
      const snapshotChildren = snapshotItem.children;
      snapshotChildren[0].innerText = `${weatherObj.dayofWeek  } ${  weatherObj.time}`
      snapshotChildren[1].innerText = weatherObj.temp
      snapshotChildren[2].innerText = weatherObj.weather
      console.log(snapshotItem);
    }
  }

  const populateDom = (simpleWeatherArr) => {
    populateSnapshotbar(simpleWeatherArr);
    // populateCurrentSnapshot(weatherObj);
  };

  return {populateDom}

})();

let weatherArr;
weatherManager.fetchWeather("London").then(val => {
  weatherArr = val
  domManager.populateDom(weatherArr);
  

})

