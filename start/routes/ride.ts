import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

      Route.group(() => {
            Route.post('/rides', "RidesController.store")
            Route.post('/rides/select-driver/:id', "RidesController.selectdriver")
            Route.get('/rides/customer', "RidesController.customerRides")
            //payment
            Route.resource('payments', "PaymentsController").except(['index'])
      }).middleware("auth:customer")

      Route.group(() => {
            Route.get('drivers/rides', 'RidesController.driverRides')
            Route.put('rides/amount/:id', 'RidesController.amount')
            Route.put('rides/status/:id', 'RidesController.updateStatus')
            Route.post('drivers/rides/response/:id', 'RidesController.responseDriver')

            Route.post('rides/forcard', 'PaymentsController.rideCartePayment')
            Route.post('payments/withcard', 'PaymentsController.cartePayment')
      }).middleware("auth:driver")

      Route.group(() => {
            Route.get('/rides', "RidesController.index")
            Route.get('payments', "PaymentsController.index")
      }).middleware("auth:user")
}).prefix('api/v1')