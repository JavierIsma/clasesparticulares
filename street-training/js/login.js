const form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const styles = [];

  document.querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      styles.push(checkbox.value);
    });

  const studentData = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    experience: document.getElementById('experience').value,
    styles: styles
  };

  localStorage.setItem('studentData', JSON.stringify(studentData));

  window.location.href = 'dashboard.html';
});