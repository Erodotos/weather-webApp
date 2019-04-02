function selectOnlyThis(id) {
    document.getElementById("celsius").checked = false;
    document.getElementById("farenheit").checked = false;
    document.getElementById(id).checked = true;
}

function checkData() {

    let address = document.getElementById("address").value;
    let region = document.getElementById("region").value;
    let city = document.getElementById("city").value;

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
        nomonatimAPIcall(address,region,city);
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

function nomonatimAPIcall(address, region, city) {

    let jsonObj ;
    let callAPI = "https://nominatim.openstreetmap.org/search?q=" + address + ", " + region + ", " + city + "&format=json" ;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           jsonObj = JSON.parse(this.responseText);
           console.log(jsonObj[0].lat);
           console.log(jsonObj[0].lon);
        }
    };
    xhttp.open("GET", callAPI, true);
    xhttp.send();

   
   

}