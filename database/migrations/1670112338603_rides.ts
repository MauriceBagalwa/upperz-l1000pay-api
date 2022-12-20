import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { IRideStatus } from 'App/Models/Ride'

export default class extends BaseSchema {
  protected tableName = 'rides'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('customer_id').references('customers.id').onDelete('CASCADE')
      table.string('place_departure').notNullable()
      table.string('description_place_departure').notNullable()
      table.double('lat_departure')
      table.double('lng_departure')

      table.string('place_arrival')
      table.string('description_place_arrival').notNullable()
      table.double('lat_arrival')
      table.double('lng_arrival')
      table.double('distance')
      table.string('unite').defaultTo('km')


      table.uuid('driver_id').unsigned().references('drivers.id').onDelete('CASCADE')
      table.timestamp('departure_time', { useTz: true })
      table.timestamp('arrival_time', { useTz: true })

      table.double('amount')
      table.string('status').defaultTo(IRideStatus.DEMANDE)

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
