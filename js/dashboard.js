import {
    auth,
    db,
    signOut,
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs
  } from './firebase.js';
  
  import {
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  
  
  // ELEMENTOS
  const profileData = document.getElementById('profileData');
  
  const logoutBtn = document.getElementById('logoutBtn');
  
  const practiceForm = document.getElementById('practiceForm');
  
  const practiceList = document.getElementById('practiceList');
  
  const statsContainer =
    document.getElementById('statsContainer');
  
  
  let currentUser = null;
  
  
  // DETECTAR USUARIO
  onAuthStateChanged(auth, async (user) => {
  
    if (user) {
  
      currentUser = user;
  
      try {
  
        // PERFIL
        const docRef = doc(db, "students", user.uid);
  
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
  
          const student = docSnap.data();
  
          profileData.innerHTML = `
            <p><strong>Nombre:</strong> ${student.name}</p>
  
            <p><strong>Edad:</strong> ${student.age}</p>
  
            <p><strong>Sexo:</strong> ${student.gender}</p>
  
            <p><strong>Experiencia:</strong> ${student.experience}</p>
  
            <p><strong>Estilos:</strong> ${student.styles.join(', ')}</p>
  
            <p><strong>Email:</strong> ${student.email}</p>
          `;
  
        }
  
        // CARGAR PRÁCTICAS
        await loadPractices();
  
      } catch (error) {
  
        console.error(error);
  
      }
  
    } else {
  
      window.location.href = 'login.html';
  
    }
  
  });
  
  
  // GUARDAR PRÁCTICA
  practiceForm.addEventListener('submit', async (e) => {
  
    e.preventDefault();
  
    try {
  
      const videoLink =
        document.getElementById('videoLink').value;
  
      const practiceNotes =
        document.getElementById('practiceNotes').value;
  
      await addDoc(collection(db, "practices"), {
  
        userId: currentUser.uid,
  
        videoLink: videoLink,
  
        notes: practiceNotes,
  
        createdAt: new Date()
  
      });
  
      alert('Práctica guardada correctamente');
  
      practiceForm.reset();
  
      await loadPractices();
  
    } catch (error) {
  
      console.error(error);
  
    }
  
  });
  
  
  // CARGAR PRÁCTICAS
  async function loadPractices() {
  
    practiceList.innerHTML = '';
  
    const q = query(
      collection(db, "practices"),
      where("userId", "==", currentUser.uid)
    );
  
    const querySnapshot = await getDocs(q);
  
  
    // STATS
    let totalPrecision = 0;
    let totalDefinition = 0;
    let totalFluidity = 0;
    let totalAttitude = 0;
  
    let feedbackCount = 0;
  
  
    querySnapshot.forEach((doc) => {
  
      const practice = doc.data();
  
  
      // PROMEDIOS
      if (practice.precision) {
  
        totalPrecision += Number(practice.precision);
  
        totalDefinition += Number(practice.definition);
  
        totalFluidity += Number(practice.fluidity);
  
        totalAttitude += Number(practice.attitude);
  
        feedbackCount++;
  
      }
  
  
      // HTML PRÁCTICAS
      practiceList.innerHTML += `
  
        <div class="practice-item">
  
          <p>
            <strong>Video:</strong>
  
            <a href="${practice.videoLink}" target="_blank">
              Ver práctica
            </a>
          </p>
  
          <p>
            <strong>Notas:</strong>
            ${practice.notes}
          </p>
  
          <hr>
  
          <h3>Devolución profesor</h3>
  
          ${
            practice.teacherComment
            ? `
  
              <p>
                <strong>Precisión:</strong>
                ${practice.precision || '-'}
              </p>
  
              <p>
                <strong>Definición:</strong>
                ${practice.definition || '-'}
              </p>
  
              <p>
                <strong>Fluidez:</strong>
                ${practice.fluidity || '-'}
              </p>
  
              <p>
                <strong>Actitud:</strong>
                ${practice.attitude || '-'}
              </p>
  
              <p>
                <strong>Comentario:</strong>
                ${practice.teacherComment}
              </p>
              
  
              <p>
                <strong>Timestamps:</strong>
                <br>
                ${practice.timestamps || 'Sin timestamps'}
              </p>

              ${
  practice.teacherVideoFeedback
  ? `

    <div class="video-feedback">

      <h4>Devolución en video</h4>

      <iframe
  width="100%"
  height="315"
  src="${
    practice.teacherVideoFeedback
      .replace('/view?usp=sharing', '/preview')
  }"
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>

    </div>

  `
  : ''
}
  
            `
            : `
  
              <p>
                Todavía no hay devolución del profesor.
              </p>
  
            `
          }
  
        </div>
  
      `;
  
    });
  
  
    // MOSTRAR STATS
    if (feedbackCount > 0) {
  
      statsContainer.innerHTML = `
  
        <p>
          <strong>Precisión promedio:</strong>
          ${(totalPrecision / feedbackCount).toFixed(1)}
        </p>
  
        <p>
          <strong>Definición promedio:</strong>
          ${(totalDefinition / feedbackCount).toFixed(1)}
        </p>
  
        <p>
          <strong>Fluidez promedio:</strong>
          ${(totalFluidity / feedbackCount).toFixed(1)}
        </p>
  
        <p>
          <strong>Actitud promedio:</strong>
          ${(totalAttitude / feedbackCount).toFixed(1)}
        </p>
  
      `;
  
    } else {
  
      statsContainer.innerHTML = `
  
        <p>
          Todavía no hay suficientes correcciones.
        </p>
  
      `;
  
    }
  
  }
  
  
  // LOGOUT
  logoutBtn.addEventListener('click', async () => {
  
    try {
  
      await signOut(auth);
  
      window.location.href = 'login.html';
  
    } catch (error) {
  
      console.error(error);
  
    }
  
  });