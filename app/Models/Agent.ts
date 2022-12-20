import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne, HasOne, belongsTo, BelongsTo, afterSave } from '@ioc:Adonis/Lucid/Orm'
import i from "interface"
import generate from "App/Utils/Generator"
import AgentWallet from './AgentWallet'
import User from './User'
import wallet from "App/Services/Wallet.service"

export default class Agent extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'user' })
  public userId: string

  @column({ serializeAs: 'officeAddress' })
  public officeAddress: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Agent) {
    model.id = await generate.id()
  }

  @afterSave()
  public static async createWallet(model: Agent) {
    const data: i.IAgentWallet = {
      agentId: model.id,
      numberWallet: `${generate.number(12)}`
      // numberWallet: `abcdef`
    }
    await wallet.Instance.agent_registreWallet(data)
  }

  @belongsTo(() => User, {})
  public user: BelongsTo<typeof User>

  @hasOne(() => AgentWallet)
  public wallet: HasOne<typeof AgentWallet>
}
