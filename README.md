# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## PWA (Progressive Web App) Setup

This application is configured to be a Progressive Web App, installable on both Android and iOS devices.

### Configuration Details:

-   **Manifest:** The PWA settings are defined in `/public/manifest.json`.
-   **Icons:** All necessary app icons must be placed in the `/public/icons/` directory. The application is pre-configured to reference them.
-   **Metatags:** The main layout file (`src/app/layout.tsx`) includes all necessary `<link>` and `<meta>` tags for PWA functionality, including Apple Touch Icons for iOS devices.
