import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { EStausDriver } from 'App/Models/Driver'
import UserValidator from './UserValidator'

export default class DriverValidator extends UserValidator {
  constructor() { super() }

  public v_driver_create = schema.create({
    userId: schema.string.optional(),
    cardType: schema.enum(["Carte de l'electeur", 'Permis de conduire']),
    cardTypeId: schema.string([rules.unique({ table: 'drivers', column: 'card_type_id' })]),
    cardImage: schema.string([
      rules.url(),
      rules.unique({ table: 'drivers', column: 'card_image' }),
    ])
  })


  public v_driver_update_info = schema.create({
    cardType: schema.enum(["Carte de l'electeur", 'Permis de conduire']),
    cardTypeId: schema.string(),
    cardImage: schema.string([rules.url()]),
  })

  public v_driver_update = schema.create({
    name: schema.string([rules.minLength(2), rules.maxLength(30)]),
    lastname: schema.string([rules.minLength(2), rules.maxLength(30)]),
    email: schema.string({ trim: true }, [rules.email()]),
    country_code: schema.string([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phone_number: schema.string(),
  })

  public v_driver_status = schema.create({
    status: schema.enum(Object.values(EStausDriver))
  })

  public v_driver_location = schema.create({
    lat: schema.number(),
    lng: schema.number(),
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
