function selectOnlyThis(id) {
    document.getElementById("celsius").checked = false;
    document.getElementById("farenheit").checked = false;
    document.getElementById(id).checked = true;
}

function checkData(){

    let address = false;
    let region = false;
    let city = false;

    if (document.getElementById("address").value === ''){
        document.getElementById("invalid-address").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-address").style.visibility = 'hidden';
        address = true;
    }
    
    if (document.getElementById("region").value === ''){
        document.getElementById("invalid-region").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-region").style.visibility = 'hidden';
        region = true;
    }

    if (document.getElementById("city").value === ''){
        document.getElementById("invalid-city").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-city").style.visibility = 'hidden';
        city=true;
    }

    if (!address || !region || !city){
        return;
    }else{
        alert("We are ready for an ajax call");
    }
    
}