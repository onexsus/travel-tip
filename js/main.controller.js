import { locService } from './services/location-services.js'
import { mapService } from './services/map-services.js'

export const mainController = {
    onGetLocs,
    onPanTo
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLocation = onDeleteLocation
window.onSearchLocation = onSearchLocation
window.onCopyUrl = onCopyUrl

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            renderQueryParams()
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

function onAddMarker({ lat, lng }) {
    console.log('Adding a marker')
    mapService.addMarker({ lat: lat, lng: lng })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            const elLoc = document.querySelector('.locs')
            let strHtml = ''
            locs.forEach(pos => {
                onAddMarker({ lat: pos.lat, lng: pos.lng })
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

function onSearchLocation(ev) {
    ev.preventDefault()
    const value = document.querySelector('input').value
    locService.searchLocation(value).then(res => {
        locService.createLocation(res, value)
        onPanTo(res.lat, res.lng)
    })
}

function onCopyUrl() {
    locService.getLocs().then(res => {
        res[res.length - 1]
        const queryParams = `?lat=${res[res.length - 1].lat}&lng=${res[res.length - 1].lng}`
        const newUrl =
            window.location.protocol + "//" +
            window.location.host +
            window.location.pathname + queryParams
        window.history.pushState({ path: newUrl }, '', newUrl)
        navigator.clipboard.writeText(newUrl)
    })
}

function renderQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const location = {
        lat: queryParams.get('lat') || 0,
        lng: +queryParams.get('lng') || 0
    }
    console.log(location.lat, location.lng)
    if (!location.lat || !location.lng) return

    onPanTo(location.lat, location.lng)
}