<!-- PROJECT SHIELDS -->
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <br />
  <br />
  <h1 align="center">🌸 Artisan Bloom</h1>
  <p align="center">
    A premium, modern e-commerce web application engineered for handcrafted artisan gifts.
    <br />
    <br />
    <a href="#-getting-started"><strong>Explore the setup »</strong></a>
    <br />
    <br />
  </p>
</div>

<details open>
  <summary><b>Table of Contents</b></summary>
  <ol>
    <li><a href="#-about-the-project">About The Project</a></li>
    <li><a href="#-interactive-features">Interactive Features</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-application-structure">Application Structure</a></li>
  </ol>
</details>

---

## 📖 About The Project

**Artisan Bloom** is a comprehensive showcase of modern frontend capabilities. The objective of this project is to provide a visually striking, fluid, and highly interactive shopping experience that feels like a premium SaaS product. It leverages modern CSS approaches, complex state management, and strict responsive constraints.

### Built With:
* [React 18](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Zustand](https://github.com/pmndrs/zustand)

---

## ✨ Interactive Features

Click the sections below to expand and learn more about the technical implementations!

<details>
<summary><b>🎨 Physics-Based Animations (Framer Motion)</b></summary>

- **Custom Preloader**: Features an intricate SVG drawing mechanism and staggered typography reveals on initial boot.
- **Page Transitions**: Custom 3D perspective "flipboard" effects wrap all router navigation.
- **Micro-Interactions**: Product cards utilize spring physics to achieve realistic 3D 1-degree tilts, simulated lift (`y: -10px`), and deepening drop-shadows on cursor hover.

</details>

<details>
<summary><b>📱 Mobile Optimization & Constraints</b></summary>

- **Right-Sliding Drawer**: The navbar intuitively collapses into a full-height `100dvh` interactive sliding side panel bound by click-blocking overlays.
- **Accessible Touch Targets**: Every button natively expands (`min-h-[44px]`) on sub-768px viewports to adhere strictly to mobile accessibility guidelines.
- **Swipe Functionality**: Horizontal grid-snapping (`snap-x`, `snap-mandatory`) is utilized for "Shop by Vibe" modules, preserving valuable vertical footprint on mobile screens.

</details>

<details>
<summary><b>💳 Dynamic E-Commerce Flow</b></summary>

- **Adaptive Checkout**: Payment input fields organically scale and reveal based on the active payment mode selection (*VISA, UPI, GPay, Cash on Delivery*).
- **Global State**: Entire Cart logic—add, remove, amend quantities—persists safely using **Zustand**.
- **User Orders History**: Successful cart conversions are ported directly into an interactive "My Orders" ledger imitating a fully deployed transactional pipeline.

</details>

---

## 🚀 Getting Started

Follow these steps to launch Artisan Bloom locally on your machine.

### Prerequisites

Ensure you have Node.js and NPM installed globally.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository to your local machine.
2. Navigate into the project directory:
   ```sh
   cd Artisan_Bloom
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Start the Vite development server:
   ```sh
   npm run dev
   ```
5. Open your browser and visit: `http://localhost:5173/`

---

## 📂 Application Structure

An overview of where the most critical parts of the application live:

- 📁 `src/components/layout`: Houses the `Navbar`, `Preloader`, and `PageTransition` wrappers.
- 📁 `src/components/shop`: Modular components like `ProductCard` and `CategoryCard`.
- 📁 `src/pages`: Top-level routes for `Home`, `Collection`, `Cart`, `Checkout`, `Orders`, and `Auth`.
- 📁 `src/store`: Zustand hooks managing global variables (`useCartStore`, `useAuthStore`, `useOrderStore`).

---
<div align="center">
  <i>Created dynamically with care.</i>
</div>
