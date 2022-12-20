import AssignCar from 'App/Models/AssignCar'
import i from "interface"

export default class AssignCarService {
      private model = AssignCar

      /**
       * It returns a paginated list of cars, ordered by creation date, and filtered by status if a status
       * is provided.
       * @param params - i.ICarQuerry
       * @returns An array of Car objects
       */
      public async getAssignCars(params: i.IAssignCarQuerry): Promise<AssignCar[]> {
            return await this.model
                  .query()
                  .if(params.current, (query) => query.where('current', params.current as boolean))
                  .preload('car')
                  .preload('driver', (pquery) => {
                        pquery.preload('user')
                  })
                  .orderBy('start_assign', 'desc')
                  .paginate(params.page, params.limit)
      }

      public async find(params: i.IFindByKeyValue): Promise<AssignCar | null> {
            return await this.model
                  .query()
                  .where(params.key, params.value)
                  .where('current', true)
                  .preload('driver')
                  .preload('car')
                  .first()
      }

      public async findCarAssign(carId: string, params: i.IAssignCarQuerry): Promise<AssignCar[]> {
            return await this.model
                  .query()
                  .where('car_id', carId)
                  .preload('car')
                  .preload('driver', (pquery) => {
                        pquery.preload('user')
                  })
                  .orderBy('start_assign', 'desc')
                  .paginate(params.page, params.limit)
      }

      // public async getdriverAssign(params: i.IAssignCarQuerry): Promise<AssignCar[]> {
      //       return await this.model
      //             .query()
      //             .if(params.current, (query) => query.where('current', params.current))
      //             .preload('car')
      //             .preload('driver')
      //             .orderBy('start_assign', 'desc')
      //             .paginate(params.page, params.limit)
      // }

      // /**
      //  * It returns a promise that resolves to a car or null
      //  * @param params - i.IFindByKey
      //  * @returns A promise of a Car or null
      //  */
      // public async find(params: i.IFindByKeyValue): Promise<AssignCar | null> {
      //       return await this.model
      //             .query()
      //             .where(params.key, params.value)
      //             .where('current', true)
      //             .preload('driver')
      //             .preload('car')
      //             .first()
      // }

      // public async getDriverAssign(params: i.IFindByKeyValue): Promise<AssignCar | null> {
      //       return await this.model.query().where(params.key, params.value).where('current', true).first()
      // }

      /**
       * It takes an object of type `i.ICar` as an argument and returns a promise of type `Car`
       * @param input - i.ICar
       * @returns The model.create() method returns a promise.
       */
      public async registre(input: i.IAssignCar): Promise<AssignCar> {
            return await this.model.create(input)
      }

      /**
       * It takes an id and an input, and then updates the first row in the database that matches the id with
       * the input
       * @param {string} id - string - the id of the car you want to update
       * @param {i.ICarUpdate | i.ICarUpdateStatus} input - i.ICarUpdate | i.ICarUpdateStatus
       * @returns The first row of the table that matches the id.
       */
      public async update(id: string, input: i.IAssignCar | any): Promise<AssignCar> {
            return await this.model.query().where('id', id).update(input).first()
      }

      // /**
      //  * It deletes a car from the database, given the car's id.
      //  * @param {string} carId - string - The id of the car to delete
      //  * @returns The deleted car
      //  */
      public async delete(id: string): Promise<AssignCar> {
            return await this.model.findByOrFail('id', id)
      }
}
