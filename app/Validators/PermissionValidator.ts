import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { EModule, EPermission } from 'App/Models/Permission'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PermissionValidator {
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
  /* Validating the data that is being sent to the server. */
  public v_create = schema.create({
    permission: schema.enum(Object.values(EPermission)),
    module: schema.enum(Object.values(EModule)),
    description: schema.string.optional([rules.minLength(5), rules.maxLength(50)]),
  })

  public v_update = schema.create({
    id: schema.string([rules.uuid(), rules.exists({ table: 'permissions', column: 'id' })]),
    description: schema.string({ trim: true }, [rules.minLength(5), rules.maxLength(50)]),
  })

  public v_delete = schema.create({
    id: schema.string([rules.uuid()])
  })

  public v_module = schema.create({
    module: schema.enum.optional(Object.values(EModule)),
  })

  public v_special_permission = schema.create({
    permissions: schema.array().members(
      schema.object().members({
        permissionId: schema.string([
          rules.uuid(),
          rules.exists({ table: 'permissions', column: 'id' }),
        ]),
        userId: schema.string.optional([
          rules.uuid(),
          rules.exists({ table: 'users', column: 'id' }),
        ]),
      })
    ),
  })
  /**
   * - Assign Special Permission
   */

  public messages: CustomMessages = {}
}
