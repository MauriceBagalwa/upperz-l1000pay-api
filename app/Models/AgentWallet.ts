import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import Agent from './Agent'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AgentWallet extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'numberWallet' })
  public numberWallet: string

  @column({ serializeAs: 'agent' })
  public agentId: string

  @column()
  public solde: number

  @column({ serializeAs: null })
  public password: string

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: AgentWallet) {
    model.id = await generate.id()
    model.password = await Hash.make("0000")
  }

  @belongsTo(() => Agent, {})
  public agent: BelongsTo<typeof Agent>

}
