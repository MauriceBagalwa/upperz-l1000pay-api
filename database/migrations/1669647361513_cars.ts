import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ICarStatus, TYPEOWNER } from 'App/Models/Car'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('designation')
      table.string('mark')
      table.string('number_plate')
      table.string('chassi_number').unique()
      table.integer('places')
      table.text('comment')
      table.string('status').defaultTo(ICarStatus.OPERATIONNEL)
      table.string('owner').defaultTo(TYPEOWNER)
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
