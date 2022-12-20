/**
 * Config source: https://git.io/JY0mp
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import type { AuthConfig } from '@ioc:Adonis/Addons/Auth'

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const authConfig: AuthConfig = {
  guard: 'user',
  guards: {
    user: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'api_tokens',
        foreignKey: 'user_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/User'),
      },
    },
    driver: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'driver_tokens',
        foreignKey: 'driver_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['user'],
        model: () => import('App/Models/Driver'),
      },
    },
    customer: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'customer_tokens',
        foreignKey: 'customer_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email', 'phoneNumber'],
        model: () => import('App/Models/Customer'),
      },
    },
    agent: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'agent_tokens',
        foreignKey: 'agent_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['officeAddress'],
        model: () => import('App/Models/Agent'),
      },
    },
    customer_wallet: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'customer_wallet_tokens',
        foreignKey: 'customer_wallet_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['customerId'],
        model: () => import('App/Models/CustomerWallet'),
      },
    },
    agent_wallet: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'agent_wallet_tokens',
        foreignKey: 'agent_wallet_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['agentId'],
        model: () => import('App/Models/AgentWallet'),
      },
    },
    driver_wallet: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'driver_wallet_tokens',
        foreignKey: 'driver_wallet_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['driverId'],
        model: () => import('App/Models/DriverWallet'),
      },
    },
    agent_trans: {
      driver: 'oat',
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'agent_transaction_tokens',
        // foreignKey: 'driver_wallet_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['id'],
        model: () => import('App/Models/AgentTran'),
      },
    },
  },
}

export default authConfig
