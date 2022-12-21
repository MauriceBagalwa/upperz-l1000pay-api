import { inject } from '@adonisjs/fold';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger';
import RideService, { modelDriver } from 'App/Services/Ride.service';
import DriverService from 'App/Services/Driver.service';
import RideValidator from 'App/Validators/RideValidator';
import { EStausDriver } from 'App/Models/Driver';
import { ETrough, IRideStatus } from 'App/Models/Ride';
import i from "interface"
import calcul from "App/Utils/Calculator"

@inject()
export default class RidesController extends RideValidator {
      constructor(private ride: RideService, private driver: DriverService) {
            super()
      }

      private statusRace = [
            IRideStatus.VALIDER,
            IRideStatus.DRIVER_ON_PLACE,
            IRideStatus.EN_COURS,
            IRideStatus.ARRIVER
      ]

      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", customerId, distanceSup, distanceInf, driverId, startDate, endDate, status, through } = request.qs()

                  const data = await this.ride.getAll({ page, limit, orderBy, customerId, distanceSup, distanceInf, driverId, startDate, endDate, status, through })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async customerRides({ request, response, auth }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", distanceSup, distanceInf, driverId, startDate, endDate, status, through } = request.qs()

                  const id = auth.use('customer').user!.id
                  const data = await this.ride.getAll({ page, limit, orderBy, customerId: id, distanceSup, distanceInf, driverId, startDate, endDate, status, through })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({ schema: this.v_create })
            try {
                  payload.customerId = auth.use('customer').user!.id
                  payload.through = ETrough.APP
                  const ride = await this.ride.registre(payload)


                  const drivers = await this.driver.findDrivers({
                        busy: EStausDriver.FREE,
                        limit: 30,
                        status: true
                  })

                  /* Creating an object with two properties, latitude and longitude. */
                  const iniLocation = {
                        latitude: payload.latDeparture,
                        longitude: payload.lngDeparture,
                  }

                  /* Creating an array of objects with latitude and longitude properties. */
                  const driversLocation: i.ICLocation[] = []
                  const driverOrder: modelDriver[] = []

                  /* Iterating through the drivers array and pushing the latitude and longitude
                   of each driver into the driversLocation array.
                  */
                  drivers.forEach((dataIndex) => {
                        if (dataIndex.lat && dataIndex.lng
                              && dataIndex.assignedCar.length
                        )
                              driversLocation.push({
                                    latitude: dataIndex.lat,
                                    longitude: dataIndex.lng,
                              })
                  })

                  /* Getting the distance between the user and the drivers. */
                  const distances: any[] = await calcul.getCoorListByDistance(iniLocation, driversLocation)


                  /* Looping through the distances array and then looping through the drivers array. If the
                 driver's lat and lng match the order's lat and lng, then it pushes the driver to the
                 driverOrder array.
                 */
                  distances.forEach((oder) => {
                        for (let i = 0; i < drivers.length; i++) {
                              if (drivers[i].lat === oder.latitude && drivers[i].lng === oder.longitude) {
                                    // console.log('Driver:' + drivers[i].driver.lat + ' = ' + oder.latitude)
                                    driverOrder.push(drivers[i])
                                    break
                              }
                        }
                  })

                  response.ok({ status: true, data: { ride, drivers: driverOrder }, })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async selectdriver({ request, response, auth }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_param,
                  data: { id: request.param('id') },
            })

            const { driverId } = await request.validate({
                  schema: this.v_select_driver,
            })

            try {
                  const rideFind = await this.ride.findForSelectDriver({ key: 'id', value: payload.id as string })
                  if (!rideFind)
                        return response.notFound({
                              status: false,
                              message: 'Aucune course trouver pour la selection du chauffeur.',
                        })
                  //2
                  const { id } = auth.use('customer').user!
                  if (rideFind.customerId !== id) return response.unauthorized()
                  //3
                  const findDriver = await this.driver.findForRide({ key: 'id', value: driverId as string })
                  if (!findDriver!.user && findDriver?.assignedCar.length) {

                        return response.notFound({
                              status: false,
                              message: 'Le chauffeur est hors service.',
                        })
                  }
                  // 4
                  const data = await this.ride.update(payload.id as string, {
                        driver_id: driverId as string,
                        status: IRideStatus.EN_ATTENTE,
                  })

                  rideFind.status = IRideStatus.EN_ATTENTE
                  response.created({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async driverRides({ request, response, auth }: HttpContextContract) {
            try {
                  const { page = 1, limit = 10, status, startDate, endDate } = request.qs()
                  const data = await this.ride.driverRaces(auth.use('driver').user!.id, {
                        page,
                        limit,
                        status,
                        startDate,
                        endDate,
                  })

                  response.ok({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async responseDriver({ request, response, auth }: HttpContextContract) {
            //1
            const { status } = await request.validate({
                  schema: this.v_driver_response,
            })

            try {
                  const id = request.param('id')
                  const raceFind = await this.ride.rideForResponse({ key: 'id', value: id })
                  if (!raceFind)
                        return response.notFound({
                              status: false,
                              message: 'Aucune course trouver.',
                        })
                  //2
                  const driverId = auth.use('driver').user!.id
                  if (raceFind.driverId !== driverId)
                        return response.unauthorized({
                              status: false,
                              message: 'Unauthorized access.',
                        })
                  //3
                  const findDriver = await this.driver.findForRide({ key: 'id', value: driverId as string })
                  if (!findDriver!.user && findDriver?.assignedCar.length) {
                        return response.notFound({
                              status: false,
                              message: 'Le chauffeur est hors service.',
                        })
                  }
                  // 4
                  const update = status
                        ? { status: IRideStatus.VALIDER }
                        : { status: IRideStatus.REJETER, driverId: null }
                  await this.ride.update(id, update)

                  response.created({
                        status: true,
                        message: 'Driver send response.',
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async updateStatus({ request, response, auth }: HttpContextContract) {

            try {
                  // verify race if exists and race status is in statusRace array
                  const id = request.param('id')
                  let raceFind = await this.ride.find({ key: 'id', value: id })
                  if (!raceFind || !this.statusRace.some((el) => el === raceFind?.status))
                        return response.notFound({
                              status: false,
                              message: 'Aucune course trouver.',
                        })

                  if (raceFind.driverId !== auth.use('driver').user!.id) {
                        return response.unauthorized({
                              status: false,
                              message: 'Unauthorized access',
                        })
                  }

                  // find the next status value of race
                  let update: object

                  for (let i = 0; i < this.statusRace.length; i++) {
                        if (this.statusRace[i] === raceFind.status && i + 1 < this.statusRace.length) {
                              // Test next status race to determine the update object
                              switch (this.statusRace[i + 1]) {
                                    case IRideStatus.EN_COURS:
                                          update = {
                                                status: this.statusRace[i + 1],
                                                departure_time: new Date(),
                                          }
                                          break
                                    case IRideStatus.ARRIVER:
                                          const arrival_time = new Date()
                                          update = {
                                                status: this.statusRace[i + 1],
                                                arrival_time,
                                          }
                                          break
                                    default:
                                          update = {
                                                status: this.statusRace[i + 1],
                                          }
                                          break
                              }

                              raceFind = await this.ride.update(id, update)
                              break
                        }
                  }

                  response.ok({
                        status: true,
                        data: raceFind
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async amount({ request, response, auth }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_amount_ride
            })
            try {
                  // verify race if exists and race status is in statusRace array
                  const id = request.param('id')
                  let raceFind = await this.ride.find({ key: 'id', value: id })
                  if (!raceFind || raceFind?.status !== IRideStatus.ARRIVER)
                        return response.notFound({
                              status: false,
                              message: 'Aucune course trouver.',
                        })

                  if (raceFind.driverId !== auth.use('driver').user!.id) {
                        return response.unauthorized({
                              status: false,
                              message: 'Unauthorized access',
                        })
                  }

                  if (payload.amount < 500) {
                        return response.badRequest({
                              status: false,
                              message: 'Valeur incorrect.',
                        })
                  }

                  // find the next status value of race
                  const update = {
                        amount: payload.amount,
                        status: IRideStatus.EN_ATTENTE_PAIEMNT
                  }

                  const data = await this.ride.update(id, update)
                  response.created({
                        status: true,
                        data
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }


}
