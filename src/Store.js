import { computed, observable } from 'mobx'
import cookie from 'react-cookies'

class Store {

  @observable me = {};
  @observable balance = 0;
  @observable btcPrice = {
    usd: 0,
  } ;

  @computed get logged_in() {
    return this.token !== null
  }

  @observable token = cookie.load('token') || null;
  @observable tokenEscalated = Date.parse(cookie.load('token_escalated')) || Date.now();
  @observable tokenExpire = Date.parse(cookie.load('token_expire')) || Date.now();

  // compute if we have escalated privileges 
  @computed get hasEscalation() {
    return this.tokenEscalated >= Date.now()
  }

}

// we set the store to window.store so we have access to the store in the
// console
let store = window.store = new Store()

export default store
