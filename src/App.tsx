import React from 'react';
import './App.css';
import MapView from "./MapView";

function App() {
    return (
        <div className="App">
            <div className="map-view">
                <h1 className="title">Map Project</h1>
                <MapView/>
            </div>
        </div>
    );
}

export default App;
