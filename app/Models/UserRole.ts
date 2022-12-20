import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import { DateTime } from 'luxon'
import Role from './Role'
import User from './User'

export default class UserRole extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'user' })
  public userId: string

  @column({ serializeAs: 'role' })
  public roleId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: UserRole) {
    model.id = await generate.id()
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
