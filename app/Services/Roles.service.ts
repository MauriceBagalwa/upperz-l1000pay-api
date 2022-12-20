import UserRole from "App/Models/UserRole"
import generate from "App/Utils/Generator"
import Role from 'App/Models/Role'
import type i from 'interface'

export default class RoleService {
      /* A way to access the model from the service. */
      private role = Role
      public userRole = UserRole

      /**
       * This function returns a promise that resolves to a Role object or null.
       * @param params - i.IFindByKeyValue
       * @returns A promise of a Role or null
       */
      public async find(params: i.IFindByKeyValue): Promise<Role | null> {
            return this.role.findBy(params.key, params.value)
      }

      /**
       * It returns a paginated list of roles, ordered by the orderBy parameter, in descending order
       * @param params - i.IQuerry
       * @returns An array of Role objects or null.
       */
      public async getAll(params: i.IQuerry): Promise<Role[] | null> {
            return this.role
                  .query()
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      /**
       * It takes an input of type `i.ISimpleRegistre` and returns a promise of type `Role`
       * @param input - i.ISimpleRegistre
       * @returns The Role model is being returned.
       */
      public async registre(input: i.ISimpleRegistre): Promise<Role> {
            return this.role.create(input)
      }

      /**
       * It updates the role with the given id with the given input.
       * @param input - i.IUpdateSimpleRegistre
       * @returns The updated role.
       */
      public async update(input: i.IUpdateSimpleRegistre): Promise<Role | null> {
            await this.role.query().where('id', input.id).update(input.input).first()
            return this.role.findBy('id', input.id)
      }

      /**
       * It deletes a role from the database based on the role's id.
       * @param {string} RoleId - The id of the role you want to delete.
       * @returns The first role that matches the id.
       */
      public async destroy(RoleId: string): Promise<Role | null> {
            return this.role.query().where('id', RoleId).delete().first()
      }

      /**
       * - U S E R  R O L E -
       */

      public async getUsersRole(params: i.IAssignRoleQuerry): Promise<UserRole[]> {
            return await this.userRole
                  .query()
                  .if(params.role, (query) => {
                        query
                              .where('role_id', params.role).select('id', 'user_id', 'created_at', 'updated_at')
                  })
                  .if(!params.role, (query) => {
                        query.preload('role')
                  })
                  .preload('user')
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }


      /**
       * It returns the first row of the user_roles table where the value of the column specified by the
       * key parameter is equal to the value parameter
       * @param params - i.IFindByKeyValue
       * @returns The first row of the table that matches the key and value.
       */
      public async findAssignRole(params: i.IFindByKeyValue): Promise<UserRole | null> {
            return await this.userRole.query().where(params.key, params.value).first()
      }


      /**
       * This function takes an input of type i.IUserRole and returns a promise of type UserRole.
       * @param input - i.IUserRole
       * @returns The UserRole model is being returned.
       */
      public async assignUserRole(input: i.IUserRole): Promise<UserRole> {
            return await this.userRole.create(input)
      }

      public async assignRoleToUser(input: i.IUserRoleOnCreate) {
            const role = await this.role.firstOrCreate(
                  { designation: input.designation },
                  {
                        id: await generate.id(),
                        designation: input.designation,
                  }
            )
            await this.userRole.create({ userId: input.userId, roleId: role.id })
      }

      /**
       * It updates the user_role table with the new role_id.
       * @param input - i.IUpdateUserRole
       * @returns The first row that matches the where clause.
       */
      public async updateAssignUserRole(input: i.IUpdateUserRole): Promise<UserRole> {
            return await this.userRole
                  .query()
                  .where('id', input.id as string)
                  .update({ role_id: input.roleId })
                  .first()
      }

      /**
       * It deletes a user role from the database
       * @param {string} id - The id of the user role you want to delete
       * @returns The first record that matches the query.
       */
      public async deleteUserRoles(id: string): Promise<UserRole> {
            return await this.userRole.query().where('id', id).delete().first()
      }
}
