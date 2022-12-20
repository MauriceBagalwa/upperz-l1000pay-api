import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'assign_cars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('driver_id').unsigned().references('drivers.id').notNullable()
      table.uuid('car_id').unsigned().references('cars.id').notNullable()
      table.boolean('current').defaultTo(true)
      table.timestamp('start_assign')
      table.timestamp('end_of_assign')
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
