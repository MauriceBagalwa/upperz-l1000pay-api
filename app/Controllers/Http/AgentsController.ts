import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger';
import { inject } from '@adonisjs/fold/build/src/decorators';
import upload from 'App/Utils/Upload.file';
import Hash from '@ioc:Adonis/Core/Hash';
import AgentValitor from "App/Validators/AgentValidator"
import AgentService from 'App/Services/Agent.service';
import UserService, { TypeMail } from 'App/Services/User.service';
import WalletService, { EModel } from 'App/Services/Wallet.service'

@inject()
export default class AgentsController extends AgentValitor {
      constructor(
            private agent: AgentService,
            private user: UserService,
            private wallet: WalletService
      ) {
            super()
      }

      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 10, status, orderBy = "created_at" } = request.only(['page', 'limit', `status`, `orderBy`])
                  const result = await this.agent.getAll({ page, limit, status, orderBy })
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
            const agentPayload = await request.validate({
                  schema: this.v_agent_create,
                  data: request.only(['officeAddress', 'description'])
            })

            try {
                  UserService.typeOfMail = TypeMail.AGENT
                  const user = await this.user.registre(userPayload)

                  agentPayload.userId = user.id
                  const data = await this.agent.registre(agentPayload)
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
                  schema: this.v_agent_update,
            })
            try {
                  const findAgent = await this.agent.find({ key: 'id', value: id })
                  if (!findAgent) return response.notFound({ status: false, message: 'Agent not found.' })

                  const data = await this.agent.update(findAgent.id, payload)
                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async update({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_update,
            })
            try {
                  const { userId } = auth.use('agent').user!
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

                  const _agent = await this.agent.find({ key: 'user_id', value: user.id })
                  if (!_agent) return response.notFound({ status: false, message: 'Identifiants incorrect' })

                  const token = await auth.use('agent').generate(_agent)
                  return response.ok({ status: true, token, data: _agent, })
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
                        await this.user.update(auth.use('agent').user!.userId as string, { profile })
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

      public async changedPassword({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({ schema: this.v_change_psswd })
            try {
                  //2
                  const user = await this.user.find({ key: 'id', value: auth.use('agent').user!.userId })
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

      public async logOut({ response, auth }: HttpContextContract) {
            try {
                  //2
                  auth.logout()
                  return response.created({
                        status: true,
                        message: 'Agent logOut.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * RECHERGE AGENT WALLET
       */
      public async rechargesTrans({ request, response, auth }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", userId, startDate, endDate } = request.qs()

                  //2
                  const { id } = auth.use('agent').user!
                  const wallet = await this.wallet.findWallet(EModel.AGENT, { key: 'agent_id', value: id })

                  const data = await this.user.transactions({ page, limit, orderBy, agentWalletId: wallet.id, userId, startDate, endDate })
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
                  schema: this.v_token_trans
            })
            try {

                  //2
                  const { id } = auth.use('agent').user!
                  const agentWallet = await this.wallet.findWallet(EModel.AGENT, { key: 'agent_id', value: id })

                  if (!agentWallet || !agentWallet!.status) {
                        return response.notFound({ status: false, message: 'Wallet not found or disable.' })
                  }

                  const customerWallet = await this.wallet.findCustomerWallet({ key: 'number_wallet', value: payload.wallet_number })

                  if (!customerWallet) {
                        return response.notFound({ status: false, message: 'Wallet not found.' })
                  }


                  if (!(await Hash.verify(agentWallet.password, payload.password))) {
                        throw new Error('Identifiants inccorect')
                  }

                  if (agentWallet.solde < payload.amount) {
                        return response.notFound({ status: false, message: `Echec de l'operation, Solde est inferieure.` })
                  }
                  //5
                  const transation = await this.agent.makeTrans({ amount: payload.amount, customerWalletId: customerWallet.id, agentWalletId: agentWallet.id })


                  return response.created({
                        status: true,
                        data: {
                              transation,
                              customer: customerWallet
                        }
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async transations({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", agentWalletId, customerWalletId, startDate, endDate } = request.qs()

                  const data = await this.agent.transactions({ page, limit, orderBy, agentWalletId, customerWalletId, startDate, endDate })
                  return response.ok({
                        status: true,
                        data,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async agentTransations({ request, response, auth }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", customerWalletId, startDate, endDate } = request.qs()

                  //2
                  const { id } = auth.use('agent').user!
                  const find = await this.wallet.findWallet(EModel.AGENT, { key: 'agent_id', value: id })

                  if (!find) return response.notFound({ status: false, message: 'Wallet not Found.' })

                  const data = await this.agent.transactions({
                        page,
                        limit,
                        orderBy,
                        agentWalletId: find.id,
                        customerWalletId,
                        startDate,
                        endDate
                  })

                  return response.ok({
                        status: true,
                        data,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
      public async customerRecharges({ request, response, auth }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", agentWalletId, startDate, endDate } = request.qs()

                  //2
                  const { id } = auth.use('customer').user!
                  const find = await this.wallet.findWallet(EModel.CUSTOMER, { key: 'customer_id', value: id })

                  if (!find) return response.notFound({ status: false, message: 'Wallet not Found.' })

                  const data = await this.agent.transactions({
                        page,
                        limit,
                        orderBy,
                        agentWalletId,
                        customerWalletId: find.id,
                        startDate,
                        endDate
                  })

                  return response.ok({
                        status: true,
                        data,
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}
