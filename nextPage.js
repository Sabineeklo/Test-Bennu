window.addEventListener("load", () => {
  // light mode enable
  const theme = document.querySelector(".container");
  var hour = new Date().getHours();
  if (hour > 6 && hour < 18) {
    theme.classList.add("light-theme");
  }
  // Accuwether Api Key
  const key = "9Guib9VBOFEAilJUfPXgcVTGnxnoAqyb";

  // get current weather information
  const getWeather = async (id) => {
    const api = `http://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${key}&language=en-us&details=true`;

    const response = await fetch(api);
    const data = await response.json();

    return data;
  };

  //   get 5 days forecast information (as i don't have access to the 10days forecat details)

  //   const getWeatherForecast = async (id) => {
  //     const api = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=${key}&language=en-us&details=true&metric=true`;

  //     const response = await fetch(api);
  //     const data = await response.json();

  //     return data;
  //   };

  let long;
  let lat;
  if (navigator.geolocation) {
    //   get latitude and longitude of the user
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;
      // get location information
      const getLocation = async () => {
        const api = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${lat},${long}&language=en-us&details=true&toplevel=true`;
        const response = await fetch(api);
        const data = await response.json();

        return data;
      };

      const max = document.querySelector(
        ".next-page-container .weather-details-card .min-max-temperature .max"
      );
      const min = document.querySelector(
        ".next-page-container .weather-details-card .min-max-temperature .max .min"
      );
      const currentDay = document.querySelector(
        ".next-page-container .weather-details-card .title-part .day .current-date"
      );
      const wind = document.querySelector(
        ".next-page-container .weather-details-card .bottow-part .left .card .wind-details"
      );
      const visibility = document.querySelector(
        ".next-page-container .weather-details-card  .bottow-part .left .card .visibility-details"
      );
      const humidity = document.querySelector(
        ".next-page-container .weather-details-card .bottow-part .right .card .humidity-details"
      );
      const uv = document.querySelector(
        ".next-page-container .weather-details-card .bottow-part .right .card .uv-details"
      );

      const updateUi = (data) => {
        const locationDets = data.locationDets;
        const weather = data.weather[0];
        // max.textContent = weather.WeatherText;
        max.innerHTML = `<span>${weather.WeatherText}</span>`;
        wind.innerHTML = `${weather.Wind.Speed.Metric.Value} ${weather.Wind.Speed.Metric.Unit}`;
        visibility.innerHTML = `${weather.Visibility.Metric.Value} ${weather.Visibility.Metric.Unit}`;
        humidity.innerHTML = `${weather.RelativeHumidity}% `;
        uv.innerHTML = `${weather.UVIndex}`;
      };

      // Updating the content

      const updateLocation = async () => {
        const locationDets = await getLocation();
        const weather = await getWeather(locationDets.Key);
        return {
          locationDets: locationDets,
          weather: weather,
        };
      };
      updateLocation()
        .then((data) => updateUi(data))
        .catch((err) => console.log(err));
    });
  }
});
