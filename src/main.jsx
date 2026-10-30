import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/nunito';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import App from '@/App';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import '@/assets/css/tailwind.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PageErrorBoundary>
        <App />
      </PageErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
