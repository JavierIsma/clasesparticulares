import {
    auth,
    db,
    createUserWithEmailAndPassword,
    setDoc,
    doc
  } from './firebase.js';
  
  const message = document.getElementById('message');
  const form = document.getElementById('registerForm');
  
  form.addEventListener('submit', async (e) => {
  
    e.preventDefault();
    message.innerText = 'Creando usuario...';
  
    const email = document.getElementById('email').value;
  
    const password = document.getElementById('password').value;
  
    const styles = [];
  
    document.querySelectorAll('input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        styles.push(checkbox.value);
      });
  
    try {
  
      // Crear usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const user = userCredential.user;
  
      // Guardar perfil en Firestore
      await setDoc(doc(db, "students", user.uid), {
  
        name: document.getElementById('name').value,
  
        age: document.getElementById('age').value,
  
        gender: document.getElementById('gender').value,
  
        experience: document.getElementById('experience').value,
  
        styles: styles,
  
        email: email
  
      });
  
      message.innerText = 'Usuario registrado correctamente';
  
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
  
    } catch (error) {
  
      alert(error.message);
  
    }
  
  });