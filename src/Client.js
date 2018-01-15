import axios from 'axios';

class Client {
  constructor() {
    console.log("NODE_ENV:", process.env.NODE_ENV)
    let baseURL = '';
    if (process.env.NODE_ENV === 'staging') {
      // TODO: remove staging address from client side code
      baseURL = 'lotto-staging.herokuapp.com';
    } else {
      baseURL = 'http://localhost:8080';
    }
    this.client = axios.create({
      baseURL: baseURL,
    });
  }

  setToken(token) {
    this.client.defaults.headers.Session = token;
  }

  ping() {
    return this.client.get('/ping');
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

  logout() {
    return this.client.delete('/logout');
  }

  login(username, password) {
    const obj = {username:username, password:password}
    return this.client.post('/login', obj);
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
