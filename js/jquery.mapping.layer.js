/*
    Jquery plugin to add mapping functionality to a page.
    Assumes that the address data has been marked up using HTML5 and the PostalAddress schema
    http://schema.org/PostalAddress
*/
(function ($) {
    $.fn.addMap = function () {
        this.each(function(val, item){
            var mapper = new MapstractionMapping();
            mapper.createMap(item);
        });
    };


})(jQuery);

MapstractionMapping = function() {
    return {
        createMap: function(item) {
            var map = $(".map", item)[0];
            var address = getAddress(item);
            if (map) {
                loadMap(map, address);
            }
        }
    };

    var mapstraction;
    var geocoder;	

    function getAddress(item) {
        var address = {
            street: $('[itemprop="streetAddress"]', item).text(),
            locality: $('[itemprop="addressLocality"]', item).text(),
            region: $('[itemprop="addressRegion"]', item).text(),
            postcode: $('[itemprop="postalCode"]', item).text(),
            country: $('[itemprop="addressCountry"]', item).text()
        };
        return address;
    }

    function geocodeReturn(geocodedLocation) {
        // Create the map control
        mapstraction.addControls({
            pan: true,
            zoom: 'small',
            map_type: true
        });
        // display the map centered on a latitude and longitude (Google zoom levels)		
        mapstraction.setCenterAndZoom(geocodedLocation.point, 15);
        // create a marker positioned at a lat/lon		
        var geocodeMarker = new mxn.Marker(geocodedLocation.point);
        var address = geocodedLocation.street + "," + geocodedLocation.locality + ", " + geocodedLocation.region + ", " + geocodedLocation.postcode;
        geocodeMarker.setInfoBubble(address);
        // display marker		
        mapstraction.addMarker(geocodeMarker);
        // open the marker		
        //geocode_marker.openBubble();
    }

    function loadMap(map, address) {
        // create mxn object
        mapstraction = new mxn.Mapstraction(map, 'googlev3');
        geocoder = new mxn.Geocoder('googlev3', geocodeReturn);

        geocoder.geocode(address);
    }
};

