import Car, { ICarStatus } from 'App/Models/Car'
import i from "interface"

export default class CarService {
      private model = Car
      status = ICarStatus
      /**
       * It returns a paginated list of cars, ordered by creation date, and filtered by status if a status
       * is provided.
       * @param params - i.ICarQuerry
       * @returns An array of Car objects
       */
      public async getCars(params: i.ICarQuerry): Promise<Car[]> {
            return await this.model
                  .query()
                  .if(params.status, (query) => query.where('status', params.status))
                  .if(params.owner, (query) => query.where('owner', params.owner))
                  .orderBy('created_at', 'desc')
                  .paginate(params.page, params.limit)
      }

      /**
       * It returns a promise that resolves to a car or null
       * @param params - i.IFindByKey
       * @returns A promise of a Car or null
       */
      public async find(params: i.IFindByKeyValue): Promise<Car | null> {
            return await this.model.findBy(params.key, params.value)
      }

      // public async findCarOperational(carId: string): Promise<Car | null> {
      //       return await this.model
      //             .query()
      //             .where('id', carId)
      //             .andWhere('status', this.status.OPERATIONNEL)
      //             .first()
      // }

      /**
       * It takes an object of type `i.ICar` as an argument and returns a promise of type `Car`
       * @param input - i.ICar
       * @returns The model.create() method returns a promise.
       */
      public async registre(input: i.ICar): Promise<Car> {
            return await this.model.create(input)
      }

      /**
       * It takes an id and an input, and then updates the first row in the database that matches the id with
       * the input
       * @param {string} id - string - the id of the car you want to update
       * @param {i.ICarUpdate | i.ICarUpdateStatus} input - i.ICarUpdate | i.ICarUpdateStatus
       * @returns The first row of the table that matches the id.
       */
      public async update(id: string, input: object): Promise<Car | null> {
            await this.model.query().where('id', id).update(input).first()
            return await this.model.findBy('id', id)
      }

      /**
       * It deletes a car from the database, given the car's id.
       * @param {string} carId - string - The id of the car to delete
       * @returns The deleted car
       */
      public async delete(carId: string): Promise<Car> {
            return await this.model.query().where('id', carId).delete().first()
      }
}
