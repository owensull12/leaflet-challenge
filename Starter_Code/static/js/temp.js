
// and earthquake data layer
let earthquakeLayer = new L.layerGroup()

d3.json(earthquakeURL).then(data => {
    console.log(data.features)

    function getColor(depth)
    {
        if (depth > 90)
            return '#d73027'
        else if (depth > 75)
            return '#fc8d59'
        else if (depth > 60)
            return '#fee08b'
        else if (depth > 45)
            return '#d9ef8b'
        else if (depth > 30)
            return '#91cf60'
        else
            return '#1a9850'
    }

    function radius(magnitude)
    {
        // make sure the earthquake shows up even if magnitude is 0
        if (magnitude == 0)
            return 1
        else
            return (magnitude * 3)
    }

    function circleStyle()
    {
        return {
            color: getColor(data.features.geometry.coordinates[2]),
            fillColor: getColor(data.features.geometry.coordinates[2]),
            opacity: 1.0,
            fillOpacity: 0.80,
            radius: radius(properties.mag)
        }
    }

    function onEachFeature(layer)
    {
        let lat = data.features.geometry.coordinates[1]
        let lng = data.features.geometry.coordinates[0]
        layer.L.circleMarker([lat, lng], circleStyle())
    }

    let earthquakeData = L.geoJson(data.features, {
        onEachFeature: onEachFeature
    })

    let overlayMaps = {
        Earthquakes: earthquakeData
    }
    
    let baseMap = {
        'Street': streetMap
    }


    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap)

    
/*
    L.geoJson(data, {
        pointToLayer: function(feature, latLon)
            {
                return L.circle(latLon)
            },
            
        style: circleStyle()
    }).addTo(earthquakeLayer)
    */
})