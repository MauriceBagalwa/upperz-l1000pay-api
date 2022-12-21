import { DateTime } from 'luxon'
import { afterSave, BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import generate from "App/Utils/Generator"
import _Ride from 'App/Services/Ride.service'
import Service from 'App/Services/Payment.service'
import Ride, { IRideStatus } from 'App/Models/Ride';
import WalletService from 'App/Services/Wallet.service';

export enum ECommision {
  VALUE = 4
}

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'ride_id' })
  public rideId: string

  @column({ serializeAs: 'amount' })
  public amount: number

  @column()
  public currency: string

  // @column()
  // public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async generateId(model: Payment) {
    model.id = await generate.id()
  }

  @afterSave()
  public static async changeStatus(model: Payment) {
    //1
    await _Ride.Instance.update(model.rideId, { status: IRideStatus.TERMINER })
    //2
    const cAmount = (model.amount / 100) * ECommision.VALUE
    await Service.Instance.comission({ amount: cAmount, percentage: ECommision.VALUE, ride_id: model.rideId })

    const rideFind = await _Ride.Instance.find({ key: 'id', value: model.rideId })
    //3
    await WalletService.Instance.rechargeDriver({ amount: (model.amount - cAmount), walletId: rideFind?.driverId as string })

  }

  @belongsTo(() => Ride, {})
  public ride: BelongsTo<typeof Ride>
}
