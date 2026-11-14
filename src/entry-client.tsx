import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import './styles/index.css';

const root = document.getElementById('root');

if (root) {
  const tree = (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
  // Prerendered pages hydrate; the dev server renders from scratch. Check for an
  // element, not any node: the dev index.html holds only the <!--app-html--> comment.
  if (root.firstElementChild) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}
