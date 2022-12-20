import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { ERole } from 'App/Models/Role'
import GeneralCaseValidator from './GeneralCaseValidator'

export default class RoleValidator extends GeneralCaseValidator {
  constructor() {
    super()
  }

  public v_create = schema.create({
    designation: schema.enum(Object.values(ERole)),
    description: schema.string.optional([rules.minLength(5), rules.maxLength(25)]),
  })

  public v_update = schema.create({
    id: schema.string([rules.uuid()]),
    designation: schema.enum(Object.values(ERole)),
    description: schema.string.optional([rules.minLength(5), rules.maxLength(50)]),
  })

  public v_assignUser_role = schema.create({
    roleId: schema.string([rules.uuid(), rules.exists({ table: 'roles', column: 'id' })]),
    userId: schema.string([
      rules.uuid(),
      rules.exists({ table: 'users', column: 'id' }),
      rules.unique({ table: 'user_roles', column: 'user_id' }),
    ]),
  })

  public v_updateUser_role = schema.create({
    roleId: schema.string([rules.uuid(), rules.exists({ table: 'roles', column: 'id' })]),
    id: schema.string.optional()
  })

  public messages: CustomMessages = {}
}
