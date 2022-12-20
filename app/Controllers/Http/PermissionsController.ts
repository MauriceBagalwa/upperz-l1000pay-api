import Logger from '@ioc:Adonis/Core/Logger';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionValidator from "App/Validators/PermissionValidator";
import PSerivce from "App/Services/Permission.service"
import { inject } from '@adonisjs/fold';

@inject()
export default class PermissionsController extends PermissionValidator {
      constructor(private permission: PSerivce) {
            super()
      }

      /**
       * A function that returns all permissions in the database.
       * @param {HttpContextContract}  - page = 1, limit = 100, orderBy = "id"
       */
      public async index({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_module,
                  data: {
                        module: request.input('module')
                  }
            })
            try {
                  const { page = 1, limit = 100, orderBy = "created_at" } = request.qs()
                  const data = await this.permission.getAll({ page, limit, orderBy, module: payload.module })
                  response.ok({ status: true, data })
            } catch (error) {
                  Logger.error(`Error :) ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * 1. Validate the request body using the validation schema defined in the class.
       * 2. Prepare the input data for the database.
       * 3. Check if the permission already exists.
       * 4. Create the permission
       * @param {HttpContextContract}  - 1. The payload is the data that is sent to the server.
       */
      public async store({ request, response }: HttpContextContract) {
            //1
            const payload = await request.validate({
                  schema: this.v_create,
                  data: request.body()
            })

            try {
                  //2
                  const input = {
                        designation: `${payload.permission}_${payload.module}`,
                        module: payload.module,
                        description: payload.description
                  }

                  //3
                  if (await this.permission.find({ key: "designation", value: input.designation }))
                        return response.conflict({ status: false, message: 'Permission already exists.' })

                  const result = await this.permission.registre(input)
                  response.created({ ststus: true, data: result })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /**
       * It updates a record in the database.
       * @param {HttpContextContract}  - HttpContextContract - This is the context object that is passed to
       * the controller method. It contains the request and response objects.
       */
      public async update({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_update,
                  data: {
                        id: request.param('id'),
                        description: request.input('description')
                  }
            })

            try {
                  const data = await this.permission.update(payload)
                  response.created({ status: true, data })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }

      /* A function that deletes a record in the database. */
      public async destroy({ request, response }: HttpContextContract) {
            const payload = await request.validate({
                  schema: this.v_delete,
                  data: {
                        id: request.param('id')
                  }
            })
            try {
                  if (!await this.permission.find({ key: 'id', value: payload.id }))
                        return response.notFound({ status: false, message: 'Permission not Found.' })

                  await this.permission.destroy(payload.id)
                  return response.ok({ status: true, message: 'Permission deleted.' })
            } catch (error) {
                  Logger.error(`Error : ${error.message}`)
                  response.expectationFailed({ status: false, message: error.message })
            }
      }
}
