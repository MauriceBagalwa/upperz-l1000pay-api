import { ICarStatus, TYPEOWNER } from 'App/Models/Car'
import { IRideStatus, ETrough } from 'App/Models/Ride'
import { EStausDriver } from 'App/Models/Driver'
import { EModel } from 'App/Services/Wallet.service'
/*
* - A L L -
*/

export interface IFindByKeyValue {
      key: string,
      value: string
}

export interface IQuerry {
      page: number,
      limit: number,
      status?: boolean,
      orderBy: string,
}

export interface ISimpleRegistre {
      designation: string
      description?: string
}
/**
 * - Permission -
 */

export interface IPermissionQuerry extends IQuerry {
      module: EModule
}

export interface IPermission extends ISimpleRegistre {
      module: EModule
}

export interface IUpdatePermission {
      id: string,
      description: string
}

export interface IRolePermission {
      permissionId: string
      roleId?: string
}

export interface ISpecialPermiQuerry extends IQuerry {
      userId?: string
}

export interface ISpecialPermission {
      userId?: string
      permissionId: string
}
/**
 * - Roles -
 */

export interface IUpdateSimpleRegistre {
      id: string,
      input: {
            designation: string
            description?: string
      }
}

export interface IRolePermiQuerry extends IQuerry {
      roleId?: string
}

export interface IRolePermission {
      permissionId: string
      roleId?: string
}

export interface IUserRole {
      roleId: string
      userId: string
}

export interface IUpdateUserRole {
      id?: string
      roleId: string
}

export interface IAssignRoleQuerry extends IQuerry {
      role: string
}
export interface IUserRoleOnCreate {
      userId: string
      designation: string
}

/**
 * - User -
 */
export interface IUser {
      name: string
      lastname: string
      countryCode: string
      phoneNumber: string
      email: string
      profile?: string
}

/**
 * - D R I V E R -
 */
export interface IDriver {
      userId?: string
      cardType: string
      cardTypeId: string
      cardImage: string,
}

export interface IRideDriver {
      busy: EStausDriver
      status: boolean
      limit: number
}

/**
 * C A R
 */
export interface ICarQuerry {
      page: number
      limit: number
      status: ICarStatus,
      owner: TYPEOWNER
}

export interface ICar {
      designation: string
      mark: string
      numberPlate: string
      chassiNumber: string
      places: number
      comment: string
      owner: TYPEOWNER
      status?: ICarStatus
}
export interface ICarUpdate {
      carId?: string
      designation: string
      mark: string
      numberPlate: string
      chassiNumber: string
      places: number
      comment: string
      status?: ICarStatus
}

export interface ICarUpdateStatus {
      status: ICarStatus
}

/**
 *  ASSIGN CAR
 */
export interface IAssignCarQuerry {
      page: number
      limit: number
      current?: boolean

}

export interface IAssignCar {
      carId: string
      driverId: string
}

/**
 * CUSTOMER 
 */

export interface ICustomer extends IUser {
      password: string
}

export interface ISignin {
      email?: string
      password: string
      countryCode?: string
      phoneNumber?: string
}

export interface ICustomerWallet {
      customerId: string
      numberWallet: string,
      status?: boolean
}

export interface IDriverWallet {
      driverId: string
      numberWallet: string,
      status?: boolean
}

/**
 *  A G E N T
 */

export interface IAgent {
      userId?: string
      officeAddress: string
      description: string
}

export interface IAgentWallet {
      agentId: string
      numberWallet: string,
      status?: boolean
}
export interface IAgentQurery extends IQuerry {
      agentId?: string
}

export interface IQueryAgentWallet extends IQuerry {
      agentWalletId: string
      userId: string,
      startDate?: DateTime
      endDate?: DateTime
}

export interface ITransactionAgentWallet {
      agentWalletId: string
      userId?: string,
      amount: number
}
export interface IRechargeWallet {
      walletId: string,
      amount: number
}

export interface IRechargeAgentWallet {
      walletId: string,
      solde: number
}

/**
 *  A G E N T
 */
export interface ITransactionCustomerWallet {
      agentWalletId?: string
      customerWalletId: string,
      amount: number
}

export interface IQueryCustomerWallet extends IQuerry {
      agentWalletId: string
      customerWalletId: string,
      startDate?: DateTime
      endDate?: DateTime
}

/**
 * RIDE
 */
export interface IRideQuery extends IQuerry {
      customerId: string
      driverId?: string,
      startDate?: DateTime
      endDate?: DateTime
      distanceSup?: number
      distanceInf?: number
      status?: IRideStatus
      through: ETrough
}

export interface IRide {
      customerId?: string
      placeDeparture: string
      descriptionPlaceDeparture?: string
      latDeparture: number
      lngDeparture: number
      placeArrival: string
      descriptionPlaceArrival?: string
      latArrival: number
      lngArrival: number
      through?: string
      // arrival_time: DateTime
      // status: IRideStatus
}

export interface IDistance {
      lng_departure: number
      lat_departure: number
      lat: number
      lng: number
}

export interface ICLocation {
      latitude: number
      longitude: number
}

export interface IFindRideForSelectDriver {
      key: string,
      value: string,
      status: IRideStatus
}
export interface ISelectDriver {
      driverId?: string | null,
      status: IRideStatus
}

export interface IRideQuerryFilter {
      startDate?: DateTime
      endDate?: DateTime
      status: IRideStatus
      page: number,
      limit: number,
}

/**
 *  WALLET
 */

export interface IWalletBase {
      model: EModel,
      password: string,
      id: string

}

/**
 * Payment
 */
export interface IPayment {
      ride_id: string
      amount: number,
      password?: string,
}

export interface IPaymentQuerry extends IQuerry {
      driverId: string,
      customerId: string
      startDate?: DateTime
      endDate?: DateTime
}

export interface IComission {
      ride_id: string
      percentage: number,
      amount: number,
}
export interface IComissionQuerry extends IQuerry {
      driverId: string,
      rideId: string,
      startDate?: DateTime
      endDate?: DateTime
}