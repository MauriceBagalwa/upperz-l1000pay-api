import customeWallet from "App/Models/RechargeCustomeWallet"
import Agent from 'App/Models/Agent'
import moment from 'moment';
import i from "interface"

export default class AgentService {

      private model = Agent
      private transaction = customeWallet;
      startDate: string;
      endDate: string;

      public async getAll(params: i.IQuerry): Promise<Agent[] | null> {
            return await this.model
                  .query()
                  .preload('user')
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async find(params: i.IFindByKeyValue): Promise<Agent | null> {
            return await this.model.findBy(params.key, params.value)
      }

      public async registre(input: i.IAgent): Promise<Agent> {
            return await this.model.create(input)
      }

      public async update(id: string, input: i.IAgent): Promise<Agent | null> {
            await this.model.query().where('id', id).update(input).first()
            return await this.model.query().where('id', id).first()
      }

      /**
      * Recharge Agent wallet
      */

      public async transactions(params: i.IQueryCustomerWallet): Promise<customeWallet[]> {

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
                  .if(params.customerWalletId, ((query) => {
                        query.where('customer_wallet_id', params.customerWalletId)
                  }))
                  .if(params.startDate, ((query) => {
                        query
                              .where('created_at', '>=', this.startDate)
                              .where('created_at', '<', this.endDate)
                  }))
                  // .preload('wallet', (query) => {
                  //       query.select(['id', 'agent_id']).preload('agent', (query) => {
                  //             query.select(['id', 'user_id']).preload('user')
                  //       })
                  // })
                  // .select(['id', 'wallet'])
                  .preload('agentWallet', (query) => {
                        query
                              .select(['id', 'numberWallet', 'agentId'])
                              .preload('agent', (query) => {
                                    query.select(['id', 'user_id']).preload('user', (query) => {
                                          query.select(['id', 'name', 'lastname', 'profile'])
                                    })
                              })
                  })
                  .preload('customerWallet', (query) => {
                        query
                              .select(['id', 'numberWallet', 'customerId'])
                              .preload('customer', (query) => {
                                    query.select(['id', 'name', 'lastname', 'profile'])
                              })
                  })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async findTransaction(params: i.IFindByKeyValue): Promise<customeWallet | null> {
            return this.transaction.query().where(params.key, params.value).first()
      }

      public async makeTrans(input: i.ITransactionCustomerWallet): Promise<customeWallet | null> {
            return this.transaction.create(input)
      }
}