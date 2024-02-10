// bring in earthquake data
let earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// add tile layer
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

// layer group for earthquake points
let earthquakeData = new L.layerGroup()






d3.json(earthquakeURL).then(data => {
    console.log(data)

    // set the color for each point based on depth
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

    // set the radius of each point based on magnitude
    function radius(magnitude)
    {
        // make sure the earthquake shows up even if magnitude is 0
        if (magnitude == 0)
            return 1
        else
            return (magnitude * 3)
    }

    // set the style of each circleMarker
    function circleStyle(feature)
    {
        return {
            color: getColor(feature.geometry.coordinates[2]),
            fillColor: getColor(feature.geometry.coordinates[2]),
            opacity: 1.0,
            fillOpacity: 0.50,
            radius: radius(feature.properties.mag)
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latLng)
            {
                return L.circleMarker(latLng)
            },
            
        style: circleStyle,

        // popup info - location, mag, depth, and official USGS link
        onEachFeature: function(feature, layer)
            {
                layer.bindPopup(`Location: ${feature.properties.place}<br>
                Magnitude: ${feature.properties.mag}<br>
                Depth: ${feature.geometry.coordinates[2]}km<br>
                <a href='${feature.properties.url}' target='_blank' rel='noopener noreferrer'>USGS Link</a>`)
            }
    }).addTo(earthquakeData)
})



let overlay = {
    'Earthquake Data': earthquakeData
}

// center point of map will be Denver
let myMap = L.map('map', {
    center: [39.7392, -104.9903],
    zoom: 5
})

// legend
let legend = L.control({
    position: 'bottomright'
})

legend.onAdd = function()
{
    let div = L.DomUtil.create('div', 'legend')

    let intervals = [0, 15, 30, 45, 60, 75, 90]

    let colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027']

    let labels = []

    div.innerHTML += '<h3>Depth of Earthquake Origin (km)</h3>'

    // for (var i = 0; I < intervals.length; i++)
    // {
    //     div.innerHTML = "<h1>Depth of Earthquake Origin (km)</h1>" +
    //     "<div class=\"labels\">" +
    //     "<div class=\"min\">" + limits[0] + "</div>" +
    //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>"
    // }
    // return div

    for (var i = 0; i < intervals.length - 1; i++)
    {
        div.innerHTML += '<li style="background: ' + colors[i] + '"></li> ' + '<span>' + intervals[i] + 
        (intervals[i + 1] ? 'km' + intervals[i + 1] + 'km</span><br>' : '+')
    }

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'

    return div
}



earthquakeData.addTo(myMap)

streetMap.addTo(myMap)

legend.addTo(myMap)