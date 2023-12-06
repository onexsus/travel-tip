import { locService } from './services/location-services.js'
import { mapService } from './services/map-services.js'

export const mainController = {
    onGetLocs
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLocation = onDeleteLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            const elLoc = document.querySelector('.locs')
            let strHtml = ''
            locs.forEach(pos => {
                strHtml += `
                <div class="card flex space-between">
                <div class="card-info flex column ">
                <p>Name:${pos.name}</p>
                <p>lat:${pos.lat}</p>
                <p>lng:${pos.lng}</p>
                </div>
                <div class="btns-card flex column">
                <button class="btn-go-card" onclick="onPanTo(${pos.lat}, ${pos.lng})"><img src="./img/icons/travel-svg.svg"></button>
                <button class="btn-delete-card" onclick="onDeleteLocation('${pos.id}')"><img src="./img/icons/trash-svg.svg"></button>
                </div>
                </div>`
            });
            elLoc.innerHTML = strHtml
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onDeleteLocation(posId) {
    var ans = confirm('Are you sure?')
    if (ans) locService.deleteLocation(posId)
}

