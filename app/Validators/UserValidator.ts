import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import GeneralCaseValidator from './GeneralCaseValidator'

export default class UserValidator extends GeneralCaseValidator {
  constructor() { super() }

  public schema = schema.create({})

  public v_create = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    lastname: schema.string({}, [rules.minLength(2), rules.maxLength(30)]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email ' }),
    ]),
    countryCode: schema.string([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phoneNumber: schema.string([rules.unique({ table: 'users', column: 'phone_number' })]),
    profile: schema.string.optional([rules.url()]),
  })

  /* A validation for the update route. */
  public v_update = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    lastname: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    email: schema.string({ trim: true }, [rules.email()]),
    countryCode: schema.string([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phoneNumber: schema.string(),
  })

  /* Transaction wallet Agent. */
  public v_transation = schema.create({
    // numberWallet: schema.string({}, [rules.exists({ table: 'agent_wallets', column: 'number_wallet' })]),
    numberWallet: schema.string(),
    amount: schema.number([rules.range(10000, 999999999)])
  })

  public v_w_customer_transation = schema.create({
    // numberWallet: schema.string({}, [rules.exists({ table: 'agent_wallets', column: 'number_wallet' })]),
    numberWallet: schema.string(),
    amount: schema.number([rules.range(1000, 999999999)])
  })


  public messages: CustomMessages = {}
}
