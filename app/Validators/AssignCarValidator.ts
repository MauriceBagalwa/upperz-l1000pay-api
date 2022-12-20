import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import GeneralCaseValidator from './GeneralCaseValidator'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignCarValidator extends GeneralCaseValidator {
  // constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({})

  public v_create = schema.create({
    driverId: schema.string([rules.uuid()]),
    carId: schema.string([rules.uuid()]),
  })

  public messages: CustomMessages = {}
}
