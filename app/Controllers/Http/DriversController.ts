import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService, { TypeMail } from 'App/Services/User.service';
import DriverValidator from 'App/Validators/DriverValidator';
import { inject } from '@adonisjs/fold';
import DriverService from 'App/Services/Driver.service';
import Logger from '@ioc:Adonis/Core/Logger';
import upload from 'App/Utils/Upload.file';
import Hash from '@ioc:Adonis/Core/Hash';


@inject()
export default class DriversController extends DriverValidator {
      constructor(
            private driver: DriverService,
            private user: UserService,
      ) {
            super()
      }

      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 10, status, orderBy = "created_at" } = request.only(['page', 'limit', `status`, `orderBy`])
                  const result = await this.driver.getDrivers({ page, limit, status, orderBy })
                  response.ok({
                        status: true,
                        data: result,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {
            const userPayload = await request.validate({
                  schema: this.v_create,
            })
            const driverPayload = await request.validate({
                  schema: this.v_driver_create,
                  data: request.only(['userId', 'cardType', 'cardTypeId', 'cardImage'])
            })

            try {
                  UserService.typeOfMail = TypeMail.DRIVER
                  const user = await this.user.registre(userPayload)

                  driverPayload.userId = user.id
                  const data = await this.driver.registre(driverPayload)
                  response.created({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateInfo({ request, response }: HttpContextContract) {
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })

            const payload = await request.validate({
                  schema: this.v_driver_update_info,
            })
            try {
                  const findDriver = await this.driver.find({ key: 'id', value: id })
                  if (!findDriver) return response.notFound({ status: false, message: 'Driver not found.' })

                  const data = await this.driver.update(findDriver.id, payload)
                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async update({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_driver_update,
            })
            try {
                  const { userId } = auth.use('driver').user!
                  const data = await this.user.update(userId, payload)
                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async login({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_sign,
            })

            try {
                  const user = await this.user.signin(payload.email)
                  if (!user) return response.notFound({ status: false, message: 'Identifiants incorrect' })
                  if (!(await Hash.verify(user.password, payload.password)))
                        return response.notFound({ status: false, message: 'Identifiants incorrect.' })

                  const driver = await this.driver.find({ key: 'user_id', value: user.id })
                  if (!driver) return response.notFound({ status: false, message: 'Identifiants incorrect' })

                  const token = await auth.use('driver').generate(driver)
                  return response.ok({ status: true, token, data: driver, })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateProfile({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.v_profile })
            try {
                  //2
                  if (payload) {
                        //3
                        const result = await upload.uploads(payload.profile)
                        const profile = result.secure_url
                        await this.user.update(auth.use('driver').user!.userId as string, { profile })
                        return response.ok({
                              status: true,
                              data: {
                                    profile,
                              }
                        })
                  }
                  throw new Error('Echec de la modification.')
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async status({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.v_driver_status })
            try {
                  //2
                  const data = await this.driver.update(auth.use('driver').user!.id, payload)
                  return response.ok({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async changedPassword({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.v_change_psswd })
            try {
                  //2
                  const user = await this.user.find({ key: 'id', value: auth.use('driver').user!.userId })
                  if (!user) return response.notFound({ status: false, message: 'User not found.' })

                  if (!(await Hash.verify(user!.password as string, payload.oldPassword)))
                        return response.notFound({ status: false, message: 'Ancien mot de passe inccorect.' })

                  //3.
                  const password = await Hash.make(payload.password)
                  await this.user.update(user!.id as string, { password })
                  return response.created({
                        status: true,
                        message: 'mot de pass modifier.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateLocation({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_driver_location,
            })

            try {
                  //2
                  const { id } = auth.use('driver').user!
                  const data = await this.driver.update(id, payload)
                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async logOut({ response, auth }: HttpContextContract) {
            try {
                  //2
                  auth.logout()
                  return response.ok({
                        status: true,
                        message: 'Driver logOut.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}
