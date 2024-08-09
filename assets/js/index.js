document.addEventListener('DOMContentLoaded', (event) => {
  const searchButton = document.getElementById('search-Button');
  const apiKey = '009f23233c17c51e7457020841729a15'; 

   
   const cities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Moscow', 'Berlin', 'Rio de Janeiro', 'Cape Town', 'Dubai'
];


function createCityButtons() {
    const container = document.getElementById('city-buttons-container');
    if (container) {
        cities.forEach(city => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary my-1';
            button.textContent = city;
            button.addEventListener('click', () => {
                document.getElementById('city-input').value = city;
                getApi();
            });
            container.appendChild(button);
        });
    }
}

  function getApi() {
      const city = document.getElementById('city-input').value;

    
      const tempElem = document.getElementById('temp');
      const windElem = document.getElementById('wind');
      const humidityElem = document.getElementById('humidity');
      const placeElem = document.getElementById('place'); 

      if (tempElem && windElem && humidityElem) {
          tempElem.textContent = '--';
          windElem.textContent = '--';
          humidityElem.textContent = '--';
      }

      
      const forecastContainer = document.getElementById('forecast-container');
      if (forecastContainer) {
          forecastContainer.innerHTML = ''; 
      }

      
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => {
              if (data.length > 0) {
                  const lat = data[0].lat;
                  const lon = data[0].lon;

                  
                  if (placeElem) {
                      placeElem.textContent = city;
                  }

                  
                  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                      .then(response => response.json())
                      .then(data => {
                        
                          const currentWeather = data.list[0]; 
                          if (tempElem && windElem && humidityElem) {
                              tempElem.textContent = `${currentWeather.main.temp} °C`;
                              windElem.textContent = `${currentWeather.wind.speed} m/s`;
                              humidityElem.textContent = `${currentWeather.main.humidity}%`;
                          }

                          
                          const forecastEntries = data.list.filter(entry => entry.dt_txt.includes('12:00:00')); 
                          forecastEntries.slice(0, 5).forEach(dayForecast => {
                              const date = new Date(dayForecast.dt * 1000).toLocaleDateString();
                              const temp = dayForecast.main.temp;
                              const windSpeed = dayForecast.wind.speed;
                              const humidity = dayForecast.main.humidity;
                              const weatherIcon = dayForecast.weather[0].icon;
                              const weatherDescription = dayForecast.weather[0].description;

                              const card = document.createElement('div');
                              card.className = 'col';
                              card.innerHTML = `
                                  <div class="card bg-primary mb-2">
                                      <h5 class="card-header">${date}</h5>
                                      <div class="card-body">
                                          <h5 class="card-title">
                                              <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}" class="img-fluid">
                                          </h5>
                                          <p class="card-text">
                                              Temp: ${temp} °C<br>
                                              Wind: ${windSpeed} m/s<br>
                                              Humidity: ${humidity} %<br>
                                              ${weatherDescription}
                                          </p>
                                      </div>
                                  </div>
                              `;
                              if (forecastContainer) {
                                  forecastContainer.appendChild(card);
                              }
                          });
                      })
                      .catch(error => console.error('Error fetching forecast:', error));
              } else {
                  console.error('City not found');
              }
          })
          .catch(error => console.error('Error fetching coordinates:', error));
  }


  if (searchButton) {
      searchButton.addEventListener('click', (event) => {
          event.preventDefault(); 
          getApi();
      });
  }
  createCityButtons();
});
