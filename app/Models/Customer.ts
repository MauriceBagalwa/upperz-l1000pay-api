import { DateTime } from 'luxon'
import { afterSave, BaseModel, beforeSave, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import wallet from "App/Services/Wallet.service"
import i from "interface"
import generate from "App/Utils/Generator"
import Hash from '@ioc:Adonis/Core/Hash'
import CustomerWallet from './CustomerWallet'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public lastname: string

  @column({ serializeAs: 'countryCode' })
  public countryCode: string

  @column({ serializeAs: 'phoneNumber' })
  public phoneNumber: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public profile: string

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Customer) {
    model.id = await generate.id()
    if (model.$dirty.password) {
      model.password = await Hash.make(model.password)
    }
  }

  @afterSave()
  public static async createWallet(model: Customer) {
    const data: i.ICustomerWallet = {
      customerId: model.id,
      numberWallet: `${generate.number(12)}`
    }
    await wallet.Instance.registreWallet(data)
  }

  @hasOne(() => CustomerWallet)
  public wallet: HasOne<typeof CustomerWallet>
}
