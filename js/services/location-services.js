import { storageService } from "./async-storage.service.js"


export const locService = {
    getLocs,
    createLocation
}

const LOCATION_KEY = 'LOCATION_DB'



const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
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
    storageService.post(LOCATION_KEY, loc)
}
