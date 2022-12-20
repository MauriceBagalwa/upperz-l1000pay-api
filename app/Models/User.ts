import { column, beforeSave, BaseModel, manyToMany, ManyToMany, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import UserService, { TypeMail } from "App/Services/User.service"
import { inject } from '@adonisjs/core/build/standalone'
import RoleService from "App/Services/Roles.service"
import generate from "App/Utils/Generator"
import Hash from '@ioc:Adonis/Core/Hash'
import Permission from './Permission'
import Role, { ERole } from './Role'
import { DateTime } from 'luxon'

let psswdGenerate: string;

@inject()
export default class User extends BaseModel {
  // constructor(private roleService: RoleService) { }
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public countryCode: string

  @column()
  public phoneNumber: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public profile: string

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(model: User) {
    //1
    model.id = await generate.id()
    model.password = '0000'
    model.username = generate.username()

    if (model.$dirty.password) {
      psswdGenerate = generate.password(8)
      model.password = await Hash.make(psswdGenerate)
    }
  }

  @afterCreate()
  public static async asignToTypePersonne(model: User) {
    // add role to user
    const designation = UserService.typeOfMail === TypeMail.ADMINISTARTION ? ERole.USER : UserService.typeOfMail === TypeMail.DRIVER ? ERole.DRIVER : ERole.CHARGING_AGENT

    const roleService = new RoleService()
    await roleService.assignRoleToUser({ designation, userId: model.id })

    // const data = {
    //   user: `${model.name} ${model.lastname}`,
    //   password: psswdGenerate
    // }

    console.log(`Psswd: ${psswdGenerate}`)
    // UserService.typeOfMail === TypeMail.DRIVER ? sender.driverMail({
    //   to: model.email, data
    // }) : UserService.typeOfMail === TypeMail.AGENT ? sender.agentMail({
    //   to: model.email, data
    // }) : sender.userMail({
    //   to: model.email, data
    // })
  }

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
    onQuery: (query) => {
      query.preload('permissions')
    },
  })
  public role: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'special_permissions',
  })
  public specialPermissions: ManyToMany<typeof Permission>
}
