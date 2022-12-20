import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class PaymentValidator {
  // constructor(protected ctx: HttpContextContract) { }

  public v_create = schema.create({
    ride_id: schema.string([rules.uuid(), rules.exists({ table: 'rides', column: 'id' })]),
    password: schema.string(),
  })
  public v_generate_ride = schema.create({
    amount: schema.number()
  })

  public v_carte = schema.create({
    ride_id: schema.string([rules.uuid(), rules.exists({ table: 'rides', column: 'id' })]),
    number_wallet: schema.string([rules.exists({ table: 'customer_wallets', column: 'number_wallet' })]),
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
