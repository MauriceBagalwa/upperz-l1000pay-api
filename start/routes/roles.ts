import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.resource('/assign-role', "UserRolesController")
      Route.resource('/roles', "RolesController")
}).prefix('api/v1')