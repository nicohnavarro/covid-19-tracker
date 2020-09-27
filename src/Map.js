import React from 'react'
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css"
import { showDataOnMap } from './util';



function Map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
