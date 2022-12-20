import customerWallet from 'App/Models/CustomerWallet'
import driverWallet from 'App/Models/DriverWallet'
import agentWallet from 'App/Models/AgentWallet'
import i from "interface"

export enum EModel {
      CUSTOMER = "customer",
      DRIVER = "driver",
      AGENT = "agent",
}
export type TModel = {
      CUSTOMER: customerWallet
}

export enum ESign {
      ADD = "add",
      SOUTR = "soutr"
}

export default class WalletService {

      public customer = customerWallet;
      private static _instance: WalletService
      public driver = driverWallet;
      public agent = agentWallet;

      public async c_Wallets(params: i.IQuerry): Promise<customerWallet[]> {
            return await this.customer
                  .query()
                  .if(params.status, (querry) => {
                        querry.where('status', params.status as boolean)
                  })
                  .preload('customer')
                  .paginate(params.page, params.limit)
      }




      public async registreWallet(input: i.ICustomerWallet): Promise<customerWallet> {
            return await this.customer.create(input)
      }

      public async rechargeCustomerWallet(signe: ESign, input: i.IRechargeWallet): Promise<agentWallet> {
            const find = await this.agent.findBy('id', input.walletId)
            const solde = signe === ESign.ADD ? (find!.solde + input.amount) : (find!.solde - input.amount)
            return await this.agent.query().where('id', input.walletId)
                  .update({ solde }).first()
      }

      public async updateWallet(wallet: customerWallet): Promise<customerWallet | null> {
            await this.customer.query().where('id', wallet.id)
                  .update({ status: !wallet.status }).first()
            return this.customer.findBy('id', wallet.id)
      }

      public static get Instance() {
            // Do you need arguments? Make it a regular static method instead.
            return this._instance || (this._instance = new this())
      }

      /**
       * Driver
       */
      public async d_Wallets(params: i.IQuerry): Promise<driverWallet[]> {
            return await this.driver
                  .query()
                  .if(params.status, (querry) => {
                        querry.where('status', params.status as boolean)
                  })
                  .preload('driver', (_driver) => {
                        _driver.preload('user')
                  })
                  .paginate(params.page, params.limit)
      }

      public async d_findWallet(params: i.IFindByKeyValue): Promise<driverWallet | null> {
            return await this.driver
                  .query().where(params.key, params.value).first()
      }

      public async d_registreWallet(input: i.IDriverWallet): Promise<driverWallet> {
            return await this.driver.create(input)
      }

      public async d_updateWallet(wallet: driverWallet): Promise<driverWallet | null> {
            await this.driver.query().where('id', wallet.id)
                  .update({ status: !wallet.status }).first()
            return this.driver.findBy('id', wallet.id)
      }
      /**
       * Agent
       */
      public async agent_Wallets(params: i.IAgentQurery): Promise<agentWallet[]> {
            return await this.agent
                  .query()
                  .if(params.status, (querry) => {
                        querry.where('status', params.status as boolean)
                  })
                  .if(params.agentId, (querry) => {
                        querry.where('agent_id', params.agentId as string)
                  })
                  .preload('agent', (query) => {
                        query.preload('user')
                  })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async agent_findWallet(params: i.IFindByKeyValue): Promise<agentWallet | null> {
            return await this.agent
                  .query().where(params.key, params.value).first()
      }

      public async agent_registreWallet(input: i.IAgentWallet): Promise<agentWallet> {
            return await this.agent.create(input)
      }

      public async agent_updateWallet(wallet: agentWallet): Promise<agentWallet | null> {
            await this.agent.query().where('id', wallet.id)
                  .update({ status: !wallet.status }).first()
            return this.agent.findBy('id', wallet.id)
      }

      public async customerPay(input: i.IRechargeWallet): Promise<agentWallet> {

            // const _model = model === EModel.CUSTOMER ? this.customer : model === EModel.AGENT ? this.agent : this.driver

            const find = await this.customer.findBy('customer_id', input.walletId)
            const solde = (find!.solde - input.amount)

            return await this.customer.query().where('id', find!.id)
                  .update({ solde }).first()
      }
      public async rechargeDriver(input: i.IRechargeWallet): Promise<driverWallet> {
            const find = await this.driver.findBy('driver_id', input.walletId)
            const solde = (find!.solde + input.amount)
            return await this.driver.query().where('id', find!.id)
                  .update({ solde }).first()
      }

      public async agent_recahrgeWallet(model: EModel, signe: ESign, input: i.IRechargeAgentWallet): Promise<agentWallet> {

            const _model = model === EModel.CUSTOMER ? this.customer : model === EModel.AGENT ? this.agent : this.driver

            const find = await _model.findBy('id', input.walletId)
            const solde = signe === ESign.ADD ? (find!.solde + input.solde) : (find!.solde - input.solde)
            console.log(`Solde ${solde} -> ${find!.solde} ${signe} ${input.solde}`)
            return await _model.query().where('id', input.walletId)
                  .update({ solde }).first()
      }
      /**
       * 
       */

      public async findWallet(model: EModel, params: i.IFindByKeyValue): Promise<any> {

            const _model = model === EModel.CUSTOMER ? this.customer : model === EModel.AGENT ? this.agent : this.driver
            return await _model
                  .query().where(params.key, params.value).first()
      }

      // customer 
      public async findCustomerWallet(params: i.IFindByKeyValue): Promise<customerWallet | null> {
            return await this.customer
                  .query().where(params.key, params.value).select(['id', 'customerId']).preload('customer', (query) => {
                        query.select(['id', 'name', 'lastname', 'profile'])
                  }).first()
      }

      public async agentsTrans(id: string, params: i.IQuerry): Promise<agentWallet[]> {
            return await this.agent
                  .query().where('id', id)
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }


      /**
       * 
       */
      public async _updateWallet(model: EModel, id: string, input: Object): Promise<agentWallet> {

            const _model = model === EModel.CUSTOMER ? this.customer : model === EModel.AGENT ? this.agent : this.driver
            return await _model.query().where('id', id)
                  .update(input).first()
      }


}