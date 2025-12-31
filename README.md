# FE Wellness - Demo Application

A proof of concept application built with Svelte and Bootstrap, demonstrating modern web development practices.

## Tech Stack

- **Svelte 4.2** - Reactive frontend framework
- **Vite 5.0** - Fast build tool and dev server
- **Bootstrap 5.3** - CSS framework for responsive design
- **Sveltestrap 6.2** - Bootstrap 5 components for Svelte
- **svelte-spa-router** - Simple client-side routing

## Project Structure

```
FE-wellness/
├── public/              # Static assets
├── src/
│   ├── lib/
│   │   └── components/  # Reusable components
│   │       ├── Header.svelte
│   │       ├── Footer.svelte
│   │       └── Card.svelte
│   ├── routes/          # Page components
│   │   ├── Home.svelte
│   │   └── About.svelte
│   ├── App.svelte       # Root component with router
│   ├── main.js          # Application entry point
│   └── app.css          # Global styles
├── index.html           # HTML template
├── package.json
├── vite.config.js
└── svelte.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features

- ✅ Component-based architecture
- ✅ Responsive design with Bootstrap
- ✅ Client-side routing
- ✅ Reusable UI components
- ✅ Fast development with Vite HMR
- ✅ Modern JavaScript (ES modules)

## Components

### Header
Navigation bar with responsive menu using Sveltestrap Navbar component.

### Footer
Simple footer with copyright information.

### Card
Reusable card component with customizable title, text, and button.

## Routes

- `/` - Home page with feature cards
- `/about` - About page with project information

## Customization

### Adding New Routes

1. Create a new component in `src/routes/`
2. Import it in `src/App.svelte`
3. Add it to the `routes` object

### Styling

- Global styles: `src/app.css`
- Component-specific styles: Use `<style>` blocks in `.svelte` files
- Bootstrap utilities: Use Bootstrap classes throughout components

## License

MIT

