import { DateTime } from 'luxon'
import { afterCreate, BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import User from './User'
import AgentWallet from './AgentWallet'
import WalletService, { EModel, ESign } from "App/Services/Wallet.service"

export default class RechargeAgentWallet extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'user' })
  public userId: string

  @column({ serializeAs: 'wallet' })
  public agentWalletId: string

  @column()
  public amount: number

  @column()
  public devise: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @beforeSave()
  public static async generateId(model: RechargeAgentWallet) {
    model.id = await generate.id()
  }

  @afterCreate()
  public static async rechargeWallet(model: RechargeAgentWallet) {
    await WalletService.Instance.agent_recahrgeWallet(EModel.AGENT, ESign.ADD,
      {
        walletId: model.agentWalletId, solde: model.amount
      })
  }

  @belongsTo(() => User, {})
  public user: BelongsTo<typeof User>

  @belongsTo(() => AgentWallet, {})
  public wallet: BelongsTo<typeof AgentWallet>
}
