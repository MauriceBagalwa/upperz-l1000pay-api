import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AgentTran extends BaseModel {
  @column()
  public id: string

  @column()
  public customer: {
    id: string,
    numberWallet: string,
    customer: {
      id: string,
      name: string,
      lastname: string,
      profile: string,
    }
  }

  @column()
  public amount: number
  @column({ serializeAs: null })
  public password: string

}
