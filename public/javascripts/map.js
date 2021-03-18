//On recupère les paramètres de l'url 
//on sépare grâce au "&"
//Exemple : http://192.168.1.45:3000/api/map.php?adresse=35%20rue%20du%20trou%20Cergy
//Donne : 35 rue du trou Cergy 
var getParams = function(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};



//Création des différents layers, afin de changer le mode d'affichage : Street, Relief, Satellite
var layers = {
    Streets: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJpc3kiLCJhIjoiY2s0N242dWR6MHVkNDNvanQyMnhlNDltNyJ9.LLrTAgXYW8ep6TSUDJCdXw'),
    Reliefs: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJpc3kiLCJhIjoiY2s0N242dWR6MHVkNDNvanQyMnhlNDltNyJ9.LLrTAgXYW8ep6TSUDJCdXw'),
    Satellite: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJpc3kiLCJhIjoiY2s0N242dWR6MHVkNDNvanQyMnhlNDltNyJ9.LLrTAgXYW8ep6TSUDJCdXw'),
};

//Initialision de la map, au milieu de la france 
var map = L.map('map', { layers: [layers.Streets] }).setView([48.866667, 2.3], 6);

//Création du bouton pour changer de layer
L.control.layers(null, layers, { position: 'bottomright' }).addTo(map);


//Création du groupe pour les cercles de non confinement et des markers
var myFeatureGroup = L.featureGroup().addTo(map);

//Affichage du niveau de zoom en haut à droite
map.zoomControl.setPosition('bottomright');

//Fonction afin d'afficher le rayon autour de l'adresse recherchée 
$(document).ready(async function rayon() {
    //On supprime les marqueurs et cercles déja existants 
    myFeatureGroup.clearLayers();

    //On récupère la recherche à partir du paramètre de l'URL
    var adresse = getParams(window.location.href).adresse;

    //On utilise l'api nominatim afin de récupérer les coordonnées via l'adresse (Attention fonction asynchrone, donc bien utiliser async et await)
    if (adresse != "") {
        await $.ajax({
            url: "https://api-adresse.data.gouv.fr/search/",
            type: 'get',
            data: "q=" + adresse + "&limit=1"
        }).done(await
            function(response) {
                if (response != '') {
                    data = JSON.parse(JSON.stringify(response));
                    y_coord = data.features[0].geometry.coordinates[1];
                    x_coord = data.features[0].geometry.coordinates[0];
                } else if (response == '') {
                    y_coord = null;
                    x_coord = null;

                }

            }).fail(function(error) {});
    }

    if ((y_coord == null) && (x_coord == null)) {
        console.log("test");
    } else {

        //On affiche le marker sur la map ainsi que le cercle autour de l'adresse recherchée 
        var marker = L.marker([y_coord, x_coord]).addTo(myFeatureGroup);
        L.circle([y_coord, x_coord], 10000).addTo(myFeatureGroup);
        map.setView([y_coord, x_coord], 8);

    }
});
