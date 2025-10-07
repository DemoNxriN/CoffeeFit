const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let isLoginMode = true;
let currentUser = null;

const themeToggle = document.getElementById('theme-toggle');
const themeMoonIcon = document.getElementById('theme-icon-moon');
const themeSunIcon = document.getElementById('theme-icon-sun');
const loginBtn = document.getElementById('login-btn');
const userMenu = document.getElementById('user-menu');
const userMenuBtn = document.getElementById('user-menu-btn');
const userDropdown = document.getElementById('user-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementById('close-modal');
const authForm = document.getElementById('auth-form');
const toggleFormBtn = document.getElementById('toggle-form');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const fullnameGroup = document.getElementById('fullname-group');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        themeMoonIcon.classList.add('hidden');
        themeSunIcon.classList.remove('hidden');
    } else {
        themeMoonIcon.classList.remove('hidden');
        themeSunIcon.classList.add('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
});

loginBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
    resetForm();
});

authModal.querySelector('.modal-overlay').addEventListener('click', () => {
    authModal.classList.add('hidden');
    resetForm();
});

userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

toggleFormBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    updateFormMode();
});

function updateFormMode() {
    if (isLoginMode) {
        modalTitle.textContent = 'Bienvenido de nuevo';
        modalSubtitle.textContent = 'Inicia sesión para continuar';
        fullnameGroup.classList.add('hidden');
        submitBtn.textContent = 'Iniciar Sesión';
        toggleFormBtn.textContent = '¿No tienes cuenta? Regístrate';
    } else {
        modalTitle.textContent = 'Crear cuenta';
        modalSubtitle.textContent = 'Regístrate para comenzar';
        fullnameGroup.classList.remove('hidden');
        submitBtn.textContent = 'Crear Cuenta';
        toggleFormBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
    }
    errorMessage.classList.add('hidden');
}

function resetForm() {
    authForm.reset();
    errorMessage.classList.add('hidden');
    isLoginMode = true;
    updateFormMode();
}

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullname = document.getElementById('fullname').value;

    errorMessage.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    try {
        if (isLoginMode) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                errorMessage.textContent = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
                errorMessage.classList.remove('hidden');
            } else {
                authModal.classList.add('hidden');
                resetForm();
            }
        } else {
            if (!fullname.trim()) {
                errorMessage.textContent = 'Por favor, ingresa tu nombre completo.';
                errorMessage.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Crear Cuenta';
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (error) {
                errorMessage.textContent = 'Error al crear la cuenta. El correo puede estar en uso.';
                errorMessage.classList.remove('hidden');
            } else if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullname
                });

                authModal.classList.add('hidden');
                resetForm();
            }
        }
    } catch (err) {
        errorMessage.textContent = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
        errorMessage.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta';
    }
});

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    userDropdown.classList.add('hidden');
});

function updateUI(user) {
    if (user) {
        currentUser = user;
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');

        const emailName = user.email.split('@')[0];
        userName.textContent = emailName;
        userEmail.textContent = user.email;
    } else {
        currentUser = null;
        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

supabase.auth.getSession().then(({ data: { session } }) => {
    updateUI(session?.user || null);
});

supabase.auth.onAuthStateChange((event, session) => {
    updateUI(session?.user || null);
});

initTheme();
