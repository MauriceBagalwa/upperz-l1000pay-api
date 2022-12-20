import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import AssignCar from './AssignCar'

export enum ICarStatus {
  OPERATIONNEL = 'opérationnel',
  GARAGE = 'garage',
  NON_OPERATIONNEL = 'non opérationnel',
}

export enum TYPEOWNER {
  ENTREPRISE = 'entreprise',
  PERSONNEL = 'personnel',
}

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public designation: string

  @column()
  public mark: string

  @column({ serializeAs: 'numberPlate' })
  public numberPlate: string

  @column({ serializeAs: 'chassiNumber' })
  public chassiNumber: string

  @column()
  public places: number

  @column()
  public comment: string

  @column()
  public owner: TYPEOWNER

  @column()
  public status: ICarStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Car) {
    model.id = await generate.id()
  }

  @hasOne(() => AssignCar, {
    foreignKey: 'carId',
  })
  public customer: HasOne<typeof AssignCar>
}
