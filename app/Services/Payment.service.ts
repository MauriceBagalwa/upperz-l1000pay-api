import Commission from 'App/Models/Commissiom'
import Payment from 'App/Models/Payment'
import moment from 'moment'
import i from "interface"

export default class PaymentService {

      private static _instance: PaymentService
      private commission = Commission
      private payment = Payment
      startDate: string
      endDate: string

      public async find(params: i.IFindByKeyValue): Promise<Payment | null> {
            return this.payment.findBy(params.key, params.value)
      }

      /**
       * It returns a paginated list of roles, ordered by the orderBy parameter, in descending order
       * @param params - i.IQuerry
       * @returns An array of Role objects or null.
       */
      public async getAll(params: i.IPaymentQuerry): Promise<Payment[]> {

            //1
            if (params.startDate) {
                  this.startDate = moment(`${params.startDate}`).format('YYYY-MM-DD')
                  this.endDate = moment(`${!params.endDate ? params.startDate : params.endDate}`)
                        .add(1, 'days')
                        .format('YYYY-MM-DD')
            }
            //2
            return this.payment
                  .query()
                  .if(params.startDate, (query) =>
                        query
                              .where('rides.created_at', '>=', this.startDate)
                              .where('rides.created_at', '<', this.endDate)
                  )
                  .preload('ride')
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      /**
       * It returns a paginated list of roles, ordered by the orderBy parameter, in descending order
       * @param params - i.IQuerry
       * @returns An array of Role objects or null.
       */
      public async registre(input: i.IPayment): Promise<Payment> {
            return this.payment.create(input)
      }


      /**
       * Comissions
       */
      public async comissions(params: i.IPaymentQuerry): Promise<Payment[]> {


            //1
            if (params.startDate) {
                  this.startDate = moment(`${params.startDate}`).format('YYYY-MM-DD')
                  this.endDate = moment(`${!params.endDate ? params.startDate : params.endDate}`)
                        .add(1, 'days')
                        .format('YYYY-MM-DD')
            }
            //2
            return this.commission
                  .query()
                  .if(params.startDate, (query) =>
                        query
                              .where('commissioms.created_at', '>=', this.startDate)
                              .where('commissioms.created_at', '<', this.endDate)
                  )
                  .preload('ride', (query) => {
                        query
                              .select(['id', 'place_departure', 'description_place_arrival', 'place_arrival', 'description_place_arrival', 'driver_id', 'amount'])
                              .preload('driver', (query) => {
                                    query.select(['id', 'user_id']).preload('user', (query) => {
                                          query.select(['id', 'name', 'lastname', 'country_code', 'phone_number', 'email', 'profile'])
                                    })
                              })
                  })
                  .orderBy(params.orderBy, 'desc')
                  .paginate(params.page, params.limit)
      }

      public async comission(input: i.IComission): Promise<Payment> {
            return await this.commission.create(input)
      }

      public static get Instance() {
            // Do you need arguments? Make it a regular static method instead.
            return this._instance || (this._instance = new this())
      }

}