import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import GeneralCaseValidator from './GeneralCaseValidator'

export default class RolePermissionValidator extends GeneralCaseValidator {
  constructor() { super() }

  /* Creating a schema for the validation of the assign role. */
  public v_assign_role = schema.create({
    rolePermissions: schema.array().members(
      schema.object().members({
        roleId: schema.string.optional([rules.uuid(), rules.exists({ table: 'roles', column: 'id' })]),
        permissionId: schema.string([
          rules.uuid(),
          rules.exists({ table: 'permissions', column: 'id' }),
        ]),
      })
    ),
  })

  /* Validating the update of the role permission. */
  public v_update_assign_role = schema.create({
    rolePermissions: schema.array().members(
      schema.object().members({
        roleId: schema.string.optional([
          rules.uuid(),
          rules.exists({ table: 'roles', column: 'id' }),
        ]),
        permissionId: schema.string([
          rules.uuid(),
          rules.exists({ table: 'permissions', column: 'id' }),
        ]),
      })
    ),
  })

  /* Validating the roleId. */
  public v_querry_role = schema.create({
    roleId: schema.string.optional([
      rules.uuid(),
      rules.exists({ table: 'roles', column: 'id' }),
    ]),
  })

  /* Validating the roleId. */
  public v_roleId = schema.create({
    roleId: schema.string([
      rules.uuid(),
      rules.exists({ table: 'role_permissions', column: 'role_id' }),
    ]),
  })


  public messages: CustomMessages = {}
}
