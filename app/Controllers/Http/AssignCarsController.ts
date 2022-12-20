import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignCarValidator from 'App/Validators/AssignCarValidator'
import AssigncarsService from 'App/Services/AssignCar.service'
import { inject } from '@adonisjs/fold';
import DriverService from 'App/Services/Driver.service'
import CarService from 'App/Services/Car.service'
import Logger from '@ioc:Adonis/Core/Logger'

@inject()
export default class AssigncarsController extends AssignCarValidator {
      constructor(
            private assignCar: AssigncarsService,
            private car: CarService,
            private driver: DriverService
      ) {
            super()
      }

      /**
       * It gets the page, limit and current from the request query string, then calls the service function
       * getAssignCars with the page, limit and current as parameters.
       * @param {HttpContextContract}  - page = 1, limit = 10, current
       * @returns The result of the service method.
       */
      public async index({ request, response }: HttpContextContract) {
            //1
            const { page = 1, limit = 10, current } = request.qs()
            try {
                  const result = await this.assignCar.getAssignCars({ page, limit, current })
                  response.ok({
                        status: true,
                        data: result
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_create,
            })
            try {
                  const _car = await this.car.find({ key: 'id', value: payload.carId })
                  if (_car?.status !== this.car.status.OPERATIONNEL)
                        return response.notFound({
                              status: false,
                              message: 'Aucune voiture trouver ou voiture non opérationel',
                        })

                  if (!(await this.driver.find({ key: 'id', value: payload.driverId })))
                        return response.notFound({
                              status: false,
                              message: 'Aucun chauffeur trouver ou chauffeur non actif.',
                        })

                  const find = await this.assignCar.find({ key: 'driverId', value: payload.driverId })
                  if (find) {
                        if (find?.carId === payload.carId)
                              return response.conflict({
                                    status: false,
                                    message: 'Le chauffeur est deja assigner à cette voiture.',
                              })
                        await this.assignCar.update(find.id, { current: false, end_of_assign: new Date() })
                  }

                  const findAssign = await this.assignCar.find({ key: 'carId', value: payload.carId })
                  if (findAssign)
                        await this.assignCar.update(findAssign.id,
                              { current: false, end_of_assign: new Date() })

                  const data = await this.assignCar.registre(payload)
                  response.created({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * It validates the request, then it calls the service to find the car by id, then it returns the
       * response
       * @param {HttpContextContract}  - HttpContextContract - This is the context of the request. It
       * contains the request and response objects.
       * @returns The response object is being returned.
       */
      public async show({ request, response }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })

            try {
                  const { page = 1, limit = 10 } = request.qs()
                  const data = await this.assignCar.findCarAssign(id, { page, limit })
                  response.ok({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * It takes the assignCarId from the request, validates it, and then passes it to the service to
       * delete the assign.
       * @param {HttpContextContract}  - request.param('assignCarId') -&gt; this is the id of the assignCar
       * that I want to delete
       * @returns The response object is being returned.
       */
      // public async delete({ request, response }: HttpContextContract) {
      //       // 1
      //       const payload = await request.validate({
      //             schema: this.v_delete,
      //             data: { id: request.param('id') },
      //       })

      //       try {
      //             await this.assignCar.delete(payload.id)
      //             response.ok({
      //                   status: true,
      //                   message: 'Assign deleted.',
      //             })
      //       } catch (error) {
      //             Logger.error(error)
      //             return response.expectationFailed({ status: false, message: error.message })
      //       }
      // }
}