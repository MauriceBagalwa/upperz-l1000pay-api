import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { EStausDriver } from 'App/Models/Driver'

export default class extends BaseSchema {
  protected tableName = 'drivers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('users.id').onDelete('CASCADE')
      table.string('card_type').notNullable()
      table.string('card_type_id').unique()
      table.string('card_image')
      table.enum('status', Object.values(EStausDriver)).notNullable().defaultTo(EStausDriver.FREE)
      table.double('lat')
      table.double('lng')
      /**
    * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
    */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
