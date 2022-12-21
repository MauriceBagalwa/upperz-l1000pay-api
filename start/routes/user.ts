import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.post('/upload', "UsersController.profile")
      Route.post('/users/signin', "UsersController.login")
}).prefix('api/v1')

Route.group(() => {
      Route.resource('/users', "UsersController").except(['show'])
      Route.put('/users', "UsersController.update")
      Route.put('/users/change/profile/', "UsersController.updateProfile")
      Route.put('/users/change/psswd', "UsersController.updatePassword")
      Route.put('/users/status/:id', "UsersController.accountStatus")
      Route.put('/users/reset-password/:id', "UsersController.resetPassword")
      Route.post('/users/logout', "UsersController.logOut")
      Route.get('/users/transations', 'UsersController.transations')
      Route.group(() => {
            Route.post('/transations', 'UsersController.makeTransation')
      }).prefix('wallet/agent')

      // comissions
      Route.get('commissions', "PaymentsController.indexCommision")
}).prefix('api/v1')
      .middleware('auth:user')
