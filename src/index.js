import "./styles/style.css";
import { doc } from "prettier";
import { weatherManager } from "./api";
import sunImg from "./img/sunny.png";
import rainImg from "./img/rain.jpeg";
import cloudImg from "./img/cloud.png"
import snowImg from "./img/rain.jpeg";
import extremeImg from "./img/extreme.jpeg";
import fogImg from "./img/fog.png"

const domManager = (() => {

  const state = {
    // Accepted Values: [`current`,`hourly`]
    displayMode: "current",
    currentSnapshot: 0,
  };


  
  const setActiveMarkerSnapshot = (snapshotItems,thisSnapItem) => {
    snapshotItems.forEach(snapItem => {
      console.log(snapItem);
      const tempActiveMarker = snapItem.querySelector('.activeMarker');
      tempActiveMarker.classList.remove('active');
    });
    const activeMarker = thisSnapItem.querySelector('.activeMarker');
    activeMarker.classList.add('active');
  }

  const addEventListeners = (snapshotItems,simpleWeatherArr) => {
    snapshotItems.forEach(snapElem => {
      snapElem.addEventListener('click', event => {
        setActiveMarkerSnapshot(snapshotItems,snapElem);
        const weatherIndex = snapElem.index;
        populateCurrentSnapshot(simpleWeatherArr[weatherIndex]);
        setBackgroundImg(simpleWeatherArr[weatherIndex]);
    });
  })
}

  const populateCurrentSnapshot = (weatherObj) => {
    const mainSnapshot = document.querySelector('.selectedSnapShot');
    const humidityText = mainSnapshot.querySelector('.humidityText');;
    const temperatureText = mainSnapshot.querySelector('.temperatureText');
    const tempFeelsLikeText = mainSnapshot.querySelector('.feelsLikeText')
    const weatherText = mainSnapshot.querySelector('.weatherText');
    const weatherDescText = mainSnapshot.querySelector('.weatherDescriptionText')
    humidityText.innerText = `Humidity: ${weatherObj.humidity}`;
    temperatureText.innerText = `Temperature: ${weatherObj.temp}°`;
    tempFeelsLikeText.innerText = `Feels Like: ${weatherObj.feelsLikeTemp}°`
    weatherText.innerText = `${weatherObj.weather} with ${weatherObj.weatherDescription}`;

  }

  const setBackgroundImg = (simpleWeatherArr) => {
    const backgroundImg = document.querySelector('.backgroundImg');
    switch (simpleWeatherArr.weather) {
      case 'Clouds':
        backgroundImg.src = cloudImg;
        // document.querySelector('body').style['background-image'] = `url(${sunImg})`
        break;
      case 'Extrme':
        backgroundImg.src = extremeImg;
        break;
      case 'Snow':
        backgroundImg.src = snowImg;
        break;
      case 'Rain' :
        backgroundImg.src = rainImg;
        break;
      case 'Drizzle':
        backgroundImg.src = rainImg;
        break;
      case 'Clear':
        backgroundImg.src = sunImg;
        break;
      case 'Tornado':
        backgroundImg.src = extremeImg;
        break;
      case 'Squall':
        backgroundImg.src = extremeImg;
        break;
      case 'Mist':
        backgroundImg.src = fogImg;
        break;
      case 'Haze':
        backgroundImg.src = fogImg;
        break;
        default:
          null
          break;
    }
  }

  const getIconFromWeatherObj = async (weatherObj) => {
    let iconImg = null;
    let imageObjectURL= null;
    await (fetch (`http://openweathermap.org/img/wn/${weatherObj.icon}@2x.png`)
    .then( value => {
      iconImg = value
      // alert(iconImg);
      return iconImg
    })
    .then(response => response.blob())
    .then(imageBlob => {
      imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL
    }))
    return imageObjectURL;
  }

  const populateSnapshotIcons = async (simpleWeatherArr) => {
     const snapShotItems = document.querySelectorAll('.snapshotItem');
    addEventListeners(snapShotItems,simpleWeatherArr);
  
    const promises = await (simpleWeatherArr.map(async weatherObj => {
      await getIconFromWeatherObj(weatherObj)
      .then (iconURL => {
        const {index} = weatherObj;
        const snapshotElem = document.querySelector(`#snapItem${index}`);
        const weatherSection = snapshotElem.querySelector('.weatherSection');
        const weatherIcon = document.createElement('img');
        weatherIcon.src = iconURL;
        weatherIcon.style.height = '36px'
        weatherSection.appendChild(weatherIcon);


      })
      
    }));

    


  }


  const populateSnapshotbar = (simpleWeatherArr) => {
    const snapShotItems = document.querySelectorAll('.snapshotItem');
    for (let i = 0; i<8; i+=1) {
      const weatherIcon = document.createElement('img');
      const weatherObj = simpleWeatherArr[i];
      const snapshotItem = snapShotItems[i];
      // snapShotItems.querySelector()
      // Bro you can run chain query selector from any node wtf
      const snapshotChildren = snapshotItem.children;
      snapshotItem.index = i;
      snapshotChildren[0].innerText = `${weatherObj.dayofWeek  } ${  weatherObj.time}`
      snapshotChildren[1].innerText = weatherObj.temp
      snapshotChildren[2].innerText = weatherObj.weather
      snapshotChildren[2].appendChild(weatherIcon);
      
    }
  }

  const populateDom = (simpleWeatherArr) => {
    populateSnapshotbar(simpleWeatherArr);
    populateSnapshotIcons(simpleWeatherArr);
    populateCurrentSnapshot(simpleWeatherArr[0]);
    setBackgroundImg(simpleWeatherArr[0]);
  };

  return {populateDom}

})();

let weatherArr;
weatherManager.fetchWeather("London").then(val => {
  weatherArr = val
  domManager.populateDom(weatherArr);
  

})

