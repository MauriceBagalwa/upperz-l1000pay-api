import { inject } from '@adonisjs/fold';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService, { TypeMail } from 'App/Services/User.service'
import WalletService from 'App/Services/Wallet.service'
import upload from 'App/Utils/Upload.file'
import UserValidator from 'App/Validators/UserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import generate from 'App/Utils/Generator'
import send from 'App/Utils/Sender'

@inject()
export default class UsersController extends UserValidator {
      constructor(private readonly user: UserService, private wallet: WalletService) {
            super()
      }


      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, status = true, orderBy = "created_at" } = request.qs()
                  const data = await this.user.getAll({ page, limit, status, orderBy })
                  return response.ok({ status: true, data })
            } catch (error: any) {
                  Logger.error(error.message)
                  return response.expectationFailed({ status: false, data: null, message: error.message })
            }
      }

      /**
         * 1. We validate the request using the ProfileValidator schema.
         * 2. If the request is valid, we upload the file.
         * 3. If the file is uploaded, we return a success response
         * @param {HttpContextContract}  - 1. The request object is used to get the file from the request.
         */
      public async profile({ request, response }: HttpContextContract) {
            //1
            const profile = await request.validate({ schema: this.v_profile })
            try {
                  //2
                  if (profile) {
                        //3
                        const result = await upload.uploads(profile.profile)
                        return response.ok({
                              status: true,
                              data: { url: result.secure_url },
                              message: 'Profile Upload.',
                        })
                  }
                  throw new Error('Echec de chargement du profile.')
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, data: null, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_create
            })
            try {
                  UserService.typeOfMail = TypeMail.ADMINISTARTION
                  const result = await this.user.registre(payload)
                  response.created({ status: true, data: result })
            } catch (error) {
                  Logger.error(`Error: ${error.message}`)
                  return response.expectationFailed({ status: false, data: null, message: error.message })
            }
      }

      public async login({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_sign,
            })

            try {
                  const findUser = await this.user.signin(payload.email)

                  if (!findUser || !findUser.status) return response.notFound({ status: false, message: 'Identifiants inccorect' })

                  if (!(await Hash.verify(findUser.password, payload.password)))
                        return response.notFound({ status: false, message: 'Identifiants inccorect.' })

                  const token = await auth.use('user').generate(findUser)
                  return response.ok({ status: true, token, data: findUser })
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
                        await this.user.update(auth.user!.id, { profile })
                        return response.created
                              ({
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

      public async updatePassword({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.v_change_psswd })
            try {
                  //2
                  const user = auth.use('user').user!
                  if (!(await Hash.verify(user.password as string, payload.oldPassword)))
                        return response.notFound({ status: false, message: 'Ancien mot de passe inccorect.' })
                  //3
                  const password = await Hash.make(payload.password)
                  await this.user.update(user.id as string, { password })
                  return response.ok({
                        status: true,
                        message: 'mot de pass modifier.',
                  })
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
                  const data = await this.user.update(auth.user!.id, payload)
                  return response.ok({ status: false, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async accountStatus({ request, response }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })
            try {
                  //2
                  const find = await this.user.find({ key: 'id', value: id })
                  if (!find)
                        return response.expectationFailed({ status: false, message: 'Aucun utilisateur trouver.' })
                  //3
                  await this.user.update(id, { status: !find.status })
                  return response.ok({ status: true, message: 'Compte utilisateur modifier.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async resetPassword({ request, response, auth }: HttpContextContract) {
            //1
            const { id } = await request.validate({
                  schema: this.v_delete,
                  data: { id: request.param('id') },
            })
            try {
                  //2
                  const find = await this.user.find({ key: 'id', value: id })
                  if (!find) return response.notFound({ status: false, message: 'Aucun utilisateur trouver.' })
                  //3
                  let password = generate.password(8)
                  const _user = auth.use('user').user!
                  const userAuth = `${_user.name} ${_user.lastname}`
                  await send.resetUserPsswd({
                        to: find.email,
                        data: {
                              user: `${find.name} ${find.lastname}`,
                              user_admin: userAuth,
                              password,
                        },
                  })
                  //5
                  await this.user.update(id, { password: await Hash.make(password) })
                  return response.ok({ status: true, message: 'Mot de pase renitialiser.' })
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
                  const find = await this.user.find({ key: 'id', value: id })
                  if (!find) return response.notFound({ status: false, message: 'Aucun utilisateur trouver.' })
                  //4
                  await this.user.destroy(id)
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
                        message: 'User logOut.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }


      /**
       * RECHERGE AGENT WALLET
       */
      public async transations({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", agentWalletId, userId, startDate, endDate } = request.qs()
                  const data = await this.user.transactions({ page, limit, orderBy, agentWalletId, userId, startDate, endDate })
                  return response.ok({
                        status: true,
                        data,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async makeTransation({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_transation
            })

            try {
                  const find = await this.wallet.agent_findWallet({ key: 'number_wallet', value: payload.numberWallet })
                  if (!find) return response.notFound({ status: false, message: 'Wallet not Found.' })

                  const userId = auth.use('user').user!.id
                  const data = await this.user.makeTrans({ amount: payload.amount, agentWalletId: find.id, userId })
                  return response.created({
                        status: true,
                        data,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}


