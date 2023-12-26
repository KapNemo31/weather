const elementsToTranslate = document.querySelectorAll('.weatherInCity');
let weatherContainer = document.getElementsByClassName("weatherContainer")[0]
let cityContainer = document.getElementsByClassName("cityContainer")[0]
let errorContainer = document.getElementsByClassName("errorContainer")[0]
let temperatureValue = document.getElementsByClassName("temperatureValue")[0]
let weatherInCity = document.getElementsByClassName("weatherInCity")[0]
function showWeatherContainer() {
    weatherContainer.style.display = "flex"
    cityContainer.style.display = "none"
    errorContainer.style.display = "none"
}
function showCityContainer() {
    weatherContainer.style.display = "none"
    cityContainer.style.display = "flex"
    errorContainer.style.display = "none"
}
function showErrorContainer() {
    weatherContainer.style.display = "none"
    cityContainer.style.display = "none"
    errorContainer.style.display = "flex"
}
let changeCityButton = document.getElementById("changeCityButton")
changeCityButton.onclick = function () {
    showCityContainer()
}

let findCityButton = document.getElementById("findCityButton")
findCityButton.onclick = function () {
    showWeatherContainer()
    let enteredCity = document.getElementById("inputToFindCity").value
    getCoordsFromCity(enteredCity)
}

let tryAgainButton = document.getElementById("tryAgainButton")
tryAgainButton.onclick = function () {
    showCityContainer()
}

navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure)

function geolocationSuccess(position) {
    getWeatherFromCoords(position.coords.latitude, position.coords.longitude, null)
}

function geolocationFailure(positionError) {
    fetch('https://api.ipify.org?format=json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            getCityFromIp(data.ip)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении погоды: " + error.message)
            showErrorContainer()
        })
}
function getCityFromIp(ip) {
    fetch('https://geo.ipify.org/api/v2/country,city?apiKey=at_ISXaZUxRVDqIABeOyYv6ey7EiI3HN&ipAddress=' + ip)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)

            getWeatherFromCoords(data.location.lat, data.location.lng, null)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении города: " + error.message)
            showErrorContainer()
        })
}
function getWeatherFromCoords(lat, lon, cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=bd69def61e044b12aa285f853e73965f')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            showWeatherContainer()
            let temp = data.main.temp
            let description = data.weather[0].description
            let city
            if (cityName == null) {
                city = data.name
            }
            else {
                city = cityName
            }
            description = description[0].toUpperCase() + description.slice(1)
            temperatureValue.innerHTML = ''
            temperatureValue.append(temp + " ℃")
            weatherInCity.innerHTML = ''
            weatherInCity.append(description + " in " + city)
        })
        .catch(error => {
            console.error("Ошибка определения погоды: " + error.message)
            showErrorContainer()
        })
}
function getCoordsFromCity(city) {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=bd69def61e044b12aa285f853e73965f')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            let lat = data[0].lat
            let lon = data[0].lon
            let cityName = data[0].name
            getWeatherFromCoords(lat, lon, cityName)
        })
        .catch(error => {
            console.error("Ошибка определения погоды: " + error.message)
            showErrorContainer()
        })
}