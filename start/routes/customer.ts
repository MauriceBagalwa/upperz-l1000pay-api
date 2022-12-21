import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
      Route.post('/customers/signin', "CustomersController.login")
      Route.resource('customers', "CustomersController").only(['store'])



      Route.group(() => {
            Route.put('customers/update', "CustomersController.update")
            Route.put('customers/change/password', "CustomersController.changedPassword")
            Route.put('customers/change/profile', "CustomersController.updateProfile")
            Route.post('customers/logout', "CustomersController.logOut")

            Route.post('customers/wallet', 'WalletsController.walletToken')
            Route.put('customers/wallet', 'WalletsController._updatePsswd')
            Route.get('customers/recharges', 'AgentsController.customerRecharges')

      }).middleware('auth:customer')

      Route.group(() => {
            Route.resource('customers', "CustomersController").only(['index', 'show'])
            // Route.get('wallets/customers', 'WalletsController.customerWallets')
            // Route.put('wallets/customers/status/:id', 'WalletsController.updateCWallet')
      }).middleware('auth:user')

      Route.get('cutstomer/wallet/account/:model', 'WalletsController.account')
            .middleware('auth:customer_wallet')

}).prefix('api/v1')

