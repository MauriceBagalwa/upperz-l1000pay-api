import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import Driver from './Driver'
import generate from "App/Utils/Generator"
import calcul from "App/Utils/Calculator"


export enum IRideStatus {
  DEMANDE = 'Demande',
  EN_ATTENTE = 'En attente',
  EN_ATTENTE_PAIEMNT = 'En attente du paiement',
  VALIDER = 'Valider',
  REJETER = 'Rejeter',
  DRIVER_ON_PLACE = 'Chauffeur au lieu de depart',
  EN_COURS = 'En cours',
  ARRIVER = 'Arriver',
  TERMINER = 'Términer'
}
export enum ETrough {
  APP = 'app',
  CARD = 'card'
}

export default class Ride extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'customer' })
  public customerId: string

  @column()
  public placeDeparture: string

  @column()
  public descriptionPlaceDeparture: string

  @column()
  public latDeparture: number

  @column()
  public lngDeparture: number

  @column()
  public placeArrival: string

  @column()
  public descriptionPlaceArrival: string

  @column()
  public latArrival: number

  @column()
  public lngArrival: number

  @column()
  public distance: number

  @column()
  public unite: string

  @column()
  public through: string

  @column({ serializeAs: 'driver' })
  public driverId: string

  @column.dateTime()
  public departure_time: DateTime

  @column.dateTime()
  public arrival_time: DateTime

  @column()
  public status: IRideStatus

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @beforeSave()
  public static async generateId(model: Ride) {
    model.id = await generate.id()
    model.unite = "km"
    const distance = await calcul.getDistance({
      lat_departure: model.latDeparture,
      lng_departure: model.lngDeparture,
      lng: model.lngArrival,
      lat: model.latArrival,
    })
    model.distance = distance
  }
}
