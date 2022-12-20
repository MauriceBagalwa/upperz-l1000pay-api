import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RideValidator {
  // constructor() {}

  public v_create = schema.create({

    customerId: schema.string.optional([rules.uuid()]),
    placeDeparture: schema.string([rules.minLength(8), rules.maxLength(120)]),
    descriptionPlaceDeparture: schema.string([rules.minLength(8), rules.maxLength(250)]),
    latDeparture: schema.number(),
    lngDeparture: schema.number(),
    placeArrival: schema.string([rules.minLength(8), rules.maxLength(120)]),
    descriptionPlaceArrival: schema.string([rules.minLength(8), rules.maxLength(250)]),
    latArrival: schema.number(),
    lngArrival: schema.number()
  })

  public v_param = schema.create({
    id: schema.string([rules.uuid(), rules.exists({ table: 'rides', column: "id" })]),
  })

  public v_select_driver = schema.create({
    driverId: schema.string([rules.uuid()]),
  })

  public v_driver_response = schema.create({
    status: schema.boolean(),
  })

  public v_amount_ride = schema.create({
    amount: schema.number(),
  })
}
