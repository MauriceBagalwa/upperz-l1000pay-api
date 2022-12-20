import agentWallet from 'App/Models/RechargeAgentWallet'
import User from 'App/Models/User'
import type i from 'interface'
import moment from "moment"

export enum TypeMail {
      ADMINISTARTION = "administration",
      DRIVER = "driver",
      AGENT = "agent",
}

export default class UserService {
      private static _instance: UserService
      public static typeOfMail: TypeMail
      private transaction = agentWallet
      private model = User
      startDate: string
      endDate: string
      /**
       * This function returns a promise that resolves to a User object or null.
       * @param params - i.IFindByKeyValue
       * @returns A promise of a User or null
       */
      public async find(params: i.IFindByKeyValue): Promise<User | null> {
            return this.model.query().where(params.key, params.value).preload('role').first()
      }

      public async signin(email: string): Promise<User | null> {
            return await this.model
                  .query()
                  .where('email', email)
                  .andWhere('status', true)
                  .preload('role')
                  .preload('specialPermissions')
                  .first()
      }

      public async getAll(params: i.IQuerry): Promise<User[] | null> {
            return this.model
                  .query()
                  .preload('role')
                  .preload('specialPermissions')
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async registre(input: i.IUser): Promise<User> {
            return this.model.create(input)
      }

      public async update(id: string, input: object): Promise<User | null> {
            await this.model.query().where('id', id).update(input).first()
            return this.model.findBy('id', id)
      }

      public async destroy(UserId: string): Promise<User | null> {
            return this.model.query().where('id', UserId).delete().first()
      }

      public static get Instance() {
            // Do you need arguments? Make it a regular static method instead.
            return this._instance || (this._instance = new this())
      }

      /**
       * Recharge Agent wallet
       */

      public async transactions(params: i.IQueryAgentWallet): Promise<agentWallet[]> {

            if (params.startDate) {
                  this.startDate = moment(`${params.startDate}`).format('YYYY-MM-DD')
                  this.endDate = moment(`${!params.endDate ? params.startDate : params.endDate}`)
                        .add(1, 'days')
                        .format('YYYY-MM-DD')
            }
            return this.transaction.query()
                  // where(params.key, params.value)
                  .if(params.agentWalletId, ((query) => {
                        query.where('agent_wallet_id', params.agentWalletId)
                  }))
                  .if(params.userId, ((query) => {
                        query.where('user_id', params.userId)
                  }))
                  .if(params.startDate, ((query) => {
                        query
                              .where('created_at', '>=', this.startDate)
                              .where('created_at', '<', this.endDate)
                  }))
                  .preload('wallet', (query) => {
                        query.select(['id', 'agent_id']).preload('agent', (query) => {
                              query.select(['id', 'user_id']).preload('user')
                        })
                  })
                  .preload('user')
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async findTransaction(params: i.IFindByKeyValue): Promise<agentWallet | null> {
            return this.transaction.query().where(params.key, params.value).first()
      }

      public async makeTrans(input: i.ITransactionAgentWallet): Promise<agentWallet | null> {
            return this.transaction.create(input)
      }

}
