import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);

        // Smoothly dismiss the initial entrance splash screen
        const dismissSplash = () => {
            const splash = document.getElementById('app-splash-screen');
            if (splash && !splash.classList.contains('splash-hidden')) {
                splash.classList.add('splash-hidden');
                setTimeout(() => {
                    if (splash.parentNode) {
                        splash.parentNode.removeChild(splash);
                    }
                }, 450);
            }
        };

        // Allow entrance animation and loading bar to gracefully present before transitioning
        if (document.readyState === 'complete') {
            setTimeout(dismissSplash, 400);
        } else {
            window.addEventListener('load', () => setTimeout(dismissSplash, 350));
            setTimeout(dismissSplash, 1200);
        }
    },
    progress: {
        color: '#00288e',
    },
});
