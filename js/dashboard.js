const profileData = document.getElementById('profileData');
const practiceForm = document.getElementById('practiceForm');
const practiceList = document.getElementById('practiceList');

const student = JSON.parse(localStorage.getItem('studentData'));

if(student) {
  profileData.innerHTML = `
    <p><strong>Nombre:</strong> ${student.name}</p>
    <p><strong>Edad:</strong> ${student.age}</p>
    <p><strong>Sexo:</strong> ${student.gender}</p>
    <p><strong>Experiencia:</strong> ${student.experience}</p>
    <p><strong>Estilos:</strong> ${student.styles.join(', ')}</p>
  `;
}

let practices = JSON.parse(localStorage.getItem('practices')) || [];

function renderPractices() {

  practiceList.innerHTML = '';

  practices.forEach((practice) => {

    practiceList.innerHTML += `
      <div class="practice-item">
        <p>
          <strong>Video:</strong>
          <a href="${practice.link}" target="_blank">
            Ver práctica
          </a>
        </p>

        <p>
          <strong>Notas:</strong>
          ${practice.notes}
        </p>
      </div>
    `;
  });
}

renderPractices();

practiceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPractice = {
    link: document.getElementById('videoLink').value,
    notes: document.getElementById('practiceNotes').value
  };

  practices.push(newPractice);

  localStorage.setItem('practices', JSON.stringify(practices));

  renderPractices();

  practiceForm.reset();
});