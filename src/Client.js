import axios from 'axios';

class Client {
  constructor() {
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

  editAchievement(id, obj = {}) {
    return this.client.put('/achievements/' + id, obj);
  }

  listAchievements(params = {}) {
    return this.client.get('/achievements/', {params: params});
  }
}

var client = (window.client = new Client());
export default client;
