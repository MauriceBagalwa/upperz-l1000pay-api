import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
      Route.resource('/commisions', "CarsController")
      Route.resource('/assigncars', "AssigncarsController")
      // Route.group(()=>{

      // })
}).prefix('api/v1').middleware('auth:user')