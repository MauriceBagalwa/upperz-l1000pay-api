/**
 * Contract source: https://git.io/JOdz5
 *
 * Feel free to let us know via PR, if you find something broken in this
 * file.
 */

import Agent from 'App/Models/Agent'
import AgentTran from 'App/Models/AgentTran'
import AgentWallet from 'App/Models/AgentWallet'
import Customer from 'App/Models/Customer'
import CustomerWallet from 'App/Models/CustomerWallet'
import Driver from 'App/Models/Driver'
import DriverWallet from 'App/Models/DriverWallet'
import User from 'App/Models/User'

declare module '@ioc:Adonis/Addons/Auth' {
  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  |
  | The providers are used to fetch users. The Auth module comes pre-bundled
  | with two providers that are `Lucid` and `Database`. Both uses database
  | to fetch user details.
  |
  | You can also create and register your own custom providers.
  |
  */
  interface ProvidersList {
    /*
    |--------------------------------------------------------------------------
    | User Provider
    |--------------------------------------------------------------------------
    |
    | The following provider uses Lucid models as a driver for fetching user
    | details from the database for authentication.
    |
    | You can create multiple providers using the same underlying driver with
    | different Lucid models.
    |
    */
    user: {
      implementation: LucidProviderContract<typeof User>
      config: LucidProviderConfig<typeof User>
    }
    driver: {
      implementation: LucidProviderContract<typeof Driver>
      config: LucidProviderConfig<typeof Driver>
    }
    customer: {
      implementation: LucidProviderContract<typeof Customer>
      config: LucidProviderConfig<typeof Customer>
    }
    agent: {
      implementation: LucidProviderContract<typeof Agent>
      config: LucidProviderConfig<typeof Agent>
    }
    customer_wallet: {
      implementation: LucidProviderContract<typeof CustomerWallet>
      config: LucidProviderConfig<typeof CustomerWallet>
    }
    agent_wallet: {
      implementation: LucidProviderContract<typeof AgentWallet>
      config: LucidProviderConfig<typeof AgentWallet>
    }
    driver_wallet: {
      implementation: LucidProviderContract<typeof DriverWallet>
      config: LucidProviderConfig<typeof DriverWallet>
    }
    agent_trans: {
      implementation: LucidProviderContract<typeof AgentTran>
      config: LucidProviderConfig<typeof AgentTran>
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | The guards are used for authenticating users using different drivers.
  | The auth module comes with 3 different guards.
  |
  | - SessionGuardContract
  | - BasicAuthGuardContract
  | - OATGuardContract ( Opaque access token )
  |
  | Every guard needs a provider for looking up users from the database.
  |
  */
  interface GuardsList {
    /*
    |--------------------------------------------------------------------------
    | OAT Guard
    |--------------------------------------------------------------------------
    |
    | OAT, stands for (Opaque access tokens) guard uses database backed tokens
    | to authenticate requests.
    |
    */
    user: {
      implementation: OATGuardContract<'user', 'user'>
      config: OATGuardConfig<'user'>
      client: OATClientContract<'user'>
    }
    driver: {
      implementation: OATGuardContract<'driver', 'driver'>
      config: OATGuardConfig<'driver'>
      client: OATClientContract<'driver'>
    }
    customer: {
      implementation: OATGuardContract<'customer', 'customer'>
      config: OATGuardConfig<'customer'>
      client: OATClientContract<'customer'>
    }
    agent: {
      implementation: OATGuardContract<'agent', 'agent'>
      config: OATGuardConfig<'agent'>
      client: OATClientContract<'agent'>
    }
    customer_wallet: {
      implementation: OATGuardContract<'customer_wallet', 'customer_wallet'>
      config: OATGuardConfig<'customer_wallet'>
      client: OATClientContract<'customer_wallet'>
    }
    agent_wallet: {
      implementation: OATGuardContract<'agent_wallet', 'agent_wallet'>
      config: OATGuardConfig<'agent_wallet'>
      client: OATClientContract<'agent_wallet'>
    }
    driver_wallet: {
      implementation: OATGuardContract<'driver_wallet', 'driver_wallet'>
      config: OATGuardConfig<'driver_wallet'>
      client: OATClientContract<'driver_wallet'>
    }
    agent_trans: {
      implementation: OATGuardContract<'agent_trans', 'agent_trans'>
      config: OATGuardConfig<'agent_trans'>
      client: OATClientContract<'agent_trans'>
    }
  }
}
