import { afterSave, BaseModel, beforeSave, belongsTo, BelongsTo, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import wallet from "App/Services/Wallet.service"
import generate from "App/Utils/Generator"
import DriverWallet from './DriverWallet'
import { DateTime } from 'luxon'
import i from "interface"
import User from './User'
import AssignCar from './AssignCar'

export enum EStausDriver {
  FREE = 'free',
  OCUPPER = 'busy',
}

export default class Driver extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'user' })
  public userId: string

  @column({ serializeAs: 'cardType' })
  public cardType: string

  @column({ serializeAs: 'cardTypeId' })
  public cardTypeId: string

  @column({ serializeAs: 'cardImage' })
  public cardImage: string

  @column()
  public status: EStausDriver

  @column()
  public lat: number

  @column()
  public lng: number

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @beforeSave()
  public static async generateId(model: Driver) {
    model.id = await generate.id()
  }

  @afterSave()
  public static async createWallet(model: Driver) {
    const data: i.IDriverWallet = {
      driverId: model.id,
      numberWallet: `${generate.number(12)}`
      // numberWallet: `abcdef`
    }
    await wallet.Instance.d_registreWallet(data)
  }

  @belongsTo(() => User, {})
  public user: BelongsTo<typeof User>

  @hasOne(() => DriverWallet)
  public wallet: HasOne<typeof DriverWallet>

  @hasMany(() => AssignCar, {})
  public assignedCar: HasMany<typeof AssignCar>
}
