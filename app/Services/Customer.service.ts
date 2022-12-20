import Wallet from 'App/Models/CustomerWallet'
import Customer from 'App/Models/Customer'
import i from 'interface'

export default class CustomerService {
      /* A private property. */
      public model = Customer
      public wallet = Wallet
      // private static _instance: CustomerService
      /**
       * This function returns a list of customers from the database, where the active field is equal to the
       * active field in the params object, and paginates the results based on the page and limit fields in
       * the params object.
       * @param {IQuerry} params - IQuerry
       * @returns An array of customers
       */
      public async getAll(params: i.IQuerry): Promise<Customer[]> {
            return await this.model
                  .query()
                  .where('status', params.status as boolean)
                  .preload('wallet')
                  .paginate(params.page, params.limit)
      }

      public async find(params: i.IFindByKeyValue): Promise<Customer | null> {
            return await this.model.query().where(params.key, params.value).preload('wallet').first()
      }

      // public async getCustomer(value: string): Promise<Customer | null> {
      //       return (await this.find({
      //             key: 'phone_number',
      //             value,
      //       })) as Customer
      // }

      public async registre(input: i.ICustomer): Promise<Customer> {
            return await this.model.create(input)
      }

      public async update(id: string, input: object): Promise<Customer | null> {
            await this.model.query().where('id', id).update(input).first()
            return await this.model.findBy('id', id)
      }

      public async login(input: i.ISignin): Promise<Customer | null> {
            console.log(JSON.stringify(input))
            return await this.model
                  .query()
                  .if(input.email, (query) => query.where('email', input.email!))
                  .if(!input.email, (query) => {
                        query
                              .where('country_code', `${input.countryCode}`)
                              .andWhere('phone_number', `${input.phoneNumber}`)
                  })
                  .andWhere('status', true)
                  .first()
      }


      public async delete(id: string): Promise<Customer | null> {
            return await this.model.query().where('id', id).delete().first()
      }
}
