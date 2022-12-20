import { inject } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from "@ioc:Adonis/Core/Logger"
import CustomerService from 'App/Services/Customer.service'
import CustomerValidator from 'App/Validators/CustomerValidator'
import upload from 'App/Utils/Upload.file'

@inject()
export default class CustomersController extends CustomerValidator {
      constructor(private customer: CustomerService) {
            super()
      }
      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 10, status = true, orderBy = 'created_at' } = request.qs()
                  const result = await this.customer.getAll({ page, limit, status, orderBy })
                  response.ok({
                        status: true,
                        data: result
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_create,
            })
            try {
                  //2
                  const customer = await this.customer.registre(payload)
                  const token = await auth.use('customer').generate(customer)
                  //3
                  return response.created({ status: true, token, data: customer, message: 'compte creer.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async show({ response, params }: HttpContextContract) {
            try {
                  const id = params.id
                  const result = await this.customer.find({ key: 'id', value: id })
                  return response.ok({ status: true, data: result, message: 'compte creer.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async login({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_signin,
            })
            try {
                  //2
                  const _customer = await this.customer.login(payload)
                  Logger.info(`customer: ${_customer}`)
                  if (!_customer)
                        return response.notFound({
                              status: false,
                              message: "Identifiants inccorect."
                        })

                  // if (_customer) {
                  // //3
                  if (!(await Hash.verify(_customer!.password, payload.password))) {
                        throw new Error('Identifiants inccorect')
                  }
                  // //4
                  const token = await auth.use('customer').generate(_customer!)
                  return response.ok({ status: true, token, data: _customer })
                  // }
                  // throw new Error(`Identifiants inccorect`)
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async update({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_update,
            })
            try {
                  //2
                  const data = await this.customer.update(auth.user!.id, payload)
                  return response.created({ status: true, data })
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
                  const { id, password } = auth.use('customer').user!
                  if (!(await Hash.verify(password, payload.oldPassword)))
                        return response.notFound({
                              status: false,
                              message: 'Ancien mot de pass inccorect',
                        })
                  //3
                  const newPass = await Hash.make(payload.password)
                  await this.customer.update(id as string, { password: newPass })
                  return response.created({
                        status: true,
                        message: 'mot de passe modifier.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateProfile({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.profileValidator })
            try {
                  //2
                  if (payload) {
                        //3
                        const result = await upload.uploads(payload.profile)
                        const profile = result.secure_url
                        await this.customer.update(auth.use('customer').user!.id as string, { profile })
                        return response.created({
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

      public async destroy({ request, response }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })

            try {
                  //2
                  const find = await this.customer.find({ key: 'id', value: id })
                  if (!find) return response.notFound({ status: false, message: 'Aucun utilisateur trouver.' })
                  //4
                  await this.customer.delete(id)
                  return response.created({
                        status: true,
                        message: 'Compte utilisateur supprimer.',
                  })
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
                        message: 'Customer logOut.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}
