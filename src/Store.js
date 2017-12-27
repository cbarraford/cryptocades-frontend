import { computed, observable } from 'mobx'
import cookie from 'react-cookies'

class Store {

  @observable me = {};

  @computed get logged_in() {
    return this.token !== null
  }

  @observable token = cookie.load('token') || null;
}

// we set the store to window.store so we have access to the store in the
// console
let store = window.store = new Store()

export default store
