var cheapruler = require('cheap-ruler');
var tilebelt = require('tilebelt');

module.exports = function (sources, tile, write, done) {
    var ruler = cheapruler.fromTile(tile[1], tile[2], 'miles');

    var blacklist = [
        'footway',
        'cycleway',
        'steps',
        'bridleway',
        'path',
        'track',
        'pedestrian'
    ];

    var miles = 0;

    var osm = sources.osm.osm;
    osm.features.filter(function(feature) {
        return blacklist.indexOf(feature.properties.highway) > -1;
    }).forEach(function(road) {
        miles += ruler.lineDistance(road.geometry.coordinates);
    });

    miles = parseFloat(miles.toFixed(2));

    if (miles) {
        // reduce precision on the tilebelt output if the file is too large
        tile = {
            type: 'Feature',
            geometry: tilebelt.tileToGeoJSON(tile),
            properties: {
                miles: miles
            }
        };
        write(JSON.stringify(tile) + '\n');
    }

    done(null, miles);
};
