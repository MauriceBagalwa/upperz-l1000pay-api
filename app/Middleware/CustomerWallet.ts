import { inject } from '@adonisjs/fold'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

@inject()
export default class CustomerWallet {


  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    try {
      // const { password } = request.only(['password'])
      // const find = await this.wallet.findWallet({ key: 'id', value: auth.use('customer').user!.id })

      // if (!find) {
      //   throw new Error('Wallet not Found.')
      // }

      // if (!find!.status) {
      //   throw new Error('Wallet disable.')
      // }

      // if (!(await Hash.verify(find!.password, password))) {
      //   throw new Error('Identifiants inccorect')
      // }

      await next()
    } catch (error) {
      response.notFound({ status: false, message: error.message })
    }
  }
}
