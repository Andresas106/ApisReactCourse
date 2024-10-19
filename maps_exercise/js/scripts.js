/*
function initMapa(){
    
    // Call to constructor V1
    let mapa = new myMap();
    
}

class myMap {
    
    //Constructor V1: Static id canvas element
    constructor() {
        this.forecast = [];
        this.map = null;
        this.drawMap();
    }

    drawMap() {
        this.map = L.map("map").setView([41.3887900,2.1589900], 13); // Constructor V1, static id 
        //this.map = L.map(this.canvasId).setView([41.3887900,2.1589900], 13); // Constructor V2, canvas' id retrived from class prop

        //Tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        console.log(this.map);

        this.fetchData();
    }

    fetchData() {
        fetch('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/meteo_data/meteodata.php')
        .then(response => {
            return response.text();
        })
        .then(data => {   // Usage of arrow funtions to avoid losing context when using "this"  https://www.w3schools.com/js/js_arrow_function.asp
            //console.log('data = ', data);
            const parsedData = JSON.parse(data);
            //console.log(parsedData.ciutats);
            this.forecast = parsedData.ciutats;
            //console.log(this.forecast[0]);
            this.drawData();
        })
        .catch(err => {
            console.error('Fetch error: ', err);
        });        
    }
        
    drawData(){
        // Empty array to store coords/points list
        const bounds = [];

        this.forecast.forEach(city => {
            console.log(city);
            console.log(city.latitud);
            this.drawMarker(city.latitud, city.longitud, city.prediccio);
            
            // Adding marker coords to the list for fitbounds
            bounds.push([city.latitud, city.longitud]);   
        });

        console.log(bounds);
        //Fit bounds
        if (bounds.length) {
            const latLngBounds = L.latLngBounds(bounds);
            this.map.fitBounds(latLngBounds);
        }
    }

    drawMarker(lat, lon, prev) {
        // Icon for marker
        const customIcon = L.icon({
            iconUrl: `https://citmalumnes.upc.es/~davids/awug2425/05%20maps/meteo_data/imagenes/${prev}.png`, //Icon source with template literal https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
            iconSize: [32,32], // Icon size
            iconAnchor: [16, 16] // Point of incon to align with marker coords
        });
        
        // Adding marker
        L.marker([lat,lon], { icon: customIcon }).addTo(this.map);
    }
}
    */

function initData()
{
    let mapa = new myMap();
}

class myMap{
    constructor(){
        this.fetchList();
    }

    fetchList(){
        fetch('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/petrol/llista.php')
        .then(response => {
            return response.text();
        })
        .then(data => {   // Usage of arrow funtions to avoid losing context when using "this"  https://www.w3schools.com/js/js_arrow_function.asp
            //console.log('data = ', data);
            const parsedData = JSON.parse(data);
            //console.log(parsedData.ciutats);

            const petrols = parsedData.benzineres;
            console.log(parsedData.benzineres);
            var data_list = document.getElementById('list');


            petrols.forEach(element => {
                let div = document.createElement('div');
                let p = document.createElement('p');
                let button = document.createElement('button');
                

                button.classList.add('full-width-button');

                let pText = document.createTextNode(element.nom + " (" + element.adreca + ")");

                p.appendChild(pText);
                div.appendChild(p);
                div.appendChild(button);
                data_list.appendChild(div);
            });
            

            
        })
        .catch(err => {
            console.error('Fetch error: ', err);
        });     
    }
}