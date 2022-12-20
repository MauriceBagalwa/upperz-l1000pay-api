import Logger from '@ioc:Adonis/Core/Logger'
import { CourierClient } from '@trycourier/courier'

interface IMail {
      to: string
      data: object
}

export default class Sender {

      // private courier = CourierClient({ authorizationToken: "pk_prod_NMP120518746YHJ3BN2P6Y29RXQK" });
      public static async send(template: string, email: string, data: object) {
            const courier = CourierClient({ authorizationToken: 'pk_prod_NMP120518746YHJ3BN2P6Y29RXQK' })
            const { requestId } = await courier.send({
                  message: {
                        to: {
                              email,
                        },
                        template,
                        data,
                  },
            })
            Logger.info(requestId)
      }

      public static async userMail(input: IMail) {
            await this.send('6YBCHF4FW74VMKHTN8NFAZVT1WZP', input.to, input.data)
      }
      public static async resetUserPsswd(input: IMail) {
            await this.send('Y4G6VE41ABMCXVK8NJ72BGM3FFH4', input.to, input.data)
      }
      public static async driverMail(input: IMail) {
            await this.send('ZF3YTY560B4207GFNR0T78C77XWJ', input.to, input.data)
      }
      public static async agentMail(input: IMail) {
            await this.send('YHASYEJT23MF17JHSQ0QPMP1G3N9', input.to, input.data)
      }
}