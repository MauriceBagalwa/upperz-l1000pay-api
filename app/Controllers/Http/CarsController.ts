import { inject } from '@adonisjs/fold';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import CarService from 'App/Services/Car.service'
import CarValidator from 'App/Validators/CarValidator'

@inject()
export default class CarsController extends CarValidator {

      constructor(private car: CarService) {
            super()
      }

      public async index({ request, response }: HttpContextContract) {
            //1
            const { page = 1, limit = 10, status, owner } = request.qs()
            await request.validate({
                  schema: this.v_status,
                  data: {
                        status,
                  },
            })

            try {
                  const data = await this.car.getCars({ page, limit, status, owner })
                  response.ok({
                        status: true,
                        data
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
                  // messages: this.messages,
            })
            try {
                  //2
                  const customer = await this.car.registre(payload)
                  return response.created({ status: true, data: customer })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async show({ request, response }: HttpContextContract) {
            try {
                  const result = await this.car.find({ key: 'id', value: request.param('id') })
                  response.ok({ status: true, data: result, message: 'ok.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async update({ request, response }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })

            const payload = await request.validate({
                  schema: this.v_update,
                  messages: this.messages,
            })

            try {
                  //2
                  if (!(await this.car.find({ key: 'id', value: id })))
                        return response.notFound({ status: false, message: 'Aucune voiture trouver.' })
                  //3
                  const data = await this.car.update(id, payload)
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
      public async changedStatus({ request, response }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })

            const payload = await request.validate({
                  schema: this.v_status,
            })

            try {
                  //2
                  if (!(await this.car.find({ key: 'id', value: id })))
                        return response.notFound({ status: false, message: 'Aucune voiture trouver.' })
                  //3
                  await this.car.update(id, payload)
                  response.created({ status: true, remessage: 'Car update.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async destroy({ request, response }: HttpContextContract) {
            //1
            try {
                  //2
                  const { id } = await request.validate({
                        schema: this.v_delete,
                        data: { id: request.param('id') },
                  })

                  if (!(await this.car.find({ key: 'id', value: id })))
                        return response.notFound({ status: false, message: 'Aucune voiture trouver.' })
                  //3
                  await this.car.delete(id)
                  response.created({ status: true, message: 'Car deletd.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}
