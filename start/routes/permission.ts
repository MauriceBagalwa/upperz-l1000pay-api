import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.resource('/permissions', "PermissionsController").except(['show', 'update'])
      Route.get('/permissions/assign', "RolePermissionsController.index")
      Route.resource('/permissions/assign/:roleId', "RolePermissionsController").except(['index', 'destroy'])
      Route.get('/assign/special-permissions/', "SpecialPermissionsController.index")
      Route.post('/assign/special-permissions/:userId', "SpecialPermissionsController.store")
}).prefix('api/v1')