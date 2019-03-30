function selectOnlyThis(id) {
    document.getElementById("celsius").checked = false;
    document.getElementById("farenheit").checked = false;
    document.getElementById(id).checked = true;
}

function checkData(){

    let address = document.getElementById("address").value;
    let region = document.getElementById("region").value;
    let city = document.getElementById("city").value;

    if ( address === ''){
        document.getElementById("invalid-address").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-address").style.visibility = 'hidden';
        // address = true;
    }
    
    if (region === ''){
        document.getElementById("invalid-region").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-region").style.visibility = 'hidden';
        //region = true;
    }

    if (city === ''){
        document.getElementById("invalid-city").style.visibility = 'visible';
    }else{
        document.getElementById("invalid-city").style.visibility = 'hidden';
        //city=true;
    }

    if (!address || !region || !city){
        return;
    }else{
        alert("We are ready for an ajax call");
    }
    
}