import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoleValidator from 'App/Validators/RoleValidator';
import { inject } from '@adonisjs/fold';
import RoleService from 'App/Services/Roles.service'
import Logger from '@ioc:Adonis/Core/Logger';

@inject()
export default class UserRolesController extends RoleValidator {
      constructor(private userRole: RoleService) { super() }

      /**
       * It gets all the roles from the database
       * @param {HttpContextContract}  - page - The page number to be returned.
       */
      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at", role } = request.qs()
                  const data = await this.userRole.getUsersRole({ page, limit, orderBy, role })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async store({ request, response }: HttpContextContract) {
            const payload = await request.validate({ schema: this.v_assignUser_role })
            try {
                  const data = await this.userRole.assignUserRole(payload)
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      public async update({ request, response }: HttpContextContract) {
            // const { id } = await request.validate({ schema: this.v_delete, data: { id: request.param('id') } })
            const payload = await request.validate(
                  { schema: this.v_updateUser_role })
            try {
                  const id = request.param('id')
                  const find = await this.userRole.findAssignRole({ key: 'id', value: id })
                  if (!find)
                        return response.notFound({ status: false, message: 'Assign role not found.' })

                  payload.id = find.id
                  await this.userRole.updateAssignUserRole(payload)
                  response.created({ status: true, message: 'User role updated.' })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
}
