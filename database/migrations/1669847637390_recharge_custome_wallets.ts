import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recharge_custome_wallets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('agent_wallet_id').references('agent_wallets.id').notNullable()
      table.uuid('customer_wallet_id').references('customer_wallets.id').notNullable()
      table.float('amount').notNullable()
      table.string('devise').defaultTo('CDF')

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
