const date = new Date();
let day = date.getDate();
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["jan", "feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours(); // Extract hours
    const minutes = date.getMinutes(); // Extract minutes
    const seconds = date.getSeconds();
    return `${hours} : ${minutes} : ${seconds}`;
}

// Update time every second
setInterval(() => {
    document.querySelector(".tme").innerHTML = `${formatTime(Date.now())}`;
}, 1000);
let forecastChart;
let lastFeelsLike = 0;
let counter = 1; // Add counter for bar chart labels

function updateForecastChart(forecastData) {
    const temperatures = forecastData.map(data => Math.round(data.main.temp));
    const dates = forecastData.map(data => {
        const forecastDate = new Date(data.dt * 1000);
        return days[forecastDate.getDay()];
    });

    if (forecastChart) {
        lastFeelsLike = Math.round(forecastData[0].main.feels_like);
        
        forecastChart.data.labels = dates;
        forecastChart.data.datasets[0].data = temperatures;
        forecastChart.update();
    }
}

function getWeather() {
    let city = document.querySelector("#searchbar").value;
    let API_key = "9f8bc391ed32f4907fb11d38547fe1a1"
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`)
        .then(function (response) {
            console.log(response);
            document.querySelector("#Current h1").innerHTML = `${Math.round(response.data.main.temp)}°C`;
             document.querySelector(".Sunrise").innerHTML = `Humidity : ${(response.data.main.humidity)}%`;
            document.querySelector("#Sunset").innerHTML = `Wind Speed: ${(response.data.wind.speed)} km/hr`;
            document.querySelector(".Date").innerHTML = `Date: ${day} - ${months[date.getMonth()]} - ${date.getFullYear()}`;
            document.querySelector("#heading").innerHTML = `${days[date.getDay()]}`;
           document.querySelector(".conditionicon").src = `https://openweathermap.org/img/wn/${(response.data.weather[0].icon)}.png`;
             document.querySelector(".world").innerHTML = `${(response.data.sys.country)}`;
             document.querySelector(".ID").innerHTML = `${(response.data.sys.id)}`;
            document.querySelector(".lon").innerHTML = `${(response.data.coord.lon)}`;
            document.querySelector(".lat").innerHTML = `${(response.data.coord.lat)}`;
            document.querySelector(".Pressure").innerHTML = `${(response.data.main.pressure)}`;


                

            lastFeelsLike = Math.round(response.data.main.feels_like);

            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`)
                .then(function (forecastResponse) {
                    const forecastList = forecastResponse.data.list;
                    const dailyForecasts = forecastList.filter((forecast, index) => index % 8 === 0).slice(0, 6);
                    
                    updateForecastChart(dailyForecasts);
                    
                    for(let i = 1; i <= 6; i++) {
                        const forecastData = dailyForecasts[i-1];
                        const forecastDate = new Date(forecastData.dt * 1000);
                        const dayName = days[forecastDate.getDay()];
                        
                      ;
                    }
                });
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let API_key = "9f8bc391ed32f4907fb11d38547fe1a1";
            
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`)
                .then(function (response) {
                    console.log(response);
                    document.querySelector("#Current h1").innerHTML = `${Math.round(response.data.main.temp)}°C`;
                    document.querySelector(".Sunrise").innerHTML = `Humidity : ${(response.data.main.humidity)}%`;
                    document.querySelector("#Sunset").innerHTML = `Wind Speed: ${(response.data.wind.speed)} km/hr`;
                    document.querySelector(".Date").innerHTML = `Date: ${day} - ${months[date.getMonth()]} - ${date.getFullYear()}`;
                    document.querySelector("#heading").innerHTML = `${days[date.getDay()]}`;
                    document.querySelector(".world").innerHTML = `${(response.data.sys.country)}`;
                    document.querySelector(".lon").innerHTML = `${(response.data.coord.lon)}`;
                   document.querySelector(".conditionicon").src = `https://openweathermap.org/img/wn/${(response.data.weather[0].icon)}.png`;
                   document.querySelector(".ID").innerHTML = "9214";
                   document.querySelector(".lat").innerHTML = `${(response.data.coord.lat)}`;
                   document.querySelector(".Pressure").innerHTML = `${(response.data.main.pressure)}`;
                    

                    // lastFeelsLike = Math.round(response.data.main.feels_like);

                    // axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`)
                    //     .then(function (forecastResponse) {
                    //         const forecastList = forecastResponse.data.list;
                    //         const dailyForecasts = forecastList.filter((forecast, index) => index % 8 === 0).slice(0, 6);
                            
                    //         updateForecastChart(dailyForecasts);
                            
                    //         for(let i = 1; i <= 6; i++) {
                    //             const forecastData = dailyForecasts[i-1];
                    //             const forecastDate = new Date(forecastData.dt * 1000);
                    //             const dayName = days[forecastDate.getDay()];
                                
                    //             document.querySelector(`#icon${i} h4`).innerHTML = dayName;
                    //             document.querySelector(`#icon${i} h1`).innerHTML = `${Math.round(forecastData.main.temp)}<span class="degree">°</span>`;
                    //             document.querySelector(`.icons${i} img`).src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
                    //         }
                    //     });
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        }, (error) => {
            alert("Unable to get your location");
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const windCtx = document.getElementById('myChart');
    const windChart = new Chart(windCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Wind Speed km/hr',
                data: [],
                borderWidth: 1,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const forecastCtx = document.getElementById('bar');
    forecastChart = new Chart(forecastCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                borderWidth: 1,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature'
                },
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });

    setInterval(() => {
        if (forecastChart.data.labels.length >= 5) {
            forecastChart.data.labels.shift();
            forecastChart.data.datasets[0].data.shift();
            counter = 1; // Reset counter when clearing old data
        }

        const variation = (Math.random() - 0.5);
        const currentFeelsLike = lastFeelsLike + variation;

        forecastChart.data.labels.push(counter++); // Use incrementing counter instead of time
        forecastChart.data.datasets[0].data.push(currentFeelsLike);
        forecastChart.update();
    }, 2000);

    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const windSpeed = document.querySelector("#Sunset").innerHTML.match(/\d+(\.\d+)?/);
        
        if (windChart.data.labels.length >= 6) {
            windChart.data.labels.shift();
            windChart.data.datasets[0].data.shift();
        }

        if (windSpeed) {
            windChart.data.labels.push(currentTime);
            windChart.data.datasets[0].data.push(parseFloat(windSpeed[0]));
            windChart.update();
        }
    }, 2000);
});

function toggleSidebar() {
    let sidebar = document.querySelector('.sidebar');
    let toggleButton = document.querySelector('.toggle-btn');
    sidebar.classList.toggle('open');
    toggleButton.classList.toggle('active');
}
