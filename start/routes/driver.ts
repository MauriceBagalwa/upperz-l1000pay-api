import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.group(() => {
            Route.resource('drivers', "DriversController").only(['index', 'store', 'destroy'])
            Route.put('drivers/update/:id', "DriversController.updateInfo")

            Route.get('drivers/wallets', 'WalletsController.driverWallets')
            Route.put('drivers/wallets/status/:id', 'WalletsController.updateDriverWallet')

      }).middleware('auth:user')

      Route.group(() => {
            Route.put('drivers', 'DriversController.update')
            Route.put('drivers/change/profile', 'DriversController.updateProfile')
            Route.put('drivers/change/psswd', 'DriversController.changedPassword')
            Route.put('drivers/change/status', 'DriversController.status')
            Route.put('drivers/change/location', 'DriversController.updateLocation')
            Route.post('drivers/logout', 'DriversController.logOut')

            Route.post('wallet/account/driver', 'WalletsController.walletToken')
            Route.put('wallet/account/driver', 'WalletsController._updatePsswd')

      }).middleware('auth:driver')

      Route.get('drivers/wallet/account/:model', 'WalletsController.account')
            .middleware('auth:driver_wallet')

      Route.post('drivers/signin', 'DriversController.login')
}).prefix('api/v1')