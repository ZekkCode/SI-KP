<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'SI-KP Teknik Informatika') }}</title>

        <!-- Favicon Logo Teknik Informatika -->
        <link rel="icon" type="image/png" href="/images/tekfor-logo.png">
        <link rel="shortcut icon" type="image/png" href="/images/tekfor-logo.png">
        <link rel="apple-touch-icon" href="/images/tekfor-logo.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead

        <!-- Critical Splash Screen Styles (Zero Latency & No White Flash) -->
        <style>
            html, body {
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
            }
            #app-splash-screen {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #f8fafc;
                font-family: 'Figtree', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 1.5rem;
                transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s;
            }
            #app-splash-screen.splash-hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: scale(1.02);
            }
            .splash-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                padding: 2.25rem 2rem;
                box-shadow: 0 10px 25px -5px rgba(0, 40, 142, 0.07), 0 8px 10px -6px rgba(0, 40, 142, 0.04);
                max-width: 360px;
                width: 90%;
                animation: splash-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .splash-logo-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 76px;
                height: 76px;
                margin-bottom: 1.25rem;
                border-radius: 0.875rem;
                background: #f0f4ff;
                border: 1px solid #dde5ff;
                padding: 0.75rem;
            }
            .splash-logo {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 2px 4px rgba(0, 40, 142, 0.1));
            }
            .splash-title {
                color: #00288e;
                font-size: 1.0625rem;
                font-weight: 700;
                letter-spacing: -0.01em;
                line-height: 1.25;
                margin: 0;
            }
            .splash-subtitle {
                color: #64748b;
                font-size: 0.8125rem;
                font-weight: 500;
                margin: 0.375rem 0 0 0;
                line-height: 1.35;
            }
            .splash-progress-track {
                position: relative;
                width: 190px;
                max-width: 100%;
                height: 4px;
                background: #e2e8f0;
                border-radius: 9999px;
                overflow: hidden;
                margin-top: 1.5rem;
            }
            .splash-progress-bar {
                position: absolute;
                top: 0;
                bottom: 0;
                background: linear-gradient(90deg, #00288e 0%, #2563eb 50%, #00288e 100%);
                border-radius: 9999px;
                animation: splash-progress 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .splash-status {
                color: #94a3b8;
                font-size: 0.6875rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                margin-top: 0.75rem;
                text-transform: uppercase;
            }
            @keyframes splash-enter {
                0% {
                    opacity: 0;
                    transform: scale(0.92) translateY(6px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            @keyframes splash-progress {
                0% {
                    left: -40%;
                    width: 40%;
                }
                50% {
                    left: 25%;
                    width: 55%;
                }
                100% {
                    left: 100%;
                    width: 40%;
                }
            }
        </style>
    </head>
    <body class="font-sans antialiased" style="background-color: #f8fafc;">
        <!-- Entrance Splash Screen (Tekfor Logo & Smooth Loading Bar) -->
        <div id="app-splash-screen" aria-hidden="true">
            <div class="splash-card">
                <div class="splash-logo-wrapper">
                    <img 
                        src="/images/tekfor-logo.png" 
                        alt="Logo Teknik Informatika" 
                        class="splash-logo"
                    />
                </div>
                <h1 class="splash-title">SI-KP • TEKNIK INFORMATIKA</h1>
                <p class="splash-subtitle">Universitas Trunojoyo Madura</p>
                <div class="splash-progress-track">
                    <div class="splash-progress-bar"></div>
                </div>
                <span class="splash-status">Memuat Portal...</span>
            </div>
        </div>

        <script>
            // Safety timeout to ensure splash screen is never stuck
            window.addEventListener('load', function() {
                setTimeout(function() {
                    var splash = document.getElementById('app-splash-screen');
                    if (splash && !splash.classList.contains('splash-hidden')) {
                        splash.classList.add('splash-hidden');
                        setTimeout(function() {
                            if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
                        }, 450);
                    }
                }, 3500);
            });
        </script>

        @inertia
    </body>
</html>
