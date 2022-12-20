import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionValidator from 'App/Validators/PermissionValidator';
import SpecialPermiService from 'App/Services/Permission.service'
import { inject } from '@adonisjs/fold';
import RoleService from 'App/Services/Roles.service';
import Logger from '@ioc:Adonis/Core/Logger';
import type i from "interface"

@inject()
export default class SpecialPermissionsController extends PermissionValidator {
      constructor(private specialPermi: SpecialPermiService, private role: RoleService) {
            super()
      }

      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", userId } = request.qs()
                  const data = await this.specialPermi.getSpecialPermissions({ page, limit, orderBy, userId })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {

            const { permissions } = await request.validate({ schema: this.v_special_permission })
            try {
                  //2
                  const userId = request.param('userId', 'default')
                  //3
                  let current: string[] = ['init']
                  const filterPermission: i.ISpecialPermission[] = []
                  const oldLicense: i.ISpecialPermission[] = []
                  //4
                  let userRole = await this.role.findAssignRole({ key: 'userId', value: userId })
                  if (!userRole) return response.notFound({ status: false, message: 'User not Found or not assign a role.' })

                  //5
                  const find = await this.specialPermi.findAssignRole({ key: 'roleId', value: userRole.roleId })
                  const userPermission = await this.specialPermi.findSpecialPermission({ key: 'userId', value: userId })

                  //6
                  permissions.forEach((permission) => {
                        if (!current.includes(permission.permissionId)) {
                              if (!find.some((el) => el.permissionId === permission.permissionId)) {
                                    permission.userId = userId
                                    Logger.info(`Add Permission ${permission.permissionId}`)
                                    oldLicense.push(permission)
                                    if (!userPermission.some((el) => el.permissionId === permission.permissionId)) {
                                          filterPermission.push(permission)
                                    }
                              }
                        }
                        current.push(permission.permissionId)
                  })

                  //6
                  if (filterPermission.length) await this.specialPermi.assignSpecialPermi(filterPermission)
                  //7
                  userPermission.forEach(async (permission) => {
                        if (!permissions.some((el) => el.permissionId === permission.permissionId)) {
                              Logger.info(`Permission ${permission}`)
                              await this.specialPermi.deleteSPermission(permission.id)
                        }
                  })

                  response.created({
                        status: true,
                        message: 'Update special prmission for user.',
                  })

            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
}
