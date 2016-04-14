var Maps = function () {
	"use strict";
    //function to initiate GMaps
    //Gmaps.js allows you to use the potential of Google Maps in a simple way.
    //For more information, please visit http://hpneo.github.io/gmaps/documentation.html
    var runMaps = function () {
        // Basic Map 
       var  map = new GMaps({
            el: '#map1',
            lat: -15.7897145,    
            lng: -47.8896079
        });
        //Markers
        var map2 = new GMaps({
            div: '#map2',
            lat: -15.7897145,    
            lng: -47.8896079
        });
        map2.addMarker({
            lat: -15.7897145,    
            lng: -47.8896079,
            title: 'Brasília',
            details: {
                database_id: 42,
                author: 'HPNeo'
            },
            click: function (e) {
                if (console.log)
                    console.log(e);
                alert('You clicked in this marker');
            }
        });
        map2.addMarker({
            lat: -15.7897145,    
            lng: -47.8896079,
            title: 'Marker with InfoWindow',
            height: '200px',
            infoWindow: {
                content: '<p>HTML Content</p>'
            }
        });
        //Street View 
        var panorama = GMaps.createPanorama({
            el: '#map3',
            lat: -15.7897145,    
            lng: -47.8896079
        });
        //Search Address
        var map4 = new GMaps({
            div: '#map4',
            lat: -15.7897145,    
            lng: -47.8896079
        });
        $('#geocoding_form').submit(function (e) {
            e.preventDefault();
            GMaps.geocode({
                address: $('#address').val().trim(),
                callback: function (results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        map4.setCenter(latlng.lat(), latlng.lng());
                        map4.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng()
                        });
                    }
                }
            });
        });
        //Interacting
        var map5;
        // Update position
        $(document).on('submit', '.edit_marker', function (e) {
            e.preventDefault();
            var $index = $(this).data('marker-index');
            $lat = $('#marker_' + $index + '_lat').val();
            $lng = $('#marker_' + $index + '_lng').val();
            var template = $('#edit_marker_template').text();
            // Update form values
            var content = template.replace(/{{index}}/g, $index).replace(/{{lat}}/g, $lat).replace(/{{lng}}/g, $lng);
            map5.markers[$index].setPosition(new google.maps.LatLng($lat, $lng));
            map5.markers[$index].infoWindow.setContent(content);
            $marker = $('#markers-with-coordinates').find('li').eq(0).find('a');
            $marker.data('marker-lat', $lat);
            $marker.data('marker-lng', $lng);
        });
        // Update center
        $(document).on('click', '.pan-to-marker', function (e) {
            e.preventDefault();
            var lat, lng;
            var $index = $(this).data('marker-index');
            var $lat = $(this).data('marker-lat');
            var $lng = $(this).data('marker-lng');
            if ($index != undefined) {
                // using indices
                var position = map5.markers[$index].getPosition();
                lat = position.lat();
                lng = position.lng();
            } else {
                // using coordinates
                lat = $lat;
                lng = $lng;
            }
            map5.setCenter(lat, lng);
        });
        map5 = new GMaps({
            div: '#map5',
            lat: -15.7897145,    
            lng: -47.8896079
        });
        GMaps.on('marker_added', map5, function (marker) {
            $('#map-ui').append('<tr><td><a href="#" class="pan-to-marker" data-marker-index="' + map5.markers.indexOf(marker) + '">' + marker.title + '</a></td><td><a href="#" class="pan-to-marker" data-marker-lat="' + marker.getPosition().lat() + '" data-marker-lng="' + marker.getPosition().lng() + '">' + marker.title + '</a></td></tr>');
        });
        GMaps.on('click', map5.map, function (event) {
            var index = map5.markers.length;
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            var template = $('#edit_marker_template').text();
            var content = template.replace(/{{index}}/g, index).replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);
            map5.addMarker({
                lat: lat,
                lng: lng,
                title: 'Marker #' + index,
                infoWindow: {
                    content: content
                }
            });
        });
    };
    return {
        //main function to initiate template pages
        init: function () {
            runMaps();
        }
    };
}();