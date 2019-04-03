function selectOnlyThis(id) {
    document.getElementById("celsius").checked = false;
    document.getElementById("farenheit").checked = false;
    document.getElementById(id).checked = true;
}

function checkData() {

    let address = document.getElementById("address").value;
    let region = document.getElementById("region").value;
    let city = document.getElementById("city").value;
    let units;

    if (document.getElementById("celsius").checked === true) {
        units = "metric";
    } else {
        units = "imperial";
    }

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
        nomonatimAPIcall(address, region, city, units);
        document.getElementById("results").style.visibility = 'visible';
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
            loadTempMap(lon, lat);
            weatherAPIcall(lat, lon, units);
            forecastAPIcall(lat, lon, units)
        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();
}

function weatherAPIcall(lat, lon, units) {

    let type;
    let sign;
    let speedSign;
    let pressureSign;
    if (units === 'metric') {
        type = 'metric';
        sign = ' °C';
        speedSign = ' meters/sec';
        pressureSign = ' hPa';
    } else {
        type = 'imperial'
        sign = ' °F';
        speedSign = ' miles/hour';
        pressureSign = ' Mb';
    }

    let callAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "8&lon=" + lon + "&units=" + type + "&APPID=c4bbc94d779db5b4a6d8bb3c9d0bd4d0";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObj = JSON.parse(this.responseText);

            let description = jsonObj.weather[0].description;
            let name = jsonObj.name;
            changeCellData("#description", description + " in " + name);

            let temp_min = jsonObj.main.temp_min;
            changeCellData("#temp_min", "L:" + temp_min + sign);

            let temp_max = jsonObj.main.temp_max;
            changeCellData("#temp_max", "| H:" + temp_max + sign);

            let temp = jsonObj.main.temp;
            changeCellData("#temp", temp + sign);

            let icon = jsonObj.weather[0].icon;
            let element = document.querySelector("#icon");
            element.src = "http://openweathermap.org/img/w/" + icon + ".png";


            changeCellData('#temp', temp + ' °C');

            let pressure = jsonObj.main.pressure;
            changeCellData('#pressure', pressure + pressureSign);

            let humidity = jsonObj.main.humidity;
            changeCellData("#humidity", humidity + " %");

            let speed = jsonObj.wind.speed;
            changeCellData("#windSpeed", speed + speedSign);

            let all = jsonObj.clouds.all;
            changeCellData("#cloudCover", all + "%");

            let sunrise = jsonObj.sys.sunrise;
            let date = new Date(sunrise * 1000);
            let hours = date.getHours();
            let minutes = "0" + date.getSeconds();
            changeCellData("#sunrise", hours + ":" + minutes.substr(-2));

            let sunset = jsonObj.sys.sunset;
            date = new Date(sunset * 1000);
            hours = date.getHours();
            minutes = "0" + date.getSeconds();
            changeCellData("#sunset", hours + ":" + minutes.substr(-2));

        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();

}

function changeCellData(selector, data) {
    let element = document.querySelector(selector);
    element.textContent = data;
}

function loadTempMap(lon, lat) {
    var map = new ol.Map({ // a map object is created
        target: 'map', // the id of the div in html to contain the map
        layers: [ // list of layers available in the map
            new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({ // view allows to specify center, resolution, rotation of the map
            center: ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]), // center of the map
            zoom: 5 // zoom level (0 = zoomed out)
        })
    });

    layer_temp = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=c4bbc94d779db5b4a6d8bb3c9d0bd4d0'
        })
    });
    map.addLayer(layer_temp); // a temp layer on map
}

function forecastAPIcall(lat, lon, units) {

    let type;
    let sign;
    let speedSign;
    let pressureSign;

    let modalHeader;
    let modalDescription;
    let modalicon;
    let modalHumidity;
    let modalPressure;
    let modalWindSpeed;
    let selector;

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (units === 'metric') {
        type = 'metric';
        sign = ' °C';
        speedSign = ' meters/sec';
        pressureSign = ' hPa';
    } else {
        type = 'imperial'
        sign = ' °F';
        speedSign = ' miles/hour';
        pressureSign = ' Mb';
    }

    let callAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + type + '&APPID=c4bbc94d779db5b4a6d8bb3c9d0bd4d0';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObj = JSON.parse(this.responseText);

            let date;
            for (i = 1; i <= 8; i++) {

                date = new Date(jsonObj.list[i - 1].dt * 1000);
                hours = date.getHours();
                minutes = "0" + date.getSeconds();

                changeCellData("#" + String.fromCharCode(96 + i) + "1", hours + ":" + minutes.substr(-2));

                let icon = jsonObj.list[i - 1].weather[0].icon;
                let element = document.querySelector("#" + String.fromCharCode(96 + i) + "2");
                element.src = "http://openweathermap.org/img/w/" + icon + ".png";

                changeCellData("#" + String.fromCharCode(96 + i) + "3", jsonObj.list[i - 1].main.temp + sign);

                changeCellData("#" + String.fromCharCode(96 + i) + "4", jsonObj.list[i - 1].clouds.all + "%");

                modalHeader = "Weather in " + jsonObj.city.name + " on " + date.getDay() + " " + months[date.getMonth()] + " " + date.getFullYear() + " " + hours + ":" + minutes.substr(-2);

                selector = "#" + String.fromCharCode(96 + i) + "5header";
                changeCellData(selector, modalHeader);

                selector = "#" + String.fromCharCode(96 + i) + "5icon";
                document.querySelector(selector).src = "http://openweathermap.org/img/w/" + icon + ".png";

                changeCellData("#" + String.fromCharCode(96 + i) + "5Humidity", jsonObj.list[i - 1].main.humidity + "%");

                changeCellData("#" + String.fromCharCode(96 + i) + "5Pressure", jsonObj.list[i - 1].main.pressure + pressureSign);

                changeCellData("#" + String.fromCharCode(96 + i) + "5WindSpeed", jsonObj.list[i - 1].wind.speed + speedSign);
            }

        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();

}