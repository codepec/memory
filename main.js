// Beispiel: main.js

document.addEventListener('DOMContentLoaded', () => {
    // Deine Initialisierungslogik hier
    // ...

    // Registrierung des Service Workers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registriert mit der folgenden Scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker Registrierung fehlgeschlagen:', error);
                });
        });
    }
});
