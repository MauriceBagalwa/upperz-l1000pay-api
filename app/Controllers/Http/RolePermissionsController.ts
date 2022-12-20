import RolePermissionValidator from 'App/Validators/RolePermissionValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RolePermmission from "App/Services/Permission.service"
import { inject } from '@adonisjs/fold';
import Logger from '@ioc:Adonis/Core/Logger'
import type i from "interface"

@inject()
export default class RolePermissionsController extends RolePermissionValidator {
      constructor(private permission: RolePermmission) {
            super()
      }

      /**
       * This function is used to get all the permissions of a role.
       * @param {HttpContextContract}  - page - The page number to be returned.
       */
      public async index({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_querry_role,
                  data: {
                        roleId: request.input('roleId')
                  }
            })
            try {
                  const { page = 1, limit = 100, orderBy = "created_at" } = request.qs()
                  const data = await this.permission.getAllRolePermi({ page, limit, orderBy, roleId: payload.roleId })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
      /**
       * 1. Validate the request payload using the schema defined in the `v_assign_role` property.
       * 2. Call the `assignToRole` method of the `Permission` model and pass the validated payload
       * @param {HttpContextContract}  - 1. The payload is the data that is sent to the server.
       * @returns 1. The payload is being validated against the schema.
       * 2. The result is being returned.
       */

      public async store({ request, response }: HttpContextContract) {
            //1
            const { roleId } = await request.validate({
                  schema: this.v_querry_role,
                  data: { roleId: request.param('roleId') },
            })

            const payload = await request.validate({
                  schema: this.v_assign_role,
            })

            try {
                  //2
                  payload.rolePermissions.map((permission) => {
                        permission.roleId = roleId
                  })

                  const result = await this.permission.assignToRole(payload.rolePermissions)
                  response.ok({ status: true, data: result, message: 'Role assign Permission.' })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * 1. Validate the roleId and the rolePermissions.
       * 2. Create an array of precedent permissionIds.
       * 3. Find all the permissions assigned to the role.
       * 4. Loop through the rolePermissions and check if the permissionId is not in the precedent
       * array and if the permissionId is not in the find array. If it is not, then add the
       * permissionId to the filterPermission array.
       * 5. If the filterPermission array has any elements, then assign the permissions to the role.
       * 6. Loop through the find array and check if the permissionId is not in the rolePermissions
       * array. If it is not, then delete the permission from the role
       * @param {HttpContextContract}  - 1. We validate the roleId parameter.
       * @returns 1. The roleId is being validated.
       * 2. The precedent variable is being initialized.
       * 3. The find variable is being assigned the result of the findAssignRole method.
       * 4. The rolePermissions array is being iterated over.
       * 5. If the filterPermission array has a length, the assignToRole method is being called.
       * 6. The
       */
      public async update({ request, response }: HttpContextContract) {
            //1
            const { roleId } = await request.validate({
                  schema: this.v_roleId,
                  data: { roleId: request.param('roleId') },
            })
            const { rolePermissions } = await request.validate({
                  schema: this.v_update_assign_role,
            })

            try {
                  //2
                  let precedent: string[] = ['init']
                  const filterPermission: i.IRolePermission[] = []
                  //3
                  const find = await this.permission.findAssignRole({ key: "role_id", value: roleId })

                  //4
                  rolePermissions.forEach((permission) => {
                        if (!precedent.includes(permission.permissionId)) {
                              if (!find.some((el) => el.permissionId === permission.permissionId)) {
                                    permission.roleId = roleId
                                    filterPermission.push(permission as i.IRolePermission)
                              }
                        }
                        precedent.push(permission.permissionId)
                  })

                  //5
                  if (filterPermission.length) await this.permission.assignToRole(filterPermission)
                  //6
                  find.forEach(async (permission) => {
                        if (!rolePermissions.some((el) => el.permissionId === permission.permissionId)) {
                              await this.permission.deleteRolePermission(permission.id)
                        }
                  })

                  response.ok({
                        status: true,
                        message: "Role permission update.",
                  })
            } catch (error) {
                  Logger.error(error)
                  return response.expectationFailed({ status: false, message: error.message })
            }
      }
}
