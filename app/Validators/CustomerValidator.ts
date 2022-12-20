import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import GeneralCaseValidator from './GeneralCaseValidator'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CustomerValidator extends GeneralCaseValidator {
  constructor() {
    super()
  }

  public schema = schema.create({})
  public v_create = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    lastname: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'customers', column: 'email' }),
    ]),
    countryCode: schema.string([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phoneNumber: schema.string({}, [
      rules.unique({ table: 'customers', column: 'phone_number' }),
    ]),
    password: schema.string([rules.minLength(4)]),
    profile: schema.string.optional([rules.url()]),
  })

  public v_update = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    lastname: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),
    email: schema.string({ trim: true }, [rules.email()]),
    adresse: schema.string.optional([rules.minLength(7)]),
    countryCode: schema.string([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phoneNumber: schema.string(),
  })

  /* A validation for the login route. */
  public v_signin = schema.create({
    countryCode: schema.string.optional([rules.regex(/^(\+?\d{1,3}|\d{1,4})$/)]),
    phoneNumber: schema.string.optional(),
    email: schema.string.optional([rules.email()]),
    password: schema.string(),
  })

  /* Validating the password. */
  public changePassword = schema.create({
    oldPassword: schema.string(),
    newPassword: schema.string([rules.minLength(4), rules.confirmed()]),
  })

  /* Validating the file extension and the size of the file. */
  public profileValidator = schema.create({
    profile: schema.file({
      extnames: ['jpg', 'png', 'gif', 'jpeg'],
      size: '2mb',
    }),
  })

  public v_delete = schema.create({
    id: schema.string([rules.uuid()])
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
