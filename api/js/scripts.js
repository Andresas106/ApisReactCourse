let dades = [];
let currentPage = 1;  // La página inicial
function loadApiUrl(url, isSearch=false)
{
    if (!isSearch) {
        var inputsearch = document.getElementById('search-input');
        inputsearch.value = ""; // Limpiar el campo de búsqueda
    }

    fetch(url)
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        dades= JSON.parse(data);
		var root = document.getElementById('root');
        var details = document.getElementById('details');
        var details_side = document.getElementById('details-side');
        var details_img = document.getElementById('trailers-images');
        
        details.innerHTML = "";
        details_side.innerHTML= "";
        details_img.innerHTML = "";
        root.innerHTML = "";
        currentPage = getPageFromUrl(url);

        for(var i=0;i<dades.results.length;i++)
        {
            var div_item = document.createElement('div');
            div_item.id = dades.results[i].id;
            var p = document.createElement('p');
            var textgame = document.createTextNode(dades.results[i].name);
            p.appendChild(textgame);
            div_item.addEventListener('click', handleItemClick);

            div_item.appendChild(p);

            var img = document.createElement('img');
            img.src = dades.results[i].background_image;
            img.loading = "lazy"; 
            img.alt = dades.results[i].name; 
            
            div_item.appendChild(img);
            root.appendChild(div_item);
        }

        var pagination = document.getElementById('pagination');
        pagination.innerHTML = "";

        if(dades.previous != null)
        {
            var buttonAnt = document.createElement('input');
            buttonAnt.type = "button";
            buttonAnt.value = "Previous";
            pagination.appendChild(buttonAnt);

            buttonAnt.addEventListener('click',() => loadApiUrl(dades.previous, false));
        }

        
        const totalPages = Math.ceil(dades.count / 20);

         // Rango limitado de números de página visibles
        const maxVisiblePages = 5;  // Máximo de páginas visibles a la vez
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Crear botones numerados de las páginas visibles
        for (let i = startPage; i <= endPage; i++) {
            let buttonPage = document.createElement('input');
            buttonPage.type = "button";
            buttonPage.value = i;
            if (i === currentPage) {
                buttonPage.style.backgroundColor = 'black';  // Resalta la página actual
            }
            pagination.appendChild(buttonPage);
            buttonPage.addEventListener('click', () =>  loadApiUrl('https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e&page=' + i, false));
        }

        if(dades.next != null)
            {
                var buttonSig = document.createElement('input');
                buttonSig.type = "button";
                buttonSig.value = "Next";
                pagination.appendChild(buttonSig);
                buttonSig.addEventListener('click',() => loadApiUrl(dades.next, false));
            }
    })
    .catch(function(err) {
        console.error(err);
    });
}

function searchGame()
{
    var inputsearch = document.getElementById('search-input');
    if(inputsearch.value.trim() !== "")
    {
        loadApiUrl('https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e&search=' + inputsearch.value, true);
    }
    else
    {
        loadApiUrl('https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e', true);
    }
}

function ShowDetails(evt){
    var details = document.getElementById('details');
    details.innerHTML = "";
    var ul = document.createElement("ul");
// https://api.rawg.io/api/games/{game_pk}?key={yourAPIkey}
    var id = evt.currentTarget.id;
    var url = "https://api.rawg.io/api/games/" + id + "?key=7ea9457a112040cc9e36b4e1ef3c6d7e";
    fetch(url)
.then(function(response) {
    return response.text();
})
.then(function(data) {
    let dadesDetail= JSON.parse(data);

    var description = document.createElement('li');
    var released = document.createElement('li');
    var rating = document.createElement('li');

    var tdescription = document.createTextNode('Description:' + dadesDetail.description_raw);
    var treleased = document.createTextNode('Released:' + dadesDetail.released);
    var trating = document.createTextNode('Metacritic:' + dadesDetail.metacritic);

    description.appendChild(tdescription);
    released.appendChild(treleased);
    rating.appendChild(trating);

    ul.appendChild(description);
    ul.appendChild(released);
    ul.appendChild(rating);

    details.appendChild(ul);
    
})
.catch(function(err) {
    console.error(err);
}); 
}

function ShowGameSeries(evt){
    //: https://api.rawg.io/api/games/{game_pk}/game-series?key={yourAPIkey}
    var details_side = document.getElementById('details-side');
    details_side.innerHTML = "";
    var id = evt.currentTarget.id;
    var url = 'https://api.rawg.io/api/games/' + id + '/game-series?key=7ea9457a112040cc9e36b4e1ef3c6d7e';
    
    fetch(url)
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        let dadesSeries= JSON.parse(data);

        if(dadesSeries.count > 0)
        {
            var h2 = document.createElement('h2');
            var texth2 = document.createTextNode('Same Series Games');
            h2.appendChild(texth2);
            details_side.appendChild(h2);
            for(let i =0;i<dadesSeries.results.length;i++)
            {
                var div_item = document.createElement('div');
                div_item.id = dadesSeries.results[i].id;
                var p = document.createElement('p');
                var textgame = document.createTextNode(dadesSeries.results[i].name);
                p.appendChild(textgame);


                div_item.addEventListener('click', handleItemClick);
                div_item.appendChild(p);



                details_side.appendChild(div_item);
            }
        }
        else
        {
            var div_item = document.createElement('div');
            var p = document.createElement('p');
            var ptext = document.createTextNode('No other series games found');
            p.appendChild(ptext);

            div_item.style.cursor = 'auto';

            div_item.appendChild(p);
            details_side.appendChild(div_item);
        }
        
        
    })
    .catch(function(err) {
        console.error(err);
    });  
}

function ShowTrailersAndImagesGame(evt)
{
    //: https://api.rawg.io/api/games/{game_pk}/screenshots?key={yourAPIkey}
    // https://api.rawg.io/api/games/{id}/movies?key={yourAPIkey}
    var trailersImages = document.getElementById('trailers-images');
    trailersImages.innerHTML = '';
    var id = evt.currentTarget.id;
    //images
    var url1 = 'https://api.rawg.io/api/games/' + id + '/movies?key=7ea9457a112040cc9e36b4e1ef3c6d7e';
    var url2 = 'https://api.rawg.io/api/games/' + id + '/screenshots?key=7ea9457a112040cc9e36b4e1ef3c6d7e';

    //url1
    fetch(url1)
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        let dadesTrailer= JSON.parse(data);
        
        for(let i = 0;i<dadesTrailer.results.length;i++)
        {
            let video = document.createElement('video');
            video.setAttribute('controls', '');

            var source = document.createElement('source');
            source.src = dadesTrailer.results[i].data.max;
            source.type = 'video/mp4';

            video.appendChild(source);
            trailersImages.appendChild(video);
        }
    })
    .catch(function(err) {
        console.error(err);
    });  


    //url2
    setTimeout(() => {
        fetch(url2)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            let dadesImages= JSON.parse(data);
            for(let i = 0;i<dadesImages.results.length;i++)
                {
                    let img = document.createElement('img');
                    img.src = dadesImages.results[i].image;
                    img.alt = 'Image ' + 1;
                    img.loading = "lazy"; 

                    
                    trailersImages.appendChild(img);
                }
        })
        .catch(function(err) {
            console.error(err);
        });
    }, 100);
    


}

function handleItemClick(evt)
{
    ShowDetails(evt);
    ShowGameSeries(evt);
    ShowTrailersAndImagesGame(evt);
}

// Función para extraer el número de página de la URL
function getPageFromUrl(url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return parseInt(urlParams.get('page')) || 1;  // Si no hay parámetro page, asumir la página 1
}



