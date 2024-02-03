import Router from 'next/router';
import {writeStorage} from '@rehooks/local-storage';
import axios from 'axios';

export default function Login() {
  return (
    <>
      <form onSubmit={(e) => {
          e.preventDefault();
          axios.post('/api/auth/login', {
            username: e.target.username.value,
            password: e.target.password.value,
          })
          .then(response => {
              
              switch(response.status){
                case 200:
                  return response.data;
                case 401:
                  return Promise.reject(alert("wrong password"));
                default: 
                  return Promise.reject(alert("server error"));
              }
            }).then(data => {
              writeStorage("jwt",data.token);
              Router.push('/');
            }).catch(error => alert('Error! ' + error.message))
          }}>
          <label>Username: </label>
          <input type="text" name="username"></input>
          <br/>
          <label>Password: </label>
          <input type="password" name="password"></input>
          <br/>
          <button type="submit">Login</button>
        </form>
    </>
  )
}
