const weatherManager = (() => {
  const location = "";

  const myKey = "e6cc0736d0dd71bc044c4e5f4ffab1c6";

  //   const async fetchLocation = () => {
  //     await
  //   }

  const fetchWeather = async (city) => {
    const location = await fetchLocation(city);
    const simpleWeatherArr = await fetchWeatherfromLocation(location);
    return simpleWeatherArr;
  };

  const fetchLocation = async (city) => {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${myKey}`
    );
    const locationJSON = await response.json();
    const likelyLocation = locationJSON[0];
    return likelyLocation;

    // locationJSON.then(val => console.log(val));
  };

  const getDayofWeek = (day) => {
    switch (day) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tues";
      case 3:
        return "Wed";
      case 4:
        return "Thurs";
      case 5:
        return "Fr";
      case 6:
        return "Sat";
      default:
        return 'Day value error';
    }
  };

  const getTempFromValue = (tempValue) =>
    Math.round((tempValue - 273) * 10) / 10;

  const condenseWeatherData = (weatherObject) => {
    console.log(weatherObject);
    const myDate = weatherObject.dt_txt;
    const myDateObj = new Date(weatherObject.dt_txt);
    const dayOfWeek = getDayofWeek(myDateObj.getDay());

    const timeData = myDate.split(" ")[1];
    const timeArr = timeData.split(":");
    const myTime = `${timeArr[0]}:00`; // +timeArr[1];

    const myTemp = getTempFromValue(weatherObject.main.temp);
    const myWeather = weatherObject.weather[0].main;
    const myWeatherDescription = weatherObject.weather[0].description;
    const myHumidity = `${weatherObject.main.humidity}` + `%`;
    const myWeatherObject = {
      date: myDate,
      dayofWeek: dayOfWeek,
      time: myTime,
      temp: myTemp,
      weather: myWeather,
      weatherDescription: myWeatherDescription,
      humidity: myHumidity,
    };
    return myWeatherObject;
  };

  const fetchWeatherfromLocation = async (location) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${myKey}`
    );
    const weatherData = await response.json();
    const simpleWeatherArr = [];
    for (let i = 0; i < 8; i += 1) {
      const simpleWeatherData = condenseWeatherData(weatherData.list[i]);
      simpleWeatherArr.push(simpleWeatherData);
    }
    return simpleWeatherArr;
  };

  return { fetchWeather, location, fetchLocation };
})();

export { weatherManager };
