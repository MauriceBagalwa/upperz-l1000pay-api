// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import PaymentService from "App/Services/Payment.service";
import RideService from "App/Services/Ride.service";
import PaymentValidator from "App/Validators/PaymentValidator";
import { IRideStatus } from 'App/Models/Ride';
import { inject } from "@adonisjs/fold";
import WalletService, { EModel } from "App/Services/Wallet.service";
import Hash from "@ioc:Adonis/Core/Hash";

@inject()
export default class PaymentsController extends PaymentValidator {
      constructor(private payment: PaymentService, private ride: RideService, private wallet: WalletService) {
            super()
      }

      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", customerId, driverId, startDate, endDate } = request.qs()
                  const data = await this.payment.getAll({ page, limit, orderBy, customerId, driverId, startDate, endDate })

                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_create
            })
            try {
                  //1
                  const rideFind = await this.ride.find({ key: 'id', value: payload.ride_id, })
                  if (rideFind?.status !== IRideStatus.EN_ATTENTE_PAIEMNT) return response.notFound({ status: false, message: 'Ride not found.' })

                  //2
                  const findWallet = await this.wallet.findWallet(EModel.CUSTOMER, { key: 'customer_id', value: rideFind.customerId })
                  if (!findWallet) return response.notFound({ status: false, message: 'Wallet not Found.' })

                  //3
                  if (!(await Hash.verify(findWallet.password, payload.password))) {
                        throw new Error('Identifiants inccorect')
                  }

                  if (findWallet.solde < rideFind.amount) {
                        return response.notFound({ status: false, message: `Echec de l'operation, Solde inferieure.` })
                  }

                  await this.wallet.customerPay({ walletId: findWallet.customerId, amount: rideFind.amount })
                  const data = await this.payment.registre({ ride_id: payload.ride_id, amount: rideFind?.amount as number })
                  return response.ok({ status: true, data, ride: rideFind })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async rideCartePayment({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_generate_ride
            })
            try {
                  //1
                  const driver = auth.use('driver').user!

                  // if (!driver?.user.status)
                  //       return response.unauthorized({ status: false, messag: 'Unauthorized access.' })
                  //1
                  const ride = {
                        "placeDeparture": "-",
                        "descriptionPlaceDeparture": "-",
                        "latDeparture": 0,
                        "lngDeparture": 0,
                        "placeArrival": "-",
                        "descriptionPlaceArrival": "-",
                        "latArrival": 0,
                        "lngArrival": 0
                  }

                  const rideGenerate = await this.ride.registre(ride)
                  const data = await this.ride.update(rideGenerate.id, {
                        driver_id: driver.id as string,
                        status: IRideStatus.EN_ATTENTE_PAIEMNT,
                        amount: payload.amount
                  })

                  return response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
      public async cartePayment({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_carte
            })
            try {
                  //1
                  const rideFind = await this.ride.find({ key: 'id', value: payload.ride_id, })
                  if (rideFind?.status !== IRideStatus.EN_ATTENTE_PAIEMNT) return response.notFound({ status: false, message: 'Ride not found.' })
                  //2
                  const findWallet = await this.wallet.findWallet(EModel.CUSTOMER, { key: 'number_wallet', value: payload.number_wallet })
                  if (!findWallet) return response.notFound({ status: false, message: 'Wallet not Found.' })

                  //3
                  if (!(await Hash.verify(findWallet.password, payload.password))) {
                        throw new Error('Identifiants inccorect')
                  }
                  //4
                  if (findWallet.solde < rideFind.amount) {
                        return response.notFound({ status: false, message: `Echec de l'operation, Solde inferieure.` })
                  }
                  //5
                  await this.wallet.customerPay({ walletId: findWallet.customerId, amount: rideFind.amount })
                  const data = await this.payment.registre({ ride_id: payload.ride_id, amount: rideFind?.amount as number })

                  return response.ok({ status: true, data, ride: rideFind })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * Commisions
       */
      public async indexCommision({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", customerId, driverId, startDate, endDate } = request.qs()
                  const data = await this.payment.comissions({ page, limit, orderBy, customerId, driverId, startDate, endDate })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

}
