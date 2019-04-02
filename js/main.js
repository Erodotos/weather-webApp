function selectOnlyThis(id) {
    document.getElementById("celsius").checked = false;
    document.getElementById("farenheit").checked = false;
    document.getElementById(id).checked = true;
}

function checkData() {

    let address = document.getElementById("address").value;
    let region = document.getElementById("region").value;
    let city = document.getElementById("city").value;
    // let celcius = document.getElementById("ce").value;
    // let farenheit = document.getElementById("").value;

    if (address === '' || !address.replace(/\s/g, '').length) {
        document.getElementById("invalid-address").style.visibility = 'visible';
    } else {
        document.getElementById("invalid-address").style.visibility = 'hidden';
    }

    if (region === '' || !region.replace(/\s/g, '').length) {
        document.getElementById("invalid-region").style.visibility = 'visible';
    } else {
        document.getElementById("invalid-region").style.visibility = 'hidden';
    }

    if (city === 'Select city' || !city.replace(/\s/g, '').length) {
        document.getElementById("invalid-city").style.visibility = 'visible';
    } else {
        document.getElementById("invalid-city").style.visibility = 'hidden';
    }

    if (!address || !region || (city === 'Select city') || !address.replace(/\s/g, '').length || !region.replace(/\s/g, '').length) {
        return;
    } else {
        nomonatimAPIcall(address, region, city);
    }

}

function resetFields() {

    document.getElementById("address").value = '';
    document.getElementById("region").value = '';
    document.getElementById("city").value = 'Select city';

    document.getElementById("invalid-address").style.visibility = 'hidden';
    document.getElementById("invalid-region").style.visibility = 'hidden';
    document.getElementById("invalid-city").style.visibility = 'hidden';

    document.getElementById("celsius").checked = true;
    document.getElementById("farenheit").checked = false;

}

function nomonatimAPIcall(address, region, city, units) {

    let callAPI = "https://nominatim.openstreetmap.org/search?q=" + address + ", " + region + ", " + city + "&format=json";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObj = JSON.parse(this.responseText);
            const lat = jsonObj[0].lat;
            const lon = jsonObj[0].lon;
            weatherAPIcall(lat, lon, "metric");
        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();


}

function weatherAPIcall(lat, lon, units) {

    let type;

    if (units === 'celcius') {
        type = 'metric';
    } else {
        type = 'imperial'
    }

    let callAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "8&lon=" + lon + "&units=" + type + "&APPID=c4bbc94d779db5b4a6d8bb3c9d0bd4d0";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObj = JSON.parse(this.responseText);

            let description = jsonObj.weather[0].description;

            let icon = jsonObj.weather[0].icon;
            changeCellData('#icon', icon);

            let temp = jsonObj.main.temp;
            changeCellData('#temp', temp + ' hPa');

            let pressure = jsonObj.main.pressure;
            changeCellData('#pressure', pressure + ' °C');

            let humidity = jsonObj.main.humidity;
            let temp_min = jsonObj.main.tepm_min;
            let temp_max = jsonObj.main.temp_max;
            let speed = jsonObj.wind.speed;
            let all = jsonObj.clouds.all;
            let country = jsonObj.sys.country;
            let sunrise = jsonObj.sys.sunrise;
            let sunset = jsonObj.sys.sunset;


        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();

}

function changeCellData(selector, data) {

    let element = document.querySelector(selector);
    element.textContent = data;
    

}








