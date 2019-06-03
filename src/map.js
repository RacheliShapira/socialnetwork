import React from "react";

import axios from "axios";

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            venues: []
        };
        this.initMap = this.initMap.bind(this);
        this.getGeoLocation = this.getGeoLocation.bind(this);
    }

    componentDidMount() {
        this.getVenues();
        this.getGeoLocation();
    }

    renderMap() {
        loadScript(
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap"
        );
        window.initMap = this.initMap;
    }

    getVenues() {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?";
        const parameters = {
            client_id: "PMHC2WA1VCBHVYOPPSJ0QSBYTLRF4PNJ04OWVWV0PZJ0QFIR",
            client_secret: "CULSZZ44YAEBOWBFGPB4BF5ISRXXSNYR0EE3JV3CNE2ZWHV0",
            query: "food",
            near: "Berlin",
            v: "20182507"
        };

        axios
            .get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState(
                    {
                        venues: response.data.response.groups[0].items
                    },
                    this.renderMap()
                );
            })
            .catch(error => {
                console.log("ERROR!! " + error);
            });
    }
    getGeoLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                console.log("this. latituse ", this.state.lat);
            });
        } else {
            error => console.log("error getGeoLocation", error);
        }
    }

    initMap() {
        // Create A Map
        console.log("this. latituse !!!!", this.state.lat);
        var map = new window.google.maps.Map(document.getElementById("map"), {
            center: { lat: this.state.lat, lng: this.state.lng },
            zoom: 16
        });

        // Create An InfoWindow
        var infowindow = new window.google.maps.InfoWindow();

        // Display Dynamic Markers
        // this.state.venues.map(myVenue => {
        //     var contentString = `${myVenue.venue.name}`;
        //
        //     // Create A Marker
        //     var marker = new window.google.maps.Marker({
        //         position: {
        //             lat: myVenue.venue.location.lat,
        //             lng: myVenue.venue.location.lng
        //         },
        //         map: map,
        //         title: myVenue.venue.name
        //     });
        //
        //     // Click on A Marker!
        //     marker.addListener("click", function() {
        //         // Change the content
        //         infowindow.setContent(contentString);
        //
        //         // Open An InfoWindow
        //         infowindow.open(map, marker);
        //     });
        // });
    }

    render() {
        return <div id="map" />;
    }
}

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
}
