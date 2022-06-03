import React, { useEffect } from "react";

export interface MapState {
    loading: boolean;
    map: google.maps.Map | null;
    info: google.maps.InfoWindow | null;
}

export default class MapView extends React.Component<any, MapState> {

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            map: null,
            info: null
        }
    }


    componentDidMount() {
        this.initMap();
    }

    initMap() {
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
        });

        const infoWindow = new google.maps.InfoWindow();
        this.setState({
            map: map,
            loading: false,
            info: infoWindow
        });

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Your location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                (err) => {
                    this.handleLocationError(true, infoWindow, map.getCenter()!);
                }
            );
        } else {
            this.handleLocationError(false, infoWindow, map.getCenter()!);
        }
    }

    handleLocationError(
        browserHasGeolocation: boolean,
        infoWindow: google.maps.InfoWindow,
        pos: google.maps.LatLng
    ) {
        if(this.state.loading || this.state.map === null) return;

        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
                ? "Error: The Geolocation service failed."
                : "Error: Your browser doesn't support geolocation."
        );
        infoWindow.open(this.state.map);
    }

    findMyLocation() {
        if (this.state.info === null || this.state.map === null) return;

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    if (this.state.info === null || this.state.map === null) return;
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    this.state.info.setPosition(pos);
                    this.state.info.setContent("Your location found.");
                    this.state.info.open(this.state.map);
                    this.state.map.setCenter(pos);
                },
                (err) => {
                    if (this.state.info === null || this.state.map === null) return;
                    this.handleLocationError(true, this.state.info, this.state.map.getCenter()!);
                }
            );
        } else {
            this.handleLocationError(false, this.state.info, this.state.map.getCenter()!);
        }
    }

    findRandomLocation() {
        const lng = Math.floor(Math.random() * 360) - 180;
        const ltd = Math.floor(Math.random() * 180) - 90;

        const pos = {
            lat: ltd,
            lng: lng,
        };

        if(this.state.info !== null && this.state.map !== null) {
            this.state.info.setPosition(pos);
            this.state.info.setContent("Random location found.");
            this.state.info.open(this.state.map);
            this.state.map.setCenter(pos);
        }
    }

    render() {
        return (
            <div id={'map-wrapper'}>
                <div id={'map-buttons'}>
                    <button style={{
                        float: "left",
                        backgroundColor: 'rgb(46, 193, 239)'
                    }} className="map-button" onClick={() => {
                        this.findRandomLocation();
                    }}>
                        Teleprt me to somewhere random
                    </button>
                    <button style={{
                        float: "right",
                        backgroundColor: 'rgb(154, 46, 239)'
                    }} className="map-button" onClick={() => {
                        this.findMyLocation();
                    }}>
                        Bring me back home
                    </button>
                </div>
                <div id={'map'}>
                </div>
            </div>
        )
    }
}
