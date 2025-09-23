# Corgis: Short Legs, Big Hearts 🐕

An interactive single-page website celebrating everything corgi! Built with React, TypeScript, and lots of love for these adorable short-legged companions.

## Features

- **Comprehensive GA4 Tracking**: Every meaningful interaction sends custom events to Google Analytics 4
- **Interactive Elements**: Like buttons, bark sounds, treat counter, quiz, name generator, and more
- **Debug Panel**: Real-time event tracking display (auto-enabled with `?debug=1`)
- **Responsive Design**: Beautiful on all devices with corgi-themed design system
- **Keyboard Shortcuts**: Press `B` to bark, `T` for treats, `G` to generate names
- **Idle Detection**: Gentle nudges if you've been inactive for 20 seconds

## GA4 Setup

1. Replace `G-XXXXXXX` in `index.html` with your actual Google Analytics 4 tracking ID
2. All events use the `corgi_*` namespace with descriptive parameters
3. Enable debug mode by adding `?debug=1` to the URL to see live event tracking

## Event Tracking

The site tracks numerous interactions including:

- Button clicks (`corgi_cta_click`, `corgi_bark_click`, etc.)
- Accordion toggles (`corgi_accordion_toggle`)
- Gallery interactions (`corgi_gallery_filter`, `corgi_modal_open`)
- Quiz completion (`corgi_quiz_complete`)
- Scroll depth milestones (`scroll_depth`)
- Keyboard shortcuts (`corgi_keyboard_shortcut`)
- And many more!

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:8080` and add `?debug=1` to see GA events in real-time!

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** with custom corgi-themed design system
- **Vite** for fast development
- **Shadcn/ui** components
- **Google Analytics 4** with gtag.js

## Interactive Features

- **Hero Section**: CTA buttons with smooth scrolling
- **Pros/Cons**: Like buttons and accordion sections
- **Gallery**: Filtering and lightbox modal with carousel
- **Quiz**: Multi-step quiz with social sharing
- **Name Generator**: Random corgi name creation
- **Treat Counter**: Milestone celebrations with confetti
- **Newsletter**: Fake signup with success states
- **Keyboard Shortcuts**: Hidden productivity features

Built with ❤️ for corgi enthusiasts everywhere!
