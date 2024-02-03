import Router from 'next/router';
import axios from 'axios';

export default function Register() {
  return (
    <>
      <form onSubmit={(e) => {
            e.preventDefault();
            axios.post('/api/auth/signup', {
              username: e.target.username.value,
              password: e.target.password.value,
            })
            .then(() => {
              Router.push('/login');
            }).catch(error => alert('Error! ' + error.message))
          }}>
          <label>Username: </label>
          <input type="text" name="username"></input>
          <br/>
          <label>Password: </label>
          <input type="password" name="password"></input>
          <br/>
          <button type="submit">Register</button>
        </form>
    </>
  )
}
