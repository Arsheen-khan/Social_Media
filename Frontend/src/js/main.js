// Main entry point
import { isAuthenticated } from './js/auth.js';
import { createLoginPage } from './pages/Login.js';
import { createRegisterPage } from './pages/Register.js';
import { createHomePage } from './pages/Home.js';
import { createUploadPage } from './pages/Upload.js';
import { createChatPage } from './pages/Chat.js';
import { createProfilePage } from './pages/Profile.js';

const app = document.querySelector('#app');

function renderPage(page) {
    app.innerHTML = '';
    let pageElement;

    switch (page) {
        case 'login':
            pageElement = createLoginPage();
            break;
        case 'register':
            pageElement = createRegisterPage();
            break;
        case 'home':
            if (!isAuthenticated()) {
                window.location.hash = '#login';
                return;
            }
            pageElement = createHomePage();
            break;
        case 'create':
            if (!isAuthenticated()) {
                window.location.hash = '#login';
                return;
            }
            pageElement = createUploadPage();
            break;
        case 'chat':
            if (!isAuthenticated()) {
                window.location.hash = '#login';
                return;
            }
            pageElement = createChatPage();
            break;
        case 'profile':
            if (!isAuthenticated()) {
                window.location.hash = '#login';
                return;
            }
            pageElement = createProfilePage();
            break;
        default:
            if (isAuthenticated()) {
                window.location.hash = '#home';
            } else {
                window.location.hash = '#login';
            }
            return;
    }

    app.appendChild(pageElement);
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    renderPage(hash);
}

// Initial render
window.addEventListener('hashchange', handleRoute);
handleRoute();
