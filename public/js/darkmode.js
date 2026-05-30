const STORAGE_KEY = 'theme';

(function applyThemeEarly() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    updateToggleIcon();
}

function updateToggleIcon() {
    const btn = document.getElementById('darkToggle');
    if (btn) btn.textContent = isDark() ? '☀️' : '🌙';
}

function injectToggleButton() {
    const nav = document.querySelector('.navBar nav');
    if (!nav || document.getElementById('darkToggle')) return;

    const sep = document.createElement('div');
    sep.className = 'separator';

    const btn = document.createElement('button');
    btn.id        = 'darkToggle';
    btn.className = 'darkToggle';
    btn.title     = 'Cambiar modo claro/oscuro';
    btn.textContent = isDark() ? '☀️' : '🌙';
    btn.addEventListener('click', () => setTheme(!isDark()));

    nav.appendChild(sep);
    nav.appendChild(btn);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggleButton);
} else {
    injectToggleButton();
}