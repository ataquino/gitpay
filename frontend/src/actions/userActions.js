import api from '../consts'
import axios from 'axios'
import { addNotification } from './notificationActions'

const FETCH_USER_ACCOUNT_REQUESTED = 'FETCH_USER_ACCOUNT_REQUESTED'
const FETCH_USER_ACCOUNT_SUCCESS = 'FETCH_USER_ACCOUNT_SUCCESS'
const FETCH_USER_ACCOUNT_ERROR = 'FETCH_USER_ACCOUNT_ERROR'

const CREATE_USER_ACCOUNT_REQUESTED = 'CREATE_USER_ACCOUNT'
const CREATE_USER_ACCOUNT_SUCCESS = 'CREATE_USER_ACCOUNT_SUCCESS'
const CREATE_USER_ACCOUNT_ERROR = 'CREATE_USER_ACCOUNT_ERROR'

const UPDATE_USER_ACCOUNT_REQUESTED = 'UPDATE_USER_ACCOUNT_REQUESTED'
const UPDATE_USER_ACCOUNT_SUCCESS = 'UPDATE_USER_ACCOUNT_SUCCESS'
const UPDATE_USER_ACCOUNT_ERROR = 'UPDATE_USER_ACCOUNT_ERROR'

const UPDATE_USER_REQUESTED = 'UPDATE_USER_REQUESTED'
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR'

const CREATE_BANKACCOUNT_REQUESTED = 'CREATE_BANKACCOUNT_REQUESTED'
const CREATE_BANKACCOUNT_SUCCESS = 'CREATE_BANKACCOUNT_SUCCESS'
const CREATE_BANKACCOUNT_ERROR = 'CREATE_BANKACCOUNT_ERROR'

const GET_BANKACCOUNT_REQUESTED = 'GET_BANKACCOUNT_REQUESTED'
const GET_BANKACCOUNT_SUCCESS = 'GET_BANKACCOUNT_SUCCESS'
const GET_BANKACCOUNT_ERROR = 'GET_BANKACCOUNT_ERROR'

/*
 * Account fetch
 */

const fetchUserAccountRequested = () => {
  return { type: FETCH_USER_ACCOUNT_REQUESTED, completed: false }
}

const fetchUserAccountSuccess = account => {
  return {
    type: FETCH_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const fetchUserAccountError = error => {
  return { type: FETCH_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account create
 */

const createUserAccountRequested = () => {
  return { type: CREATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const createUserAccountSuccess = account => {
  return {
    type: CREATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createUserAccountError = error => {
  return { type: CREATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account update
 */

const updateUserAccountRequested = () => {
  return { type: UPDATE_USER_ACCOUNT_REQUESTED, completed: false }
}

const updateUserAccountSuccess = account => {
  return {
    type: UPDATE_USER_ACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const updateUserAccountError = error => {
  return { type: UPDATE_USER_ACCOUNT_ERROR, completed: true, error: error }
}

/*
 * User update
 */

const updateUserRequested = () => {
  return { type: UPDATE_USER_REQUESTED, completed: false }
}

const updateUserSuccess = user => {
  return {
    type: UPDATE_USER_SUCCESS,
    completed: true,
    data: user.data
  }
}

const updateUserError = error => {
  return { type: UPDATE_USER_ERROR, completed: true, error: error }
}

/*
 * Account bank get
 */

const getBankAccountRequested = () => {
  return { type: GET_BANKACCOUNT_REQUESTED, completed: false }
}

const getBankAccountSuccess = account => {
  return { type: GET_BANKACCOUNT_SUCCESS, completed: true, data: account.data }
}

const getBankAccountError = error => {
  return { type: GET_BANKACCOUNT_ERROR, completed: true, error: error }
}

/*
 * Account bank create
 */

const createBankAccountRequested = () => {
  return { type: CREATE_BANKACCOUNT_REQUESTED, completed: false }
}

const createBankAccountSuccess = account => {
  return {
    type: CREATE_BANKACCOUNT_SUCCESS,
    completed: true,
    data: account.data
  }
}

const createBankAccountError = error => {
  return { type: CREATE_BANKACCOUNT_ERROR, completed: true, error: error }
}

const fetchAccount = userId => {
  return (dispatch, getState) => {
    dispatch(fetchUserAccountRequested())
    return axios
      .get(api.API_URL + `/users/${userId}/account`)
      .then(account => {
        return dispatch(fetchUserAccountSuccess(account))
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log('fetch user account error', e)
        return dispatch(fetchUserAccountError(e))
      })
  }
}

const createAccount = userId => {
  return (dispatch, getState) => {
    dispatch(createUserAccountRequested())
    const accountId = getState().loggedIn.user.account_id
    if (accountId) {
      dispatch(addNotification('Já existe uma conta associada'))
      return dispatch(
        createUserAccountError({ message: 'Já existe uma conta associada' })
      )
    }
    axios
      .post(api.API_URL + '/user/account', {
        id: userId
      })
      .then(account => {
        dispatch(addNotification('Conta criada com sucesso'))
        return dispatch(createUserAccountSuccess(account))
      })
      .catch(error => {
        dispatch(addNotification('Não foi possível criar a conta, por favor tente novamente mais tarde.'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createUserAccountError(error))
      })
  }
}

const updateAccount = (userId, accountData) => {
  return (dispatch, getState) => {
    dispatch(updateUserAccountRequested())
    axios
      .put(api.API_URL + '/user/account', {
        id: userId,
        account: accountData
      })
      .then(account => {
        dispatch(addNotification('Conta atualizada com sucesso'))
        // dispatch(fetchAccount());
        return dispatch(updateUserAccountSuccess(account))
      })
      .catch(error => {
        dispatch(
          addNotification(
            'Não foi possível atualizar sua conta. Você preencheu todos os dados?'
          )
        )
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(updateUserAccountError(error))
      })
  }
}

const updateUser = (userId, userData) => {
  return (dispatch, getState) => {
    dispatch(updateUserRequested())
    axios
      .put(api.API_URL + '/user/update', {
        ...userData, id: userId
      })
      .then(user => {
        dispatch(addNotification('Conta atualizada com sucesso'))
        // dispatch(fetchAccount());
        return dispatch(updateUserSuccess(user))
      })
      .catch(error => {
        dispatch(
          addNotification(
            'Não foi possível atualizar sua conta. Você preencheu todos os dados?'
          )
        )
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(updateUserError(error))
      })
  }
}

const getBankAccount = userId => {
  return (dispatch, getState) => {
    dispatch(getBankAccountRequested())
    axios
      .get(`${api.API_URL}/users/${userId}/bank_accounts`)
      .then(bankAccount => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('Não foi possível obter sua conta bancária'))
          return dispatch(getBankAccountError(bankAccount.data))
        }
        return dispatch(getBankAccountSuccess(bankAccount))
      })
      .catch(error => {
        dispatch(addNotification('Não foi possível atualizar sua conta'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(getBankAccountError(error))
      })
  }
}

const createBankAccount = (userId, bank) => {
  return (dispatch, getState) => {
    dispatch(createBankAccountRequested())
    axios
      .post(api.API_URL + '/user/bank_accounts', {
        id: userId,
        routing_number: bank.routing_number,
        account_number: bank.account_number
      })
      .then(bankAccount => {
        if (bankAccount.data.statusCode === 400) {
          dispatch(addNotification('Não foi possível atualizar sua conta'))
          return dispatch(createBankAccountError(bankAccount.data))
        }
        dispatch(addNotification('Conta bancária cadastrada com sucesso'))

        return dispatch(createBankAccountSuccess(bankAccount))
      })
      .catch(error => {
        dispatch(addNotification('Não foi possível atualizar sua conta'))
        // eslint-disable-next-line no-console
        console.log('error on create account', error)
        return dispatch(createBankAccountError(error))
      })
  }
}

export {
  FETCH_USER_ACCOUNT_REQUESTED,
  FETCH_USER_ACCOUNT_SUCCESS,
  FETCH_USER_ACCOUNT_ERROR,
  CREATE_USER_ACCOUNT_REQUESTED,
  CREATE_USER_ACCOUNT_SUCCESS,
  CREATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_ACCOUNT_REQUESTED,
  UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_ERROR,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  GET_BANKACCOUNT_REQUESTED,
  GET_BANKACCOUNT_SUCCESS,
  GET_BANKACCOUNT_ERROR,
  CREATE_BANKACCOUNT_REQUESTED,
  CREATE_BANKACCOUNT_SUCCESS,
  CREATE_BANKACCOUNT_ERROR,
  fetchAccount,
  createAccount,
  updateAccount,
  updateUser,
  createBankAccount,
  getBankAccount
}
