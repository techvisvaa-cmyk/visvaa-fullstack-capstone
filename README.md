# Project 5 — NOVA Full-Stack Deployment & Project Architecture

A polished, responsive e-commerce product catalog capstone built with modular HTML, CSS, and vanilla JavaScript. It demonstrates client-side routing, reusable components, product filtering, persistent cart state, and deployment-ready static architecture.

## Features
- Modular JavaScript ES modules (`data`, `components`, and application/router).
- Client-side hash routing for Home, Shop, Our Story, and Cart.
- Responsive layouts using CSS Grid and Flexbox.
- Product search, category filters, and sorting by price/name.
- Add-to-cart, quantity updates, remove items, and subtotal/shipping calculation.
- `localStorage` persistence for cart contents.
- Accessible labels, keyboard focus states, live status/toast feedback, and reduced-motion support.
- Lightweight CSS illustrations and emoji product art; no large image assets or build step required.
- Mobile navigation and responsive design.

## Run locally
Because the JavaScript uses ES modules, run this project through a local server instead of opening `index.html` as a `file://` URL.

**VS Code / Live Server**
1. Extract the ZIP.
2. Open the `Project_5_Full_Stack_Capstone` folder in VS Code.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

No API key, package install, or backend server is required. This is a front-end capstone storefront with a demo checkout, not a real payment system.

## Deploy to GitHub Pages
1. Create a public GitHub repository, e.g. `visvaa-fullstack-capstone`.
2. Push the contents of this folder to the repository's `main` branch.
3. In the repository, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
5. Wait for the Pages URL to appear. The app uses relative file paths and hash routing, so it is suitable for a repository subpath.

You can also deploy to Netlify or Vercel by importing the GitHub repository. Use the project root as the publish directory; no build command is required.

## Project structure
```text
Project_5_Full_Stack_Capstone/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── data/
    │   └── products.js
    └── components/
        └── productCard.js
```

## Customization
- Edit product details in `js/data/products.js`.
- Adjust design tokens at the top of `css/styles.css`.
- Update branding, descriptions, and contact details in `index.html`.

## Important
This is a demonstration catalog. Product data is sample data, and checkout does not process orders or payments. A production e-commerce deployment would require a secure backend, real inventory/pricing, authentication as needed, and a payment provider.
