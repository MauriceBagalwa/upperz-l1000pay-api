import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { ICarStatus, TYPEOWNER } from 'App/Models/Car'
import GeneralCaseValidator from './GeneralCaseValidator'

export default class CarValidator extends GeneralCaseValidator {
  // constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({})
  public v_status = schema.create({
    status: schema.enum.optional(Object.values(ICarStatus)),
  })

  public v_create = schema.create({
    designation: schema.string([rules.minLength(3)]),
    numberPlate: schema.string([
      rules.minLength(3),
      rules.unique({ table: 'cars', column: 'number_plate' }),
    ]),
    mark: schema.string([rules.minLength(3)]),
    chassiNumber: schema.string([rules.unique({ table: 'cars', column: 'chassi_number' }), rules.minLength(10), rules.maxLength(25)]),
    places: schema.number(),
    comment: schema.string([rules.minLength(5), rules.maxLength(300)]),
    owner: schema.enum(Object.values(TYPEOWNER)),
  })


  public v_update = schema.create({
    designation: schema.string([rules.minLength(3)]),
    numberPlate: schema.string([rules.minLength(3)]),
    mark: schema.string([rules.minLength(3)]),
    chassiNumber: schema.string([rules.minLength(10), rules.maxLength(25)]),
    places: schema.number(),
    comment: schema.string([rules.minLength(5), rules.maxLength(300)]),
    owner: schema.enum(Object.values(TYPEOWNER)),
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
