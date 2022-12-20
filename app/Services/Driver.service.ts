import Driver, { EStausDriver } from 'App/Models/Driver'
import i from "interface"

export default class DriverService {
      /* A private property. */
      public model = Driver
      private static _instance: DriverService

      public async getDrivers(params: i.IQuerry): Promise<Driver[]> {
            return await this.model
                  .query()
                  .preload('user')
                  // .preload('car', (car) => {
                  //       car.where('current', true)
                  // })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      /**
       * It returns a promise that resolves to a driver or null
       * @param params - i.IFindByKey
       * @returns The model.findBy() method is being returned.
       */
      public async find(params: i.IFindByKeyValue): Promise<Driver | null> {
            return await this.model.query().where(params.key, params.value)
                  .preload('user')
                  .first()
      }

      public async findForRide(params: i.IFindByKeyValue): Promise<Driver | null> {
            return await this.model.query().where(params.key, params.value)
                  .where("status", EStausDriver.FREE)
                  .preload('user', (query) => {
                        query.where("status", true)
                  })
                  .preload('assignedCar', (query) => {
                        query.where('current', true)
                  })
                  .first()
      }

      public async findDrivers(params: i.IRideDriver): Promise<Driver[]> {
            return await this.model.query().where("status", params.busy)
                  .preload('user', (query) => {
                        query.where("status", params.status)
                  })
                  .preload('assignedCar', (query) => {
                        query.where('current', true)
                  })
                  .limit(params.limit)
      }

      // public async getInfo(id: string): Promise<Driver | null> {
      //       return await this.model
      //             .query()
      //             .where('id', id)
      //             .preload('user', (user) => {
      //                   user.select(['name', 'lastname', 'country_code', 'phone_number', 'profile'])
      //             })
      //             .preload('car', (car) => {
      //                   car
      //                         .where('current', true)
      //                         .select(['id', 'designation', 'mark', 'number_plate', 'places', 'comment'])
      //             })
      //             .select(['id', 'user_id', 'lat', 'lng'])
      //             .first()
      // }

      // public async rinder(driverId: string, input: i.IPerformanceQuerry): Promise<Driver | null> {
      //       Logger.info(`Date: ${input.startDate}`)
      //       const startDate = Moment(`${input.startDate}`).format('YYYY-MM-DD')
      //       const endDate = Moment(`${!input.endDate ? input.startDate : input.endDate}`)
      //             .add(1, 'days')
      //             .format('YYYY-MM-DD')

      //       Logger.info(`Date: ${startDate}`)
      //       Logger.info(`Next Day: ${endDate}`)

      //       return await this.model
      //             .query()
      //             .where('id', driverId)
      //             .preload('payments', (payment) => {
      //                   payment
      //                         .where('payments.created_at', '>=', startDate)
      //                         .where('payments.created_at', '<', endDate)
      //                         .preload('race', (race) => {
      //                               race
      //                                     .select(['id', 'race_type_id', 'place_departure', 'place_arrival', 'distance'])
      //                                     .preload('raceType', (raceType) => {
      //                                           raceType.select(['designation'])
      //                                     })
      //                         })
      //             })
      //             .withAggregate('payments', (query) => {
      //                   query
      //                         .sum('amount_paid')
      //                         .as('rendir')
      //                         .where('payments.created_at', '>=', startDate)
      //                         .where('payments.created_at', '<', endDate)
      //             })
      //             .first()
      // }

      /**
       * It takes an input of type IDriver and returns a promise of type Driver or null
       * @param {IDriver} input - IDriver
       * @returns The model.create(input) is being returned.
       */
      public async registre(input: i.IDriver): Promise<Driver> {
            return await this.model.create(input)
      }

      /**
       * Update the driver with the given id with the given input
       * @param {string} userId - The id of the user you want to update
       * @param {object} input - object
       * @returns The updated driver
       */
      public async update(id: string, input: object): Promise<Driver | null> {
            await this.model.query().where('id', id).update(input).first()
            return this.model.query().where('id', id).preload('user')
                  .first()
      }

      // /**
      //  * It deletes a driver from the database
      //  * @param {string} userId - string
      //  * @returns The first driver that matches the userId
      //  */
      // public async delete(userId: string): Promise<Driver | null> {
      //       return await this.model.query().where('id', userId).delete().first()
      // }

      public static get Instance() {
            // Do you need arguments? Make it a regular static method instead.
            return this._instance || (this._instance = new this())
      }
}
