requireAuth();      
renderNavbar();     
showUsername();
if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}

function showTab(tab) {
  document.getElementById('login-section').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-section').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    window.location.href = 'dashboard.html'; // ← ربط للـ dashboard
  } catch (err) {
    document.getElementById('login-error').textContent = 'Email ou mot de passe incorrect';
  }
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const res = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    window.location.href = 'dashboard.html'; // ← ربط للـ dashboard
  } catch (err) {
    document.getElementById('reg-error').textContent = 'Erreur lors de l\'inscription';
  }
}