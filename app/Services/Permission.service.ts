import SpecialPermission from 'App/Models/SpecialPermission'
import RolePermission from 'App/Models/RolePermission'
import Permission from 'App/Models/Permission'
import type i from 'interface'

export default class PermissionService {
      private model = Permission
      private roleprmi_model = RolePermission
      private special_permi = SpecialPermission

      /**
       * This function returns a promise that resolves to a Permission object or null.
       * @param params - i.IFindByKeyValue
       * @returns A promise of a Permission or null
       */
      public async find(params: i.IFindByKeyValue): Promise<Permission | null> {
            return await this.model.findBy(params.key, params.value)
      }

      public async getAll(params: i.IPermissionQuerry): Promise<Permission[] | null> {
            return await this.model
                  .query()
                  .if(params.module, (query) => query.where('module', params.module as string))
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async registre(input: i.IPermission): Promise<Permission> {
            return await this.model.create(input)
      }

      public async update(input: i.IUpdatePermission): Promise<Permission | null> {
            await this.model.query().where('id', input.id).update({ description: input.description })
                  .first()
            return this.model.findBy('id', input.id)
      }

      public async destroy(permissionId: string): Promise<Permission | null> {
            return await this.model.query().where('id', permissionId).delete().first()
      }

      /**
       * Assign Role Permission
       */
      public async findAssignRole(params: i.IFindByKeyValue): Promise<RolePermission[]> {
            return await this.roleprmi_model.query().where(params.key, params.value)
      }

      public async getAllRolePermi(params: i.IRolePermiQuerry): Promise<RolePermission[]> {
            return await this.roleprmi_model
                  .query()
                  .if(params.roleId, (query) => {
                        query.where('role_id', params.roleId as string)
                  })
                  .preload('role', (query) => {
                        query.select(['id', 'designation', 'description'])
                  })
                  .preload('permission', (query) => {
                        query.select(['id', 'designation', 'module', 'description'])
                  })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async assignToRole(input: i.IRolePermission[]): Promise<RolePermission[]> {
            return await this.roleprmi_model.createMany(input)
      }

      public async updateRolePermission(id: string, input: i.IRolePermission): Promise<RolePermission> {
            return await this.roleprmi_model.query().where('id', id).update(input).first()
      }

      public async deleteRolePermission(id: string): Promise<RolePermission> {
            return await this.roleprmi_model.query().where('id', id).delete().first()
      }

      /**
       * Special Permission
       */
      public async getSpecialPermissions(params: i.ISpecialPermiQuerry): Promise<SpecialPermission[] | null> {
            return await this.special_permi
                  .query()
                  .if(params.userId, (query) => query.where('user_id', params.userId as string))
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async assignSpecialPermi(inout: i.ISpecialPermission[]): Promise<SpecialPermission[]> {
            return await this.special_permi.createMany(inout)
      }

      public async deleteSPermission(id: string): Promise<SpecialPermission> {
            return await this.special_permi.query().where('id', id).delete().first()
      }

      public async findSpecialPermission(params: i.IFindByKeyValue): Promise<SpecialPermission[]> {
            return await this.special_permi.query().where(params.key, params.value)
      }
}
