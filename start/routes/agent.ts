import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.group(() => {
            Route.resource('agents', "AgentsController").only(['index', 'store', 'destroy'])
            Route.put('agents/update/:id', "AgentsController.updateInfo")

            Route.get('agents/show/transactions', 'AgentsController.transations')
            // Route.put('agents/wallets/status/:id', 'WalletsController.updareAgentWallet')

      }).middleware('auth:user')

      Route.group(() => {
            Route.put('agents', 'AgentsController.update')
            Route.put('agents/change/profile', 'AgentsController.updateProfile')
            Route.put('agents/change/psswd', 'AgentsController.changedPassword')
            Route.post('agents/logout', 'AgentsController.logOut')

            // Route.group(() => {
            //       Route.get('/transations', 'AgentsController.transations')
            //       Route.post('/transations', 'AgentsController.makeTransation')
            // }).prefix('wallet/customer')

            Route.post('wallet/account/agent', 'WalletsController.walletToken')
            Route.put('wallet/account/agent', 'WalletsController._updatePsswd')
            // recharge from user
            Route.get('agent/wallet/recharges', 'AgentsController.rechargesTrans')
            // recharge user  
            Route.get('agent/transactions', 'AgentsController.agentTransations')
            Route.post('agent/transactions', 'AgentsController.makeTransation')

      }).middleware('auth:agent')

      Route.get('wallet/account/:model', 'WalletsController.account')
            .middleware('auth:agent_wallet')

      Route.post('agents/signin', 'AgentsController.login')
}).prefix('api/v1')