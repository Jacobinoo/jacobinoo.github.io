import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {PostHogProvider} from "@posthog/react";

const options = {
    cookieless_mode: "always",
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    defaults: '2026-05-30',
} as const


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN} options={options}>
            <App />
      </PostHogProvider>
  </StrictMode>,
)
