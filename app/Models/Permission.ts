import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"

/* Creating a list of permissions that can be used in the application. */
export enum EPermission {
  CREATE = 'create',
  READ = 'read',
  EDIT = 'edit',
  DELETE = 'delete',
  MANAGE = 'manage',
}

/* A list of all the modules that can be used in the application. */
export enum EModule {
  USER = 'users',
  DRIVER = 'drivers',
  CAR = 'cars',
  RIDE = 'ride',
  CHARGING_AGENT = 'agent',
}


export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public designation: string

  @column()
  public description: string | null

  @column()
  public module: EModule

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Permission) {
    model.id = await generate.id()
  }
}
