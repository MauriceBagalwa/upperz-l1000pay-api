import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { EModel } from 'App/Services/Wallet.service'

export default class WalletValidator {


  public schema = schema.create({})

  public v_cwallet = schema.create({
    id: schema.string([rules.uuid(), rules.exists({ table: 'customer_wallets', column: 'id' })])
  })

  public v_wallet = schema.create({
    model: schema.enum(Object.values(EModel))
  })
  
  public v_token_wallet = schema.create({
    password: schema.string(),
    model: schema.enum(Object.values(EModel))
  })

  public v_psswd_wallet = schema.create({
    old_passsword: schema.string(),
    password: schema.string([rules.confirmed()]),
    model: schema.enum(Object.values(EModel))
  })

  public v_dwallet = schema.create({
    id: schema.string([rules.uuid()])
  })


  public messages: CustomMessages = {}
}
