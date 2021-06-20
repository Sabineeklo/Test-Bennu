window.addEventListener("load", () => {
  // adding active class to tomorrow date
  const dot = document.querySelector(
    ".container .forecast-date .forecast-date-weather"
  );
  const todayActive = document.querySelector(
    ".main-page .forecast-date .today-weather"
  );

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
  // get tomorrow weather information
  const getTomorrowForecast = async (id) => {
    const api = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${id}?apikey=${key}&language=en-us&details=true&metric=true`;

    const response = await fetch(api);
    const data = await response.json();

    return data;
  };

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

      const temp = document.querySelector(".temperature .current-temperature");
      const userLocation = document.querySelector(
        ".location .current-location"
      );
      const ApparentTemperature = document.querySelector(
        ".weather-details .feeling-details"
      );

      const description = document.querySelector(
        ".weather-details .date-content .current-date"
      );

      const updateUi = (data) => {
        const locationDets = data.locationDets;
        const weather = data.weather[0];
        const Tomorrow = data.Tomorrow;

        const timestamp = weather.LocalObservationDateTime;
        const now = new Date(timestamp);

        description.textContent = now.toDateString();
        temp.innerHTML = `${weather.Temperature.Metric.Value}<span> °C</span>`;
        userLocation.innerHTML = `${locationDets.LocalizedName}, ${locationDets.Country.EnglishName} <i class="bi bi-pencil-square"></i>`;

        ApparentTemperature.innerHTML = `Feels like ${weather.ApparentTemperature.Metric.Value}
           <span><i class="bi bi-dot"></i></span> ${weather.WeatherText}`;
        // Tomorrow updating effects
        dot.addEventListener("click", () => {
          dot.classList.toggle("active");
          todayActive.classList.remove("active");
          const tomorrowDate = document.querySelector(
            ".weather-details .date-content"
          );
          const feeling = document.querySelector(
            ".weather-details .feeling-details"
          );
          const tempt = document.querySelector(".weather-details .temperature");
          const timestamp = Tomorrow.Headline.EffectiveDate;
          const nextDate = new Date(timestamp);

          tomorrowDate.innerHTML = `<h2>Tomorrow</h2> <p class="current-date">${nextDate.toDateString()}</p>`;
          // tempt.innerHTML = `${Tomorrow.DailyForecasts[0].Temperature.Maximum.Value}/${Tomorrow.DailyForecasts[0].Temperature.Minimum.Value}<span> °C</span>`;
          tempt.innerHTML = `<h1 class="current-temperature" style="font-size:5rem;">${Tomorrow.DailyForecasts[0].Temperature.Maximum.Value}/${Tomorrow.DailyForecasts[0].Temperature.Minimum.Value}°C</h1>`;
          feeling.textContent = Tomorrow.Headline.Text;
        });
      };

      // Updating the content

      const updateLocation = async () => {
        const locationDets = await getLocation();
        const weather = await getWeather(locationDets.Key);
        const Tomorrow = await getTomorrowForecast(locationDets.Key);

        return {
          locationDets: locationDets,
          weather: weather,
          Tomorrow: Tomorrow,
        };
      };
      updateLocation()
        .then((data) => updateUi(data))
        .catch((err) => console.log(err));
    });
  }
});
