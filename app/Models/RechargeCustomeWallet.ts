import { DateTime } from 'luxon'
import { afterCreate, BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import WalletService, { EModel, ESign } from "App/Services/Wallet.service"
import CustomerWallet from './CustomerWallet'
import AgentWallet from './AgentWallet'

export default class RechargeCustomeWallet extends BaseModel {

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'agentWallet' })
  public agentWalletId: string

  @column({ serializeAs: 'customerWallet' })
  public customerWalletId: string

  @column()
  public amount: number

  @column()
  public devise: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: RechargeCustomeWallet) {
    model.id = await generate.id()
  }

  @afterCreate()
  public static async rechargeWallet(model: RechargeCustomeWallet) {

    await WalletService.Instance.agent_recahrgeWallet(EModel.AGENT, ESign.SOUTR,
      {
        walletId: model.agentWalletId, solde: model.amount
      })

    await WalletService.Instance.agent_recahrgeWallet(EModel.CUSTOMER, ESign.ADD,
      {
        walletId: model.customerWalletId, solde: model.amount
      })
  }

  @belongsTo(() => AgentWallet, {})
  public agentWallet: BelongsTo<typeof AgentWallet>

  @belongsTo(() => CustomerWallet, {})
  public customerWallet: BelongsTo<typeof CustomerWallet>
}
