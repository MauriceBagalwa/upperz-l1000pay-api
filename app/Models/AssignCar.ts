import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Car from './Car'
import Driver from './Driver'
import generate from "App/Utils/Generator"

export default class AssignCar extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'driver' })
  public driverId: string

  @column({ serializeAs: 'car' })
  public carId: string

  @column()
  public current: boolean

  @column.dateTime({ autoCreate: true })
  public startAssign: DateTime

  @column.dateTime()
  public endOfAssign: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Car)
  public car: BelongsTo<typeof Car>

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>

  @beforeSave()
  public static async generateId(model: AssignCar) {
    model.id = await generate.id()
  }

  // @afterCreate()
  // public static async infoToDriver(model: AssignCar) {
  /* Getting the driver and car id from the assign car table. */
  // const find = (await this.query()
  //   .where('id', model.id)
  //   .preload('car')
  //   .preload('driver', (pquery) => {
  //     pquery.preload('user')
  //   })
  //   .first()) as AssignCar

  /* Destructuring the data from the database. */
  // const { name, lastname, email } = find.driver.user
  // const { designation, number_plate } = find.car
  // const day = new Date()

  // /* Sending an email to the driver with the information of the car assigned to him. */
  // send.assignTaxi({
  //   to: email,
  //   data: { name, lastname, car: designation, plaque: number_plate, date: day.toDateString() },
  // })
  // }
}
