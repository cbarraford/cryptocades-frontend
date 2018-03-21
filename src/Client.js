import axios from 'axios';
import toastr from 'toastr'

class Client {
  constructor() {
    let baseURL = '';
    if (process.env.NODE_ENV === 'staging') {
      // TODO: remove staging address from client side code
      baseURL = 'https://staging-api.cryptocades.com';
    } else if (process.env.NODE_ENV === 'production') {
      // TODO: remove prod address from client side code
      baseURL = 'https://api.cryptocades.com';
    } else {
      baseURL = 'http://localhost:8080';
    }
    this.client = axios.create({
      baseURL: baseURL,
    });
  }

  handleError(error, title) {
    var message = error.message
    if (error.response !== undefined) {
      message = error.response.data.message
    }
    toastr.error(message, title)
  }

  setToken(token) {
    this.client.defaults.headers.Session = token;
  }

  ping() {
    return this.client.get('/ping');
  }

  btcPrice() {
    return this.client.get('/currency/price/btc')
  }

  // gets the user info the for currently signed in user
  me() {
    return this.client.get('/me');
  }

  updateMe(obj) {
    return this.client.put('/me', obj)
  }

  updateEmail(obj) {
    return this.client.put('/me/email', obj)
  }

  // gets the current balance of the currently signed in user
  balance() {
    return this.client.get('/me/balance');
  }

  myentries() {
    return this.client.get('/me/entries');
  }

  myincomes() {
    return this.client.get('/me/incomes');
  }
  
  myboosts() {
    return this.client.get('/me/boosts');
  }
  
  asignboost(boost_id, income_id) {
    const obj = {boost_id, income_id}
    return this.client.PUT('/me/boosts', obj);
  }

  myrank() {
    return this.client.get('/me/incomes/rank');
  }

  logout() {
    return this.client.delete('/logout');
  }

  login(username, password) {
    const obj = {username:username, password:password}
    return this.client.post('/login', obj);
  }

  facebookLogin(obj) {
    return this.client.post('/login/facebook', obj);
  }

  confirmation(code) {
    return this.client.post('/users/confirmation/' + code);
  }

  password_reset(email) {
    const obj = {email: email}
    return this.client.post('/users/password_reset', obj);
  }

  password_new(code, password) {
    const obj = {password: password}
    return this.client.post('/users/password_reset/' + code, obj);
  }

  signup(obj = {}) {
    return this.client.post('/users', obj);
  }

  listJackpots() {
    return this.client.get('/jackpots/');
  }

  jackpotOdds(id) {
    return this.client.get('/jackpots/' + id + '/odds')
  }

  jackpotEnter(id, amount) {
    const obj = {amount: amount}
    return this.client.post('/jackpots/' + id + '/enter', obj)
  }

  listGames() {
    return this.client.get('/games');
  }
}

var client = (window.client = new Client());
export default client;
