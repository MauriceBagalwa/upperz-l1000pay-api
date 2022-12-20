import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import Ride from './Ride'

export default class Commissiom extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'ride_id' })
  public rideId: string

  @column()
  public percentage: number
  @column()
  public amount: number

  @column()
  public currency: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Commissiom) {
    model.id = await generate.id()
  }

  @belongsTo(() => Ride, {})
  public ride: BelongsTo<typeof Ride>
}
