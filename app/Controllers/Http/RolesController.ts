
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoleValidator from "App/Validators/RoleValidator";
import { inject } from '@adonisjs/fold';
import RoleService from 'App/Services/Roles.service';
import Logger from '@ioc:Adonis/Core/Logger';

@inject()
export default class RolesController extends RoleValidator {
      constructor(private role: RoleService) {
            super()
      }

      /**
       * It gets all the roles from the database
       * @param {HttpContextContract}  - page - The page number to be returned.
       */
      public async index({ request, response }: HttpContextContract) {
            try {
                  const { page = 1, limit = 100, orderBy = "created_at" } = request.qs()
                  const data = await this.role.getAll({ page, limit, orderBy })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * 1. Validate the request body using the schema defined in the `v_create` variable.
       * 2. Check if the role already exists.
       * 3. If the role doesn't exist, create it
       * @param {HttpContextContract}  - 1. The payload is the data that is sent to the server.
       * @returns 1. The payload is being validated against the schema.
       * 2. If the role already exists, a conflict response is returned.
       * 3. If the role does not exist, the role is created and a created response is returned.
       */
      public async store({ request, response }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_create,
                  data: request.body()
            })

            try {
                  //2
                  if (await this.role.find({ key: "designation", value: payload.designation.toLocaleLowerCase() }))
                        return response.conflict({ status: false, message: 'Role already exists.' })
                  //3
                  const result = await this.role.registre(payload)
                  response.created({ ststus: true, data: result })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * 1. Validate the request data, 
       * 2. Check if the role exists, 
       * 3. Update the role
       * @param {HttpContextContract}  - 1. The payload is the data that is sent to the server.
       * @returns 1. The payload is being returned.
       * 2. The data is being returned.
       * 3. The response is being returned.
       */
      public async update({ request, response }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_update,
                  data: {
                        id: request.param('id'),
                        designation: request.input('designation'),
                        description: request.input('description'),
                  }
            })

            try {
                  //2
                  if (!await this.role.find({ key: "id", value: payload.id }))
                        return response.notFound({ status: false, message: 'Role not Found.' })
                  //3
                  const data = await this.role.update({ id: payload.id, input: { designation: payload.designation, description: payload.description } })
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }


      /**
       * 1. Validate the request payload, 
       * 2. Check if the role exists, 
       * 3. Delete the role
       * @param {HttpContextContract}  - 1 - Validate the request data.
       * @returns 1. The payload is being validated against the schema.
       * 2. If the role is not found, a 404 is returned.
       * 3. If the role is found, it is deleted and a 200 is returned.
       */
      public async destroy({ request, response }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_delete,
                  data: {
                        id: request.param('id')
                  }
            })
            try {
                  //2
                  if (!await this.role.find({ key: 'id', value: payload.id }))
                        return response.notFound({ status: false, message: 'Role not Found.' })
                  //3
                  await this.role.destroy(payload.id)
                  return response.ok({ status: true, message: 'Role deleted.' })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

}
