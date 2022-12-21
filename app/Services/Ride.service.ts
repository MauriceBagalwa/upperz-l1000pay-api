import Ride, { IRideStatus } from "App/Models/Ride"
import Driver from "App/Models/Driver"
import moment from "moment"
import i from "interface"

export type modelDriver = Driver
export type rideStatus = IRideStatus
export default class RideService {

      private ride = Ride
      startDate: string
      endDate: string
      private static _instance: RideService

      public async find(params: i.IFindByKeyValue): Promise<Ride | null> {
            return this.ride.findBy(params.key, params.value)
      }

      public async findForSelectDriver(input: i.IFindByKeyValue): Promise<Ride | null> {
            return this.ride.query().where(input.key, input.value).whereIn('status', [IRideStatus.DEMANDE, IRideStatus.EN_ATTENTE, IRideStatus.REJETER]).first()
      }

      public async rideForResponse(input: i.IFindByKeyValue): Promise<Ride | null> {
            return this.ride.query().where(input.key, input.value).whereIn('status', [IRideStatus.DEMANDE, IRideStatus.EN_ATTENTE]).first()
      }

      /**
       * It returns a paginated list of roles, ordered by the orderBy parameter, in descending order
       * @param params - i.IQuerry
       * @returns An array of Role objects or null.
       */
      public async getAll(params: i.IRideQuery): Promise<Ride[] | null> {

            if (params.startDate) {
                  this.startDate = moment(`${params.startDate}`).format('YYYY-MM-DD')
                  this.endDate = moment(`${!params.endDate ? params.startDate : params.endDate}`)
                        .add(1, 'days')
                        .format('YYYY-MM-DD')
            }

            return this.ride
                  .query()
                  .if(params.customerId, (query) => {
                        query.where('customer_id', params.customerId)
                  })
                  .if(params.driverId, (query) => {
                        query.where('driver_id', params.driverId as string)
                  })
                  .if(params.through, (query) => {
                        query.where('through', params.through)
                  })
                  .if(params.startDate, (query) =>
                        query
                              .where('rides.created_at', '>=', this.startDate)
                              .where('rides.created_at', '<', this.endDate)
                  )

                  // .if(params.distanceSup, (query) => {
                  //       query.where('distance', ">=", params.distanceSup as number)
                  // })
                  // .if(!params.distanceSup && params.distanceInf, (query) => {
                  //       query.where('distance', "=<", params.distanceInf as number)
                  // })
                  // .if(!params.status, (query) => {
                  //       query.where('status', params.status as string)
                  // })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async driverRaces(id: string, params: i.IRideQuerryFilter): Promise<Ride[]> {
            //1
            if (params.startDate) {
                  this.startDate = moment(`${params.startDate}`).format('YYYY-MM-DD')
                  this.endDate = moment(`${!params.endDate ? params.startDate : params.endDate}`)
                        .add(1, 'days')
                        .format('YYYY-MM-DD')
            }
            //2
            return await this.ride
                  .query()
                  .where('driver_id', id)
                  .if(params.status, (query) => query.where('status', params.status))
                  .if(params.startDate, (query) =>
                        query
                              .where('rides.created_at', '>=', this.startDate)
                              .where('rides.created_at', '<', this.endDate)
                  )
                  // .preload('raceType', (pquery) => {
                  //       pquery.select(['id', 'designation', 'description', 'price', 'currency'])
                  // })
                  .preload('customer', (pquery) => {
                        pquery.select(['id', 'name', 'lastname', 'country_code', 'phone_number', 'profile'])
                  })
                  // .preload('observation', (observation) => {
                  //       observation.select(['id', 'notes', 'comment'])
                  // })
                  .orderBy('created_at', 'desc')
                  .paginate(params.page, params.limit)
      }


      public async registre(input: i.IRide): Promise<Ride> {
            return this.ride.create(input)
      }

      public async update(id: string, input: i.IRide | i.ISelectDriver | object): Promise<Ride | null> {
            await this.ride.query().where('id', id).update(input).first()
            return await this.ride.findBy('id', id)
      }

      public async destroy(id: string): Promise<Ride | null> {
            return this.ride.query().where('id', id).delete().first()
      }

      public static get Instance() {
            // Do you need arguments? Make it a regular static method instead.
            return this._instance || (this._instance = new this())
      }
}