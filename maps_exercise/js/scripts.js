
var mapa;

function initData()
{
    mapa = new myMap('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/petrol/llista.php');
}

function onClick24hs(){
    mapa = new myMap('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/petrol/llista24hs.php');
    var details = document.getElementsByClassName('details')[0];
    details.innerHTML = '';
}

function onClickAll(){
    mapa = new myMap('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/petrol/llista.php');
    var details = document.getElementsByClassName('details')[0];
    details.innerHTML = '';

}

class myMap{
    constructor(url){
        this.map = null;
        this.forecast = [];
        this.url = url;
        this.drawMap();
        
    }

    drawMap() {
        const mapContainer = document.getElementById('map');
        
        if (this.map !== null) {
            this.map.remove(); // Destruye el mapa existente
        }

        // Elimina cualquier mapa Leaflet anterior si existe
        if (mapContainer._leaflet_id) {
            mapContainer._leaflet_id = null;  // Restablece el ID de Leaflet
            mapContainer.innerHTML = '';  // Limpia el contenedor
        }


        this.map = L.map("map").setView([41.3887900,2.1589900], 13); // Constructor V1, static id 
        

        //Tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.fetchList();
    }

    fetchList(){
        fetch(this.url)
        .then(response => {
            return response.text();
        })
        .then(data => {   // Usage of arrow funtions to avoid losing context when using "this"  https://www.w3schools.com/js/js_arrow_function.asp
            //console.log('data = ', data);
            const parsedData = JSON.parse(data);
            this.forecast = parsedData.benzineres;
            //console.log(parsedData.ciutats);

            const petrols = parsedData.benzineres;
            var data_list = document.getElementById('list');
            data_list.innerHTML = '';


            petrols.forEach(element => {
                let div = document.createElement('div');
                let p = document.createElement('p');
                let button = document.createElement('button');
                

                button.classList.add('full-width-button');

                let pText = document.createTextNode(element.nom + " (" + element.adreca + ")");

                button.addEventListener('click', () =>{
                    this.showDetails(element);
                });

                p.appendChild(pText);
                div.appendChild(p);
                div.appendChild(button);
                data_list.appendChild(div);
            });

            this.drawData();
            

            
        })
        .catch(err => {
            console.error('Fetch error: ', err);
        });     
    }

    drawData(){
        // Empty array to store coords/points list
        const bounds = [];

        this.forecast.forEach(petrol => {


            this.drawMarker(petrol.lat, petrol.lon, petrol);
            
            // Adding marker coords to the list for fitbounds
            bounds.push([petrol.lat, petrol.lon]);   
        });
        //Fit bounds
        if (bounds.length) {
            const latLngBounds = L.latLngBounds(bounds);
            this.map.fitBounds(latLngBounds);
        }
    }

    drawMarker(lat, lon, petrol) {
        const marker = L.marker([lat,lon]).addTo(this.map);

        marker.on('click', () => {
            this.showDetails(petrol);    
        });
    }

    showDetails(petrol)
    {
        fetch('https://citmalumnes.upc.es/~davids/awug2425/05%20maps/petrol/benzinera.php?benzinera=' + petrol.id)
        .then(response => {
            return response.text();
        })
        .then(data => {   // Usage of arrow funtions to avoid losing context when using "this"  https://www.w3schools.com/js/js_arrow_function.asp
            const parsedData = JSON.parse(data);
            console.log(parsedData);

            var details = document.getElementsByClassName('details')[0];
            details.innerHTML = '';

            var pname = document.createElement('p');
            var ptextname = document.createTextNode('Name: ' + parsedData.benzinera.nom + '(' + parsedData.benzinera.adreca + ')');
            pname.appendChild(ptextname);
            details.appendChild(pname);


            var ptel = document.createElement('p');
            var ptexttel = document.createTextNode('Phone: ' + parsedData.benzinera.telefon);
            ptel.appendChild(ptexttel);
            details.appendChild(ptel);

            if(parsedData.benzinera.email != '')
            {
                var pemail = document.createElement('p');
                var ptextemail = document.createTextNode('Email: ' + parsedData.benzinera.email);
                pemail.appendChild(ptextemail);
                details.appendChild(pemail);
            }

            var pschedule = document.createElement('p');
            var ptextschedule = document.createTextNode('Schedule: ' + parsedData.benzinera.horari);
            pschedule.appendChild(ptextschedule);
            details.appendChild(pschedule); 
        })
        .catch(err => {
            console.error('Fetch error: ', err);
        });    
    }
}