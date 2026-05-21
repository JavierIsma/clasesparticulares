import {
  auth,
  signInWithEmailAndPassword
} from './firebase.js';


const form = document.getElementById('loginForm');

const message = document.getElementById('message');


form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const email = document.getElementById('email').value;

  const password = document.getElementById('password').value;

  message.innerText = 'Ingresando...';

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    message.innerText = 'Login correcto';

    setTimeout(() => {

      // MAIL DEL PROFESOR
const teacherEmail = "javierisma.sanchez@gmail.com";

if (email === teacherEmail) {

  window.location.href = 'teacher.html';

} else {

  window.location.href = 'dashboard.html';

}

    }, 1000);

  } catch (error) {

    message.innerText = error.message;

  }

});