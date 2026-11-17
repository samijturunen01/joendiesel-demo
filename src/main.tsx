import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/saira/standard.css';
import '@fontsource-variable/martian-mono/wght.css';
import '@fontsource/im-fell-english-sc/400.css';
import { App } from './App';
import './styles/index.css';

declare global {
  interface Window {
    __jdFailsafe?: number;
  }
}

const container = document.getElementById('root') as HTMLElement;
// "/joendiesel-demo/" -> "/joendiesel-demo"; "/" -> undefined
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The bundle arrived – cancel the "show everything" failsafe set in index.html.
window.clearTimeout(window.__jdFailsafe);

// Production pages are prerendered and hydrated; the dev server starts from an empty root.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
