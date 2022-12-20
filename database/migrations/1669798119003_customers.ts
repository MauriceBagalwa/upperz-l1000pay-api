import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name')
      table.string('lastname')
      table.string('email').notNullable().unique()
      table.string('country_code').notNullable()
      table.string('phone_number').notNullable().unique()
      table.string('password')
      table
        .string('profile')
        .defaultTo('https://cdn3.iconfinder.com/data/icons/web-and-networking-4/128/45-512.png')
      table.boolean('status').defaultTo(true)
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
