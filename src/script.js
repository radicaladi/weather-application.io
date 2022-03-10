"use strict"
$(document).ready(function () {

    const mbKey = 'pk.eyJ1IjoicmFkaWNhbGFkaSIsImEiOiJjbDBqeXF0ZmwwaGJ2M2JwN2Z2NjQwOW05In0.DeG0uTVU7fTcakv_9P8-0g';
    const owKey = '5f916097135ba8b3d083e163507f65c7';

    // default start location: San Antonio, TX, USA
    let lat = 29.42;
    let lon = -98.49;

    mapboxgl.accessToken = mbKey;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
        center: [lon, lat]
    });

    let marker = new mapboxgl.Marker({
        draggable: true
    })
    marker
        .setLngLat([lon, lat])
        .addTo(map);

    function getWeather(lat, lng) {
        $.get("https://api.openweathermap.org/data/2.5/forecast", {
            APPID: owKey,
            lat: lat,
            lon: lng,
            units: "imperial"
        }).done(function (data) {
            console.log(data);
            let cards = $(".card-group");
            let city = $(".city");
            cards.html("");
            city.html("");
            city.append(`${data.city.name}`);
            console.log(data);

            for (let i = 0; i < data.list.length; i += 8) {
                console.log(data.list[i]);
                let date = new Date((data.list[i].dt) * 1000).toDateString();

                cards.append(`
                        <div class="card shadow me-2">
                            <div class="card-header text-center bg-secondary">${date}</div>
                            <div class="card-body text-center">
                                <h6>${data.list[i].main.temp_max}°F / ${data.list[i].main.temp_min}°F</h6>
                                <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="weather icon">
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item text-center">${data.list[i].weather[0].description}</li>
                                <li class="list-group-item">Humidity: ${data.list[i].main.humidity}%</li>
                                <li class="list-group-item">Wind: ${data.list[i].wind.speed} mph</li>
                                <li class="list-group-item">Pressure: ${data.list[i].main.pressure} hPa</li>
                            </ul>
                        </div>`)
            }
        })
    }

    $("#btnGet").click(function () {
        let nrt = $('#latitude').val();
        let est = $('#longitude').val();
        getWeather(nrt, est);
        marker
            .setLngLat([est, nrt]);
        map.flyTo({
            center: [est, nrt],
            essential: true,
            zoom: 11
        })
    })

    function onDragEnd() {
        var lngLat = marker.getLngLat();
        console.log(lngLat);
        getWeather(lngLat.lat, lngLat.lng);
        lon = lngLat.lng;
        lat = lngLat.lat;
        getWeather();
    }

    marker.on('dragend', onDragEnd);

    var longLat;

    $("#btnName").click(function (e) {
        e.preventDefault();
        var address = $("#name").val();
        longLat = marker.getLngLat();
        console.log(address);

        geocode(address, mbKey).then(function (result) {
            let nrt = result[1];
            let est = result[0];
            getWeather(nrt, est);
            marker
                .setLngLat([est, nrt]);
            map.flyTo({
                center: [est, nrt],
                essential: true,
                zoom: 11
            })
        });
    });

    function add_marker(event) {
        let coordinates = event.lngLat;
        console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
        marker.setLngLat(coordinates).addTo(map);
        map.flyTo({center: [coordinates.lng, coordinates.lat], zoom: 11});
        getWeather(coordinates.lat, coordinates.lng);
    }

    map.on('dblclick', add_marker);

});