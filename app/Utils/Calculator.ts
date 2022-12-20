import { getPreciseDistance, convertDistance, orderByDistance } from 'geolib'
import i from "interface"

export default class Calculator {

      public static async getDistance(input: i.IDistance) {
            const distance = getPreciseDistance(
                  { latitude: input.lat_departure, longitude: input.lng_departure },
                  { latitude: input.lat, longitude: input.lng }
            )
            // return distance
            return convertDistance(distance, 'km')
            // return this.distance(input, 'M')
      }

      public static async getCoorListByDistance(initLocation: i.ICLocation, input: i.ICLocation[]) {
            return orderByDistance(initLocation, input)
      }
}