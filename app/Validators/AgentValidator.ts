import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import UserValidator from './UserValidator'

export default class AgentWalletValidator extends UserValidator {
  constructor() {
    super()
  }

  public v_agent_create = schema.create({
    userId: schema.string.optional(),
    officeAddress: schema.string([rules.minLength(10), rules.maxLength(50)]),
    description: schema.string([rules.minLength(10), rules.maxLength(200)]),
  })

  public v_agent_update = schema.create({
    officeAddress: schema.string([rules.minLength(10), rules.maxLength(50)]),
    description: schema.string([rules.minLength(10), rules.maxLength(200)]),
  })

  public v_token_trans = schema.create({
    wallet_number: schema.string([rules.exists({ table: 'customer_wallets', column: 'number_wallet' })]),
    amount: schema.number([rules.range(1000, 100000)]),
    password: schema.string(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
