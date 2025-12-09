import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPostHog } from './lib/posthogService'

// Initialize PostHog analytics (respects Do Not Track)
initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
