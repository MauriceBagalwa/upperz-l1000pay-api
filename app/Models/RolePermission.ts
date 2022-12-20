import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import Role from './Role'
import Permission from './Permission'
// import Permission from './Permission'
// import Role from './Role'

export default class RolePermission extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'role' })
  public roleId: string

  @column({ serializeAs: 'permission' })
  public permissionId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: RolePermission) {
    model.id = await generate.id()
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>
}
