import { storageService } from "./async-storage.service.js"
import { mainController } from "../main.controller.js"

export const locService = {
    getLocs,
    createLocation
}

const LOCATION_KEY = 'LOCATION_DB'



const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
    let location = storageService.query(LOCATION_KEY).then(res => res.length === 0 ? locs : res)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(location)
        }, 2000)
    })
}


function createLocation(location, name) {
    var loc = {
        name,
        lat: location.lat,
        lng: location.lng,
        createAt: Date.now(),
        updatedAt: Date.now()
    }
    storageService.post(LOCATION_KEY, loc).then(() => mainController.onGetLocs())
}
