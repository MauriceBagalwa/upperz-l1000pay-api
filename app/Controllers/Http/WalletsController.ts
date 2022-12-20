import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold';
import WalletService, { EModel } from 'App/Services/Wallet.service';
import Logger from '@ioc:Adonis/Core/Logger';
import WalletValidator from 'App/Validators/WalletValidator';
import Hash from '@ioc:Adonis/Core/Hash';
import i from 'interface';

@inject()
export default class WalletsController extends WalletValidator {
      constructor(private wallet: WalletService) {
            super()
      }

      public async customerWallets({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", status } = request.qs()
                  const data = await this.wallet.c_Wallets({ page, limit, orderBy, status })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
      // public async customerWallet({ response, auth }: HttpContextContract) {
      //       try {
      //             const data = await this.wallet.findWallet({ key: 'customer_id', value: auth.use('customer').user!.id })
      //             response.ok({ status: true, data })
      //       } catch (error) {
      //             Logger.error(`Error :) ${error.message}`)
      //             response.expectationFailed({ status: false, message: error.message })
      //       }
      // }

      // public async updateCWallet({ request, response }: HttpContextContract) {
      //       const { id } = await request.validate({
      //             schema: this.v_cwallet,
      //             data: { id: request.param('id') }
      //       })
      //       try {
      //             const find = await this.wallet.findWallet({ key: 'id', value: id })
      //             if (!find) response.notFound({ status: false, message: 'Wallet not found.' })

      //             const data = await this.wallet.updateWallet(find!)
      //             response.created({ status: true, data })
      //       } catch (error) {
      //             Logger.error(`Error :) ${error.message}`)
      //             response.expectationFailed({ status: false, message: error.message })
      //       }
      // }

      /**
       * D R I V E R 
       */
      public async driverWallets({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", status } = request.qs()
                  const data = await this.wallet.d_Wallets({ page, limit, orderBy, status })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateDriverWallet({ request, response }: HttpContextContract) {
            const { id } = await request.validate({
                  schema: this.v_dwallet,
                  data: { id: request.param('id') }
            })
            try {
                  const find = await this.wallet.d_findWallet({ key: 'id', value: id })
                  if (!find) return response.notFound({ status: false, message: 'Wallet not found.' })

                  const data = await this.wallet.d_updateWallet(find!)
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
      /**
       * A G E N T
       */
      public async agentWallets({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", status, agentId } = request.qs()
                  const data = await this.wallet.agent_Wallets({ page, limit, orderBy, status, agentId })
                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updareAgentWallet({ request, response }: HttpContextContract) {
            const { id } = await request.validate({
                  schema: this.v_dwallet,
                  data: { id: request.param('id') }
            })

            try {
                  const find = await this.wallet.agent_findWallet({ key: 'id', value: id })
                  if (!find) return response.notFound({ status: false, message: 'Wallet not found.' })

                  const data = await this.wallet.agent_updateWallet(find!)
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
      /**
       * ************** ************* **************
       */
      async verify(input: i.IWalletBase) {


            const _key = input.model === EModel.CUSTOMER ? "customer_id" : input.model === EModel.AGENT ? "agent_id" : "driver_id"
            const find = await this.wallet.findWallet(input.model, { key: _key, value: input.id })

            if (!find) {
                  throw new Error('Wallet not Found.')
            }

            if (!find!.status) {
                  throw new Error('Wallet disable.')
            }

            if (!(await Hash.verify(find.password, input.password))) {
                  throw new Error('Identifiants inccorect')
            }

            return find
      }

      public async walletToken({ request, response, auth }: HttpContextContract) {
            const { password, model } = await request.validate({
                  schema: this.v_token_wallet
            })

            try {
                  let find: any
                  let token: any
                  switch (model) {
                        case EModel.CUSTOMER:
                              find = await this.verify({ id: auth.use('customer').user!.id, model: EModel.CUSTOMER, password })
                              token = await auth.use('customer_wallet').generate(find, { expiresIn: '30 mins' })
                              break;

                        case EModel.AGENT:
                              find = await this.verify({ id: auth.use('agent').user!.id, model: EModel.AGENT, password })
                              token = await auth.use('agent_wallet').generate(find, { expiresIn: '30 mins' })
                              break;

                        default:
                              find = await this.verify({ id: auth.use('driver').user!.id, model: EModel.DRIVER, password })
                              token = await auth.use('driver_wallet').generate(find, { expiresIn: '30 mins' })
                              break;
                  }

                  response.created({ status: true, token })
            } catch (error) {
                  response.notFound({ status: false, message: error.message })
            }
      }

      public async account({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_wallet,
                  data: { model: request.param('model') }
            })

            try {
                  let find = await this.wallet.findWallet(payload.model, { key: 'id', value: auth.use().user!.id })
                  response.created({ status: true, data: find })
            } catch (error) {
                  response.notFound({ status: false, message: error.message })
            }
      }

      public async _updatePsswd({ request, response, auth }: HttpContextContract) {
            const { password, model, old_passsword } = await request.validate({
                  schema: this.v_psswd_wallet
            })
            try {
                  let find: any

                  switch (model) {
                        case EModel.CUSTOMER:
                              find = await this.verify({ id: auth.use('customer').user!.id, model: EModel.CUSTOMER, password: old_passsword })
                              break;

                        case EModel.AGENT:
                              find = await this.verify({ id: auth.use('agent').user!.id, model: EModel.AGENT, password: old_passsword })
                              break;

                        default:
                              find = await this.verify({ id: auth.use('driver').user!.id, model: EModel.DRIVER, password: old_passsword })
                              break;
                  }

                  const new_psswd = await Hash.make(password)
                  await this.wallet._updateWallet(model, find!.id, { password: new_psswd })

                  response.created({ status: true, message: 'Wallet password updated.' })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.notFound({ status: false, message: error.message })
            }
      }
}
