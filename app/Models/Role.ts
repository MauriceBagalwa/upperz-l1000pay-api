import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import RolePermission from './RolePermission'
import Permission from './Permission'

export enum ERole {
  USER = 'user',
  DRIVER = 'driver',
  CHARGING_AGENT = 'agent de recharge',
  ADMIN = 'admin',
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public designation: string

  @column()
  public description: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Role) {
    model.id = await generate.id()
  }

  @hasMany(() => RolePermission, {})
  public roleId: HasMany<typeof RolePermission>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  public permissions: ManyToMany<typeof Permission>
}
