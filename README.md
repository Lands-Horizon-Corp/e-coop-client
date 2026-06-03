# 🏪 E-Coop Client

**E-Coop Client** is the frontend application for a comprehensive financial cooperative management system. This modern web application provides an intuitive interface for managing cooperative financial institutions, including account management, transaction processing, and organizational tools.

## 🚀 Features

- **Account Management** - Comprehensive member account handling
- **Transaction Processing** - Real-time financial transaction management
- **Organizational Tools** - Administrative and operational utilities
- **Modern UI/UX** - Built with React 19 and modern web technologies
- **Type Safety** - Full TypeScript support with Zod validation
- **Fast Development** - Powered by Rsbuild for optimal performance

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version automatically detected via `.nvmrc`)
- **NVM** (Node Version Manager)
- **Bun** (JavaScript runtime and package manager)
- **Git**

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Lands-Horizon-Corp/e-coop-client.git
cd e-coop-client
```

### 2. Setup Node Version

The project uses NVM to manage Node.js versions. Use the version specified in `.nvmrc`:

```bash
nvm use
```

### 3. Install Bun (if not already installed)

If you don't have Bun installed globally:

```bash
curl -fsSL https://bun.sh/install | bash
# or
npm install -g bun
```

### 4. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configuration values.

### 5. Install Dependencies

Install project dependencies using Bun:

```bash
bun install
```

## 🚀 Development

Start the development server:

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Build & Deployment

### Production Build

Build the application for production:

```bash
bun run build
```

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

### Pre-deployment Check

Before pushing changes, run the deployment check to ensure everything is working correctly:

```bash
bun run deploy
```

This command will validate your build and run necessary checks before deployment.

## 📦 Package Manager

This project exclusively uses **Bun** as the package manager. Please do not use npm, yarn, or pnpm to maintain consistency and avoid dependency conflicts.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run `bun run deploy` to check your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📚 Learn More

### E-Coop Ecosystem

- **[E-Coop Server](https://github.com/Lands-Horizon-Corp/e-coop-server)** - Backend API server built with Go
- **[E-Coop Client](https://github.com/Lands-Horizon-Corp/e-coop-client)** - Frontend application (this repository)

### Technologies

- **[React 19](https://reactjs.org)** - Latest React framework with modern features
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript development
- **[Zod](https://zod.dev)** - TypeScript-first schema validation
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization for React
- **[React Hook Form](https://react-hook-form.com)** - Performant, flexible forms with easy validation
- **[Shadcn/ui](https://ui.shadcn.com)** - Re-usable components built with Radix UI and Tailwind CSS
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Bun](https://bun.sh)** - JavaScript runtime and package manager

---

**E-Coop** - Empowering cooperatives through modern technology 🌟

```
e-coop-client
├─ .bunfig.toml
├─ .dockerignore
├─ .npmrc
├─ .nvmrc
├─ .package-manager
├─ .prettierignore
├─ .prettierrc
├─ .railwayignore
├─ README.md
├─ bun.lock
├─ components.json
├─ eslint.config.js
├─ index.html
├─ knip.json
├─ netlify.toml
├─ package.json
├─ plop-templates
│  ├─ module-index.hbs
│  ├─ service.hbs
│  ├─ types.hbs
│  └─ validation.hbs
├─ plopfile.mjs
├─ postcss.config.mjs
├─ public
│  ├─ audio
│  │  └─ respect-++.mp3
│  ├─ auth-bg.webp
│  ├─ e-coop-logo-1.webp
│  ├─ e-coop-logo-black.webp
│  ├─ e-coop-logo-white.webp
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ Gilroy-Bold.woff
│  │  ├─ Gilroy-Heavy.woff
│  │  ├─ Gilroy-Light.woff
│  │  ├─ Gilroy-Medium.woff
│  │  └─ Gilroy-Regular.woff
│  ├─ manifest.json
│  ├─ og-image.png
│  ├─ pictures
│  │  ├─ go-up.png
│  │  ├─ home
│  │  │  ├─ api-poster.png
│  │  │  ├─ api.png
│  │  │  ├─ bank-poster.png
│  │  │  ├─ dashboard.svg
│  │  │  ├─ membership-poster.png
│  │  │  ├─ membership.png
│  │  │  ├─ poster.png
│  │  │  ├─ reduce-cost.svg
│  │  │  ├─ save-time.svg
│  │  │  ├─ security.svg
│  │  │  ├─ software.png
│  │  │  ├─ trade.png
│  │  │  └─ transaction.png
│  │  ├─ icons
│  │  │  ├─ bank.svg
│  │  │  ├─ borrow.svg
│  │  │  ├─ cpu.svg
│  │  │  ├─ graph.svg
│  │  │  ├─ money.svg
│  │  │  ├─ security.svg
│  │  │  ├─ storage.svg
│  │  │  └─ wallet.svg
│  │  └─ team
│  │     ├─ danilo.webp
│  │     ├─ jerbee.webp
│  │     ├─ nelma.webp
│  │     ├─ rojan.webp
│  │     ├─ vpsanty.webp
│  │     └─ zalven.webp
│  ├─ profile-cover-dark.png
│  ├─ profile-cover-light.png
│  ├─ qr-template.webp
│  ├─ reports
│  │  ├─ account-history
│  │  │  ├─ ah-A5.hbs
│  │  │  ├─ ah-bankbook.hbs
│  │  │  ├─ ah-responsive.hbs
│  │  │  └─ ah-statement.hbs
│  │  ├─ balance-sheet
│  │  │  ├─ balance-sheet.hbs
│  │  │  ├─ bs-A5.hbs
│  │  │  ├─ bs-bankbook.hbs
│  │  │  └─ bs-statement.hbs
│  │  ├─ bank
│  │  │  └─ default-bank.hbs
│  │  ├─ coop-pesos
│  │  │  └─ coop-pesos-statement.hbs
│  │  ├─ daily-collection-book
│  │  │  ├─ daily-collection-book.hbs
│  │  │  ├─ dcb-A5.hbs
│  │  │  ├─ dcb-bankbook.hbs
│  │  │  ├─ dcb-responsive.hbs
│  │  │  └─ dcb-statement.hbs
│  │  ├─ fs-notes-schedule
│  │  │  ├─ fsns-A5.hbs
│  │  │  ├─ fsns-bankbook.hbs
│  │  │  └─ fsns-statement.hbs
│  │  ├─ gl-sl-comparison
│  │  │  ├─ glsl-A5.hbs
│  │  │  ├─ glsl-bankbook.hbs
│  │  │  └─ glsl-statement.hbs
│  │  ├─ income-statement
│  │  │  ├─ is-A5.hbs
│  │  │  ├─ is-bankbook.hbs
│  │  │  ├─ is-responsive.hbs
│  │  │  └─ is-statement.hbs
│  │  ├─ statement-of-operations
│  │  │  ├─ so-A5.hbs
│  │  │  ├─ so-bank-book.hbs
│  │  │  └─ so-statement.hbs
│  │  └─ trial-balance
│  │     ├─ tb-A5.hbs
│  │     ├─ tb-bankbook.hbs
│  │     ├─ tb-statement.hbs
│  │     └─ trial-balance.hbs
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ vite.svg
├─ src
│  ├─ app.tsx
│  ├─ assets
│  │  ├─ artworks
│  │  │  ├─ artwork-experiment.svg
│  │  │  ├─ artwork-faq.svg
│  │  │  ├─ artwork-loan-select-empty.svg
│  │  │  ├─ artwork-start-transaction-batch.svg
│  │  │  ├─ artwork-time-in-out.svg
│  │  │  └─ artwork-timed-in.svg
│  │  ├─ cookie-icon.svg
│  │  ├─ email-templates
│  │  │  ├─ account-change-password.html
│  │  │  ├─ account-otp-verification.html
│  │  │  └─ account-verification.html
│  │  ├─ fonts
│  │  │  └─ Inter
│  │  │     └─ Inter-VariableFont.ttf
│  │  ├─ gifs
│  │  │  ├─ about-us.gif
│  │  │  ├─ e-coop-artwork-loading.gif
│  │  │  └─ pie-artwork-loading.gif
│  │  ├─ images
│  │  │  ├─ about-page
│  │  │  │  ├─ about_bg_element_1.webp
│  │  │  │  ├─ about_image_1.webp
│  │  │  │  └─ about_us.webp
│  │  │  ├─ banner
│  │  │  │  ├─ Banner1.webp
│  │  │  │  ├─ Banner2.webp
│  │  │  │  ├─ Banner3.webp
│  │  │  │  └─ Banner4.webp
│  │  │  ├─ banner-bg-element-1.png
│  │  │  ├─ ecoop_logo.webp
│  │  │  ├─ file-thumbnails
│  │  │  │  ├─ attachment-audio.svg
│  │  │  │  ├─ attachment-doc.svg
│  │  │  │  ├─ attachment-pdf.svg
│  │  │  │  ├─ attachment-sheet.svg
│  │  │  │  ├─ attachment-txt.svg
│  │  │  │  └─ attachment-video.svg
│  │  │  └─ landing-page
│  │  │     ├─ bg_element_1.webp
│  │  │     ├─ bg_element_2.webp
│  │  │     ├─ bg_element_3.webp
│  │  │     ├─ bg_element_4.webp
│  │  │     ├─ bg_element_5.webp
│  │  │     ├─ convenience_automation.webp
│  │  │     ├─ empowerment_growth.webp
│  │  │     ├─ home-image-1.webp
│  │  │     ├─ home-image-2.webp
│  │  │     └─ security_transparency.webp
│  │  ├─ pre-organization-banner-background
│  │  │  ├─ index.ts
│  │  │  ├─ org_banner_1.webp
│  │  │  ├─ org_banner_10.webp
│  │  │  ├─ org_banner_2.webp
│  │  │  ├─ org_banner_3.webp
│  │  │  ├─ org_banner_4.webp
│  │  │  ├─ org_banner_5.webp
│  │  │  ├─ org_banner_6.webp
│  │  │  ├─ org_banner_7.webp
│  │  │  ├─ org_banner_8.webp
│  │  │  └─ org_banner_9.webp
│  │  ├─ react.svg
│  │  ├─ sms-templates
│  │  │  └─ message.json
│  │  ├─ spy.svg
│  │  ├─ telescope.webp
│  │  └─ transactions
│  │     ├─ deposit_bg.webp
│  │     ├─ index.ts
│  │     ├─ payment_bg.webp
│  │     └─ withdrawal_bg.webp
│  ├─ components
│  │  ├─ backgrounds
│  │  │  ├─ flickering-grid.tsx
│  │  │  ├─ random-arrows.tsx
│  │  │  └─ random-dots.tsx
│  │  ├─ badges
│  │  │  └─ yes-no-badge.tsx
│  │  ├─ buttons
│  │  │  └─ refresh-button.tsx
│  │  ├─ clock.tsx
│  │  ├─ comboboxes
│  │  │  ├─ civil-status-combobox.tsx
│  │  │  ├─ country-combobox.tsx
│  │  │  ├─ general-status-combobox.tsx
│  │  │  ├─ icon-combobox.tsx
│  │  │  ├─ relationship-combobox.tsx
│  │  │  ├─ sex-combobox.tsx
│  │  │  ├─ timezone-combobox.tsx
│  │  │  └─ year-combobox.tsx
│  │  ├─ containers
│  │  │  └─ page-container.tsx
│  │  ├─ cookie-consent.tsx
│  │  ├─ copy-text-button.tsx
│  │  ├─ copy-url.tsx
│  │  ├─ data-table
│  │  │  ├─ data-table-actions
│  │  │  │  ├─ data-table-active-filters.tsx
│  │  │  │  ├─ data-table-column-reorderer.tsx
│  │  │  │  ├─ data-table-column-visibility.tsx
│  │  │  │  ├─ data-table-create-action.tsx
│  │  │  │  ├─ data-table-delete-selected.tsx
│  │  │  │  ├─ data-table-generate-report.txt
│  │  │  │  ├─ data-table-options-menu
│  │  │  │  │  ├─ filter-logic-option.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ scroll-option.tsx
│  │  │  │  └─ data-table-unselect.tsx
│  │  │  ├─ data-table-body.tsx
│  │  │  ├─ data-table-column-header
│  │  │  │  ├─ column-actions.tsx
│  │  │  │  ├─ column-drag-resize.tsx
│  │  │  │  └─ index.tsx
│  │  │  ├─ data-table-common-columns.tsx
│  │  │  ├─ data-table-filters
│  │  │  │  ├─ data-table-global-search.tsx
│  │  │  │  ├─ data-table-multi-select-filter.tsx
│  │  │  │  ├─ date-filter.tsx
│  │  │  │  ├─ date-range.tsx
│  │  │  │  ├─ number-filter.tsx
│  │  │  │  ├─ number-range.tsx
│  │  │  │  ├─ text-filter.tsx
│  │  │  │  ├─ time-filter.tsx
│  │  │  │  └─ time-range.tsx
│  │  │  ├─ data-table-footer-aggregations
│  │  │  │  └─ data-table-footer-summation.tsx
│  │  │  ├─ data-table-footer.tsx
│  │  │  ├─ data-table-header.tsx
│  │  │  ├─ data-table-pagination
│  │  │  │  └─ index.tsx
│  │  │  ├─ data-table-row-actions
│  │  │  │  ├─ header-toggle-select.tsx
│  │  │  │  └─ index.tsx
│  │  │  ├─ data-table-row-context.tsx
│  │  │  ├─ data-table-toolbar.tsx
│  │  │  ├─ data-table-utils.ts
│  │  │  ├─ index.tsx
│  │  │  ├─ store
│  │  │  │  └─ data-table-action-store.tsx
│  │  │  ├─ table.type.ts
│  │  │  ├─ use-datatable-pagination.ts
│  │  │  ├─ use-datatable-sorting.ts
│  │  │  ├─ use-datatable-state.ts
│  │  │  └─ use-table-column-persist.ts
│  │  ├─ date-time-pickers
│  │  │  ├─ date-range-picker.tsx
│  │  │  ├─ date-range.tsx
│  │  │  ├─ date-time-picker.tsx
│  │  │  ├─ date-time-setter.tsx
│  │  │  ├─ input-date-picker.tsx
│  │  │  └─ time-picker.tsx
│  │  ├─ ecoop-logo.tsx
│  │  ├─ filters
│  │  │  └─ multi-select-filter.tsx
│  │  ├─ footers
│  │  │  ├─ auth-footer.tsx
│  │  │  ├─ common-links.ts
│  │  │  └─ landing-footer
│  │  │     └─ index.tsx
│  │  ├─ form-components
│  │  │  ├─ form-footer-reset-submit.tsx
│  │  │  ├─ form-persist-headless.ts
│  │  │  └─ form-signature-section.tsx
│  │  ├─ form-stepper
│  │  │  └─ form-stepper.tsx
│  │  ├─ gradient-background
│  │  │  └─ gradient-background.tsx
│  │  ├─ hightlight-match.tsx
│  │  ├─ icon-container.tsx
│  │  ├─ icons
│  │  │  └─ index.tsx
│  │  ├─ image-display.tsx
│  │  ├─ image-match.tsx
│  │  ├─ image-name-display.tsx
│  │  ├─ image-preview
│  │  │  ├─ image-preview-modal.tsx
│  │  │  └─ image-preview.tsx
│  │  ├─ image.tsx
│  │  ├─ live-toggle.tsx
│  │  ├─ map
│  │  │  ├─ index.tsx
│  │  │  ├─ map-picker
│  │  │  │  └─ index.tsx
│  │  │  ├─ map.config.ts
│  │  │  ├─ map.provider.tsx
│  │  │  └─ map.utils.ts
│  │  ├─ modals
│  │  │  ├─  action-name-confirm-modal.tsx
│  │  │  ├─ action-security-modal.tsx
│  │  │  ├─ confirm-modal.tsx
│  │  │  ├─ info-modal.tsx
│  │  │  └─ modal.tsx
│  │  ├─ nav
│  │  │  ├─ nav-components
│  │  │  │  ├─ nav-auth-group.tsx
│  │  │  │  ├─ nav-ecoop-logo.tsx
│  │  │  │  ├─ nav-get-started.tsx
│  │  │  │  └─ nav-theme-toggle.tsx
│  │  │  ├─ nav-container.tsx
│  │  │  ├─ navs
│  │  │  │  ├─ auth-nav.tsx
│  │  │  │  ├─ landing-nav.tsx
│  │  │  │  ├─ onboarding-nav.tsx
│  │  │  │  ├─ user-nav.tsx
│  │  │  │  └─ user-profile-nav.tsx
│  │  │  └─ root-nav.tsx
│  │  ├─ pages-breadcrumbs
│  │  │  ├─ index.tsx
│  │  │  └─ page-navigator.tsx
│  │  ├─ pagination-bars
│  │  │  └─ mini-pagination-bar.tsx
│  │  ├─ pickers
│  │  │  ├─ color-picker.tsx
│  │  │  ├─ generic-picker.tsx
│  │  │  └─ member-picker-with-scanner.tsx
│  │  ├─ picture-crop
│  │  │  └─ index.tsx
│  │  ├─ policies
│  │  │  └─ index.tsx
│  │  ├─ qr-code
│  │  │  ├─ index.ts
│  │  │  ├─ qr-code-downloadable.tsx
│  │  │  └─ qr-code.tsx
│  │  ├─ qrcode-scanner
│  │  │  ├─ index.tsx
│  │  │  ├─ qr-scanner.tsx
│  │  │  └─ types.ts
│  │  ├─ reports
│  │  │  ├─ handlebars-compiler.tsx
│  │  │  ├─ handlebars-renderer.tsx
│  │  │  └─ report-formatter.tsx
│  │  ├─ search
│  │  │  └─ generic-search-input.tsx
│  │  ├─ selects
│  │  │  └─ month-select.tsx
│  │  ├─ sheet
│  │  │  └─ sheet.tsx
│  │  ├─ shorcuts
│  │  │  ├─ general-button-shorcuts.tsx
│  │  │  ├─ general-shorcuts-data.tsx
│  │  │  ├─ general-shorcuts.type.ts
│  │  │  └─ general-shortcuts-wrapper.tsx
│  │  ├─ sidebar
│  │  │  └─ org-branch-sidebar
│  │  │     ├─ index.tsx
│  │  │     └─ sidebar-routes.tsx
│  │  ├─ signature
│  │  │  ├─ capture-signature.tsx
│  │  │  ├─ draw-signature.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ signature-picker-uploader.tsx
│  │  │  └─ upload-signature.tsx
│  │  ├─ single-image-uploader
│  │  │  ├─ picture-drop.tsx
│  │  │  ├─ single-image-uploader-modal.tsx
│  │  │  ├─ single-image-uploader.tsx
│  │  │  ├─ single-picture-uploader.tsx
│  │  │  └─ upload-options.tsx
│  │  ├─ spinners
│  │  │  └─ loading-spinner.tsx
│  │  ├─ svg
│  │  │  └─ svg.tsx
│  │  ├─ switch-form-field.tsx
│  │  ├─ templates
│  │  │  ├─ template-cash-check-disbursement.ts
│  │  │  ├─ template-journal-entry.ts
│  │  │  └─ template-loan-voucher-release.ts
│  │  ├─ text-display.tsx
│  │  ├─ text-editor
│  │  │  ├─ index.tsx
│  │  │  └─ toolbar.tsx
│  │  ├─ text-renderer
│  │  │  └─ index.tsx
│  │  ├─ theme-toggle
│  │  │  ├─ index.ts
│  │  │  └─ theme-toggle-menu.tsx
│  │  ├─ tooltips
│  │  │  ├─ action-tooltip.tsx
│  │  │  └─ info-tooltip.tsx
│  │  ├─ ui
│  │  │  ├─ FileTypeIcons.tsx
│  │  │  ├─ accordion.tsx
│  │  │  ├─ alert.tsx
│  │  │  ├─ app-sidebar
│  │  │  │  ├─ app-sidebar-item.tsx
│  │  │  │  ├─ app-sidebar-quick-navigate.tsx
│  │  │  │  ├─ app-sidebar-toggle.tsx
│  │  │  │  ├─ app-sidebar-user.tsx
│  │  │  │  ├─ app-sidebar-utils.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ aspect-ratio.tsx
│  │  │  ├─ avatar.tsx
│  │  │  ├─ background-particles.tsx
│  │  │  ├─ background-paths.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ breadcrumb.tsx
│  │  │  ├─ button-group.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ calendar.tsx
│  │  │  ├─ card-top-image.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ carousel.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ collapsible.tsx
│  │  │  ├─ command.tsx
│  │  │  ├─ context-menu.tsx
│  │  │  ├─ date-input-field.tsx
│  │  │  ├─ debounced-input.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ drawer.tsx
│  │  │  ├─ dropdown-menu.tsx
│  │  │  ├─ editable-columns.tsx
│  │  │  ├─ electric-line.tsx
│  │  │  ├─ empty-state.tsx
│  │  │  ├─ empty.tsx
│  │  │  ├─ file-uploader.tsx
│  │  │  ├─ form-error-message.tsx
│  │  │  ├─ form-field-wrapper.tsx
│  │  │  ├─ form.tsx
│  │  │  ├─ gradient-text.tsx
│  │  │  ├─ grid-pattern.tsx
│  │  │  ├─ horizontal-card.tsx
│  │  │  ├─ hover-card.tsx
│  │  │  ├─ image-field.tsx
│  │  │  ├─ input-date.tsx
│  │  │  ├─ input-group.tsx
│  │  │  ├─ input-otp.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ kbd.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ markdown.tsx
│  │  │  ├─ mouse-trail-effect.tsx
│  │  │  ├─ password-input.tsx
│  │  │  ├─ phone-input.tsx
│  │  │  ├─ popover.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ radio-group.tsx
│  │  │  ├─ random-code.tsx
│  │  │  ├─ re-captcha.tsx
│  │  │  ├─ resizable.tsx
│  │  │  ├─ scroll-area.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ shadcn-io
│  │  │  │  └─ icon-button
│  │  │  │     └─ index.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ sidebar.tsx
│  │  │  ├─ signature-field.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ slider.tsx
│  │  │  ├─ sonner.tsx
│  │  │  ├─ stepper.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ text-editor
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ toolbar.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ timeline.tsx
│  │  │  ├─ toggle-group.tsx
│  │  │  ├─ toggle.tsx
│  │  │  ├─ tooltip.tsx
│  │  │  ├─ triple-arrow.tsx
│  │  │  ├─ truncated-text.tsx
│  │  │  └─ use-isFocused.tsx
│  │  ├─ uploaders
│  │  │  ├─ drop-areas
│  │  │  │  ├─ default-drop-area.tsx
│  │  │  │  └─ type.ts
│  │  │  ├─ drop-hover-overlay.tsx
│  │  │  ├─ file-drop
│  │  │  │  ├─ picture-drop.tsx
│  │  │  │  └─ single-file-drop.tsx
│  │  │  ├─ file-item.tsx
│  │  │  ├─ signature-upload-field.tsx
│  │  │  └─ single-image-uploader
│  │  │     ├─ index.tsx
│  │  │     ├─ single-image-uploader-modal.tsx
│  │  │     └─ upload-options.tsx
│  │  ├─ webcam
│  │  │  ├─ camera-device-picker.tsx
│  │  │  └─ index.tsx
│  │  └─ wrappers
│  │     ├─ auth-guard.tsx
│  │     ├─ copy-wrapper.tsx
│  │     ├─ guest-guard.tsx
│  │     ├─ org-branch-guard.tsx
│  │     ├─ preview-media-wrapper.tsx
│  │     ├─ user-org-guard.tsx
│  │     └─ user-type-guard.tsx
│  ├─ constants
│  │  ├─ common-constant.ts
│  │  ├─ envs.ts
│  │  ├─ icons.ts
│  │  ├─ index.ts
│  │  ├─ ledger.ts
│  │  ├─ pagination.ts
│  │  ├─ regex.ts
│  │  ├─ shorcuts.ts
│  │  └─ version.tsx
│  ├─ contexts
│  │  └─ filter-context
│  │     ├─ filter-context.ts
│  │     ├─ index.ts
│  │     └─ use-filter.ts
│  ├─ helpers
│  │  ├─ address
│  │  │  ├─ address-types.ts
│  │  │  ├─ addresses-data-2019.json
│  │  │  └─ index.ts
│  │  ├─ axios-helpers
│  │  │  ├─ axios-error-extractor.ts
│  │  │  └─ axios-progress-helper.ts
│  │  ├─ callback-helper.ts
│  │  ├─ color
│  │  │  └─ color-converter.ts
│  │  ├─ common-helper.ts
│  │  ├─ date-utils.ts
│  │  ├─ encoding-utils.test.ts
│  │  ├─ encoding-utils.ts
│  │  ├─ error-message-extractor
│  │  │  ├─ axios-err-extractor.ts
│  │  │  ├─ index.ts
│  │  │  ├─ path-params-err-extractor.ts
│  │  │  └─ zod-err-extractor.ts
│  │  ├─ file-download.test.ts
│  │  ├─ file-download.ts
│  │  ├─ filter-utils
│  │  │  └─ apply-filters.ts
│  │  ├─ form
│  │  │  └─ form-persist.helper.ts
│  │  ├─ formatting-utils.ts
│  │  ├─ function-utils.ts
│  │  ├─ idempotency-utils.ts
│  │  ├─ indempotency-helpers
│  │  │  └─ index.ts
│  │  ├─ index.ts
│  │  ├─ loggers
│  │  │  ├─ index.ts
│  │  │  └─ logger.ts
│  │  ├─ map-utils.ts
│  │  ├─ number-utils.ts
│  │  ├─ picture-crop-helper.ts
│  │  ├─ random-generator.test.ts
│  │  ├─ report-pagination-utils.ts
│  │  ├─ resolver
│  │  │  └─ column-type-resolver.ts
│  │  ├─ sanitizer.ts
│  │  ├─ table-column-meta-utils.ts
│  │  ├─ time-zones
│  │  │  ├─ index.ts
│  │  │  ├─ time-zone-type.ts
│  │  │  └─ timeZones.json
│  │  └─ tw-utils.ts
│  ├─ hooks
│  │  ├─ pwa-hook.ts
│  │  ├─ use-alert-before-closing.ts
│  │  ├─ use-camera.ts
│  │  ├─ use-cooldown.ts
│  │  ├─ use-debounce.ts
│  │  ├─ use-download-element.ts
│  │  ├─ use-element-in-view.ts
│  │  ├─ use-entity-modal-state.tsx
│  │  ├─ use-filter-state.ts
│  │  ├─ use-form-helper.ts
│  │  ├─ use-go-to-org.tsx
│  │  ├─ use-idempotency.ts
│  │  ├─ use-incognito-detector.ts
│  │  ├─ use-indexdb-storage.ts
│  │  ├─ use-internal-state.ts
│  │  ├─ use-localstorage.ts
│  │  ├─ use-location-info.ts
│  │  ├─ use-mobile.ts
│  │  ├─ use-modal-state.ts
│  │  ├─ use-pagination.ts
│  │  ├─ use-prevent-exit.ts
│  │  ├─ use-pubsub-enhanced.txt
│  │  ├─ use-pubsub.ts
│  │  ├─ use-query-hook-cb.ts
│  │  ├─ use-shorcuts.ts
│  │  ├─ use-simple-shortcut.ts
│  │  ├─ use-sorting-state.ts
│  │  ├─ use-submit-trottle.ts
│  │  ├─ use-system-notify.ts
│  │  └─ use-url-modal.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ modules
│  │  ├─ account
│  │  │  ├─ account.constants.ts
│  │  │  ├─ account.service.ts
│  │  │  ├─ account.types.ts
│  │  │  ├─ account.utils.ts
│  │  │  ├─ account.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ account-actions.tsx
│  │  │  │  ├─ account-card.tsx
│  │  │  │  ├─ account-list-header.tsx
│  │  │  │  ├─ account-list.tsx
│  │  │  │  ├─ account-mini-card.tsx
│  │  │  │  ├─ account-transaction-ledger.tsx
│  │  │  │  ├─ account-viewer
│  │  │  │  │  ├─ account-common-config.tsx
│  │  │  │  │  ├─ account-viewer.tsx
│  │  │  │  │  ├─ common.tsx
│  │  │  │  │  ├─ deposit-content.tsx
│  │  │  │  │  ├─ fines-content.tsx
│  │  │  │  │  ├─ interest-content.tsx
│  │  │  │  │  ├─ loan-content.tsx
│  │  │  │  │  └─ svf-content.tsx
│  │  │  │  ├─ badges
│  │  │  │  │  ├─ account-badge.tsx
│  │  │  │  │  └─ account-type-badge.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ account-content-form.tsx
│  │  │  │  │  ├─ account-create-update-form.tsx
│  │  │  │  │  ├─ account-header-form.tsx
│  │  │  │  │  └─ sections
│  │  │  │  │     ├─ deposit-form-section.tsx
│  │  │  │  │     ├─ fines-form-section.tsx
│  │  │  │  │     ├─ interest-form-section.tsx
│  │  │  │  │     ├─ loan-connect-account-section.tsx
│  │  │  │  │     ├─ loan-form-section.tsx
│  │  │  │  │     ├─ other-form-section.tsx
│  │  │  │  │     └─ svf-ledger-form-section.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ picker
│  │  │  │  │  ├─ account-multi-picker.tsx
│  │  │  │  │  └─ account-picker.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-actions.tsx
│  │  │  ├─ context
│  │  │  │  └─ account-provider.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ use-account-controller.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  ├─ account-table-manager.tsx
│  │  │  │  └─ index.tsx
│  │  │  └─ reports
│  │  │     ├─ account-report-templates.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        └─ al-1-normal.njk
│  │  ├─ account-category
│  │  │  ├─ account-category.service.ts
│  │  │  ├─ account-category.types.ts
│  │  │  ├─ account-category.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ combobox
│  │  │  │  │  └─ account-category-combobox.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ account-category-create-update-form.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  └─ tables
│  │  │  │     ├─ column.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ account-classification
│  │  │  ├─ account-classification.service.ts
│  │  │  ├─ account-classification.types.ts
│  │  │  ├─ account-classification.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ combobox
│  │  │  │  │  └─ account-classification-combobox.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ account-classification-create-update-form.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  └─ tables
│  │  │  │     ├─ column.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action.tsx
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ account-history
│  │  │  ├─ account-history.service.ts
│  │  │  ├─ account-history.types.ts
│  │  │  ├─ account-history.validation.ts
│  │  │  ├─ forms
│  │  │  │  └─ account-history-sheet.tsx
│  │  │  └─ index.ts
│  │  ├─ account-tag
│  │  │  ├─ account-tag.service.ts
│  │  │  ├─ account-tag.types.ts
│  │  │  ├─ account-tag.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ account-tag-management.tsx
│  │  │  │  ├─ account-tag.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ account-tag-form-modal.tsx
│  │  │  │  └─ index.ts
│  │  │  └─ index.ts
│  │  ├─ account-transaction
│  │  │  ├─ account-transaction-constants.ts
│  │  │  ├─ account-transaction.service.ts
│  │  │  ├─ account-transaction.types.ts
│  │  │  ├─ account-transaction.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ account-transaction.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ account-transaction-update-form.tsx
│  │  │  │  │  └─ process-account-gl-form.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ account-transaction-page.tsx
│  │  │  └─ index.ts
│  │  ├─ account-transaction-entry
│  │  │  ├─ account-transaction-entry.service.ts
│  │  │  ├─ account-transaction-entry.types.ts
│  │  │  ├─ account-transaction-entry.validation.ts
│  │  │  └─ index.ts
│  │  ├─ adjustment-entry
│  │  │  ├─ adjustment-entry.service.ts
│  │  │  ├─ adjustment-entry.types.ts
│  │  │  ├─ adjustment-entry.utils.test.ts
│  │  │  ├─ adjustment-entry.utils.ts
│  │  │  ├─ adjustment-entry.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ adjustment-entry-total.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ adjustment-entry-form-modal.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ adjustment-entry-page.tsx
│  │  ├─ adjustment-entry-tag
│  │  │  ├─ adjustment-entry-tag.service.ts
│  │  │  ├─ adjustment-entry-tag.types.ts
│  │  │  ├─ adjustment-entry-tag.validation.ts
│  │  │  └─ index.ts
│  │  ├─ approvals
│  │  │  ├─ approvals.service.ts
│  │  │  └─ components
│  │  │     ├─ approval.tsx
│  │  │     ├─ kanban
│  │  │     │  ├─ kanban-container.tsx
│  │  │     │  ├─ kanban-items-container.tsx
│  │  │     │  └─ kanban-title.tsx
│  │  │     ├─ kanbans
│  │  │     │  ├─ cash-check-voucher
│  │  │     │  │  ├─ cash-check-voucher-card-actions.tsx
│  │  │     │  │  ├─ cash-check-voucher-card.tsx
│  │  │     │  │  ├─ cash-check-voucher-kanban-main.tsx
│  │  │     │  │  └─ cash-check-voucher-kanban.tsx
│  │  │     │  ├─ hook
│  │  │     │  │  └─ use-search-kanban.tsx
│  │  │     │  ├─ journal-voucher
│  │  │     │  │  ├─ journal-voucher-card-actions.tsx
│  │  │     │  │  ├─ journal-voucher-card.tsx
│  │  │     │  │  ├─ journal-voucher-kanban-main.tsx
│  │  │     │  │  └─ journal-voucher-kanban.tsx
│  │  │     │  ├─ loan
│  │  │     │  │  ├─ loan-kanban-card-actions.tsx
│  │  │     │  │  ├─ loan-kanban-card.tsx
│  │  │     │  │  ├─ loan-kanban-main.tsx
│  │  │     │  │  └─ loan-kanban.tsx
│  │  │     │  ├─ new-member-profile-kanban.tsx
│  │  │     │  ├─ other-fund
│  │  │     │  │  ├─ other-fund-card-actions.tsx
│  │  │     │  │  ├─ other-fund-card.tsx
│  │  │     │  │  ├─ other-fund-kanban-main.tsx
│  │  │     │  │  └─ other-fund-kanban.tsx
│  │  │     │  ├─ search-kanban-input.tsx
│  │  │     │  └─ user-join-request-kanban.tsx
│  │  │     └─ pages
│  │  │        └─ approval.tsx
│  │  ├─ area
│  │  │  ├─ area.service.ts
│  │  │  ├─ area.types.ts
│  │  │  ├─ area.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ area-combobox.tsx
│  │  │  │  ├─ area-table
│  │  │  │  │  ├─ columnts.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ area-create-update-form.tsx
│  │  │  │  ├─ map-area
│  │  │  │  │  ├─ area-member-picker.tsx
│  │  │  │  │  ├─ map-area.tsx
│  │  │  │  │  └─ maps.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ area-page.tsx
│  │  │  └─ index.ts
│  │  ├─ authentication
│  │  │  ├─ authentication.service.ts
│  │  │  ├─ authentication.types.ts
│  │  │  ├─ authentication.validation.ts
│  │  │  ├─ authgentication.store.ts
│  │  │  ├─ components
│  │  │  │  ├─ auth-loader.tsx
│  │  │  │  ├─ devices-list.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ forgot-password-email.tsx
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ resend-password-reset-link-button.tsx
│  │  │  │  │  ├─ reset-password-form.tsx
│  │  │  │  │  ├─ sign-in-form.tsx
│  │  │  │  │  ├─ sign-up-form.tsx
│  │  │  │  │  └─ verify-form.tsx
│  │  │  │  ├─ general-status-badge.tsx
│  │  │  │  ├─ nav
│  │  │  │  │  ├─ nav-sign-in.tsx
│  │  │  │  │  ├─ nav-sign-out.tsx
│  │  │  │  │  └─ nav-sign-up.tsx
│  │  │  │  ├─ resend-verify-button.tsx
│  │  │  │  ├─ user-type-badge.tsx
│  │  │  │  └─ value-checklist-indicator.tsx
│  │  │  └─ index.ts
│  │  ├─ automatic-loan-deduction
│  │  │  ├─ automatic-loan-deduction.service.ts
│  │  │  ├─ automatic-loan-deduction.types.ts
│  │  │  ├─ automatic-loan-deduction.utils.ts
│  │  │  ├─ automatic-loan-deduction.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ automatic-loan-deductions-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ forms
│  │  │  │     └─ automatic-loan-deduction-entry-create-update-form.tsx
│  │  │  └─ index.ts
│  │  ├─ bank
│  │  │  ├─ bank.service.ts
│  │  │  ├─ bank.types.ts
│  │  │  ├─ bank.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ bank-combobox.tsx
│  │  │  │  ├─ bank-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ bank-create-update-form.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ banks.tsx
│  │  │  └─ index.ts
│  │  ├─ batch-funding
│  │  │  ├─ batch-funding.service.ts
│  │  │  ├─ batch-funding.types.ts
│  │  │  ├─ batch-funding.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ batch-batch-funding-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ batch-funding-create-form.tsx
│  │  │  └─ index.ts
│  │  ├─ bill-and-coins
│  │  │  ├─ bill-and-coins.service.ts
│  │  │  ├─ bill-and-coins.types.ts
│  │  │  ├─ bill-and-coins.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ bills-and-coin-create-update-form.tsx
│  │  │  │  ├─ bills-and-coins-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ bills-and-coins-page.tsx
│  │  │  └─ index.ts
│  │  ├─ branch
│  │  │  ├─ branch.service.ts
│  │  │  ├─ branch.types.ts
│  │  │  ├─ branch.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ branch-display-preview.tsx
│  │  │  │  ├─ branch-item.tsx
│  │  │  │  ├─ branches-grid.tsx
│  │  │  │  ├─ branches-section.tsx
│  │  │  │  ├─ cards
│  │  │  │  │  ├─ branch-card-custom-footer.tsx
│  │  │  │  │  ├─ branch-card-footer.tsx
│  │  │  │  │  └─ branch-card.tsx
│  │  │  │  ├─ completion-section.tsx
│  │  │  │  ├─ create-branch.tsx
│  │  │  │  ├─ empty-branches-state.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ create-branch-form.tsx
│  │  │  │  ├─ modal
│  │  │  │  │  └─ branch-modal-display.tsx
│  │  │  │  └─ policy-acceptance-modal.tsx
│  │  │  ├─ context
│  │  │  │  └─ branches-context.tsx
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     ├─ branch.tsx
│  │  │     └─ index.ts
│  │  ├─ branch-settings
│  │  │  ├─ branch-settings.service.ts
│  │  │  ├─ branch-settings.types.ts
│  │  │  ├─ branch-settings.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ branch-settings
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ loan-processing.tsx
│  │  │  │  └─ forms
│  │  │  │     ├─ branch-settings-currency-form.tsx
│  │  │  │     └─ branch-settings-form.tsx
│  │  │  └─ index.ts
│  │  ├─ browse-exclude-include-accounts
│  │  │  ├─ browse-exclude-include-accounts.service.ts
│  │  │  ├─ browse-exclude-include-accounts.types.ts
│  │  │  ├─ browse-exclude-include-accounts.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ browse-exclude-include-accounts-table
│  │  │  │  │  ├─ action.tsx
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ forms
│  │  │  │     └─ browse-exclude-include-account-create-update-form.tsx
│  │  │  └─ index.ts
│  │  ├─ browse-reference
│  │  │  ├─ browse-reference.constant.ts
│  │  │  ├─ browse-reference.service.ts
│  │  │  ├─ browse-reference.types.ts
│  │  │  ├─ browse-reference.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ browse-reference
│  │  │  │  │  ├─ browse-reference-editor.tsx
│  │  │  │  │  └─ browse-reference-sidebar.tsx
│  │  │  │  ├─ browse-reference-display.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ browse-reference-create-update-form.tsx
│  │  │  │  │  └─ browse-update-form
│  │  │  │  │     ├─ browse-reference-update-form.tsx
│  │  │  │  │     ├─ by-amount-form-section.tsx
│  │  │  │  │     ├─ by-date-form-section.tsx
│  │  │  │  │     └─ by-year-form-section.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ browse-reference-page.tsx
│  │  │  └─ index.ts
│  │  ├─ calculator
│  │  │  ├─ calculator.service.ts
│  │  │  ├─ calculator.types.ts
│  │  │  ├─ calculator.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ mock-loan-input-form.tsx
│  │  │  └─ index.ts
│  │  ├─ cancelled-cash-check-voucher
│  │  │  ├─ cancelled-cash-check-voucher.service.ts
│  │  │  ├─ cancelled-cash-check-voucher.types.ts
│  │  │  ├─ cancelled-cash-check-voucher.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ cancelled-button.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ cancelled-cash-check-voucher-form-modal.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  └─ index.ts
│  │  ├─ cash-check-voucher
│  │  │  ├─ cash-check-voucher.service.ts
│  │  │  ├─ cash-check-voucher.types.ts
│  │  │  ├─ cash-check-voucher.utils.test.ts
│  │  │  ├─ cash-check-voucher.utils.ts
│  │  │  ├─ cash-check-voucher.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ cash-check-status-indicator.tsx
│  │  │  │  ├─ cash-check-voucher-info-card.tsx
│  │  │  │  ├─ cash-check-voucher-status-badge.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ cash-check-entry-form-modal.tsx
│  │  │  │  │  ├─ cash-check-signature-form-modal.tsx
│  │  │  │  │  ├─ cash-check-voucher-approve-release-display-modal.tsx
│  │  │  │  │  ├─ cash-check-voucher-create-udate-form-modal.tsx
│  │  │  │  │  ├─ cash-check-voucher-entry-table.tsx
│  │  │  │  │  ├─ cash-check-voucher-print-form-modal.tsx
│  │  │  │  │  └─ cash-check-voucher-reprint-form.tsx
│  │  │  │  ├─ modal-displays
│  │  │  │  │  └─ cash-check-voucher-release-invalid.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ cash-check-other-voucher.tsx
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  └─ cash-check-voucher.tsx
│  │  │  └─ reports
│  │  │     ├─ cash-check-voucher-templates.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        ├─ ccv-1-compact.njk
│  │  │        ├─ ccv-1-large.njk
│  │  │        └─ ccv-1-normal.njk
│  │  ├─ cash-check-voucher-entry
│  │  │  ├─ cash-check-voucher-entry.service.ts
│  │  │  ├─ cash-check-voucher-entry.types.ts
│  │  │  ├─ cash-check-voucher-entry.validation.ts
│  │  │  └─ index.ts
│  │  ├─ cash-check-voucher-tag
│  │  │  ├─ cash-check-voucher-tag.service.ts
│  │  │  ├─ cash-check-voucher-tag.types.ts
│  │  │  ├─ cash-check-voucher-tag.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ cash-check-voucher-tag-manager.tsx
│  │  │  └─ index.ts
│  │  ├─ cash-count
│  │  │  ├─ cash-count.service.ts
│  │  │  ├─ cash-count.types.ts
│  │  │  ├─ cash-count.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ cash-count-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ cash-count.tsx
│  │  │  └─ index.ts
│  │  ├─ category
│  │  │  ├─ category.service.ts
│  │  │  ├─ category.types.ts
│  │  │  ├─ category.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  └─ index.ts
│  │  ├─ charges-rate-by-range-or-minimum-amount
│  │  │  ├─ charges-rate-by-range-or-minimum-amount.service.ts
│  │  │  ├─ charges-rate-by-range-or-minimum-amount.types.ts
│  │  │  ├─ charges-rate-by-range-or-minimum-amount.validation.ts
│  │  │  ├─ components
│  │  │  └─ index.ts
│  │  ├─ charges-rate-by-term
│  │  │  ├─ charges-rate-by-term.service.ts
│  │  │  ├─ charges-rate-by-term.types.ts
│  │  │  ├─ charges-rate-by-term.validation.ts
│  │  │  └─ index.ts
│  │  ├─ charges-rate-scheme
│  │  │  ├─ charges-rate-scheme.service.ts
│  │  │  ├─ charges-rate-scheme.types.ts
│  │  │  ├─ charges-rate-scheme.validation.ts
│  │  │  ├─ charges-rate.constant.ts
│  │  │  ├─ components
│  │  │  │  ├─ charges-rate-combobox.tsx
│  │  │  │  ├─ charges-rate-scheme
│  │  │  │  │  ├─ charges-rate-scheme-editor.tsx
│  │  │  │  │  └─ charges-rate-schemes-sidebar.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ charges-rate-scheme-create-form.tsx
│  │  │  │  │  └─ charges-rate-scheme-update-form
│  │  │  │  │     ├─ by-rate-amount-range-section.tsx
│  │  │  │  │     ├─ by-term-mop-member-type-section.tsx
│  │  │  │  │     ├─ by-term-section.tsx
│  │  │  │  │     ├─ connect-account-section.tsx
│  │  │  │  │     └─ index.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ charges-rate-page.tsx
│  │  │  └─ index.ts
│  │  ├─ charges-rate-scheme-account
│  │  │  ├─ charges-rate-scheme-account.service.ts
│  │  │  ├─ charges-rate-scheme-account.types.ts
│  │  │  ├─ charges-rate-scheme-account.validation.ts
│  │  │  ├─ components
│  │  │  └─ index.ts
│  │  ├─ charges-rate-scheme-mode-of-payment
│  │  │  ├─ charges-rate-scheme-mode-of-payment.service.ts
│  │  │  ├─ charges-rate-scheme-mode-of-payment.types.ts
│  │  │  ├─ charges-rate-scheme-mode-of-payment.validation.ts
│  │  │  └─ index.ts
│  │  ├─ check-remittance
│  │  │  ├─ check-remittance.service.ts
│  │  │  ├─ check-remittance.types.ts
│  │  │  ├─ check-remittance.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ check-remittance-create-update-form.tsx
│  │  │  └─ index.ts
│  │  ├─ check-warehousing
│  │  │  ├─ check-warehousing.service.ts
│  │  │  ├─ check-warehousing.types.ts
│  │  │  ├─ check-warehousing.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ check-warehouse-columns.tsx
│  │  │  │  ├─ check-warehouse-sumarry.tsx
│  │  │  │  ├─ check-warehouse-table.tsx
│  │  │  │  ├─ check-warehousing-action-context.tsx
│  │  │  │  ├─ create-update-check-warehousing-modal.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ collateral
│  │  │  ├─ collateral.service.ts
│  │  │  ├─ collateral.types.ts
│  │  │  ├─ collateral.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ collateral-combobox.tsx
│  │  │  │  ├─ collateral-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ collateral-create-update-form.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ collateral.tsx
│  │  │  └─ index.ts
│  │  ├─ collectors-member-account-entry
│  │  │  ├─ collectors-member-account-entry.service.ts
│  │  │  ├─ collectors-member-account-entry.types.ts
│  │  │  ├─ collectors-member-account-entry.validation.ts
│  │  │  ├─ components
│  │  │  └─ index.ts
│  │  ├─ comaker-collateral
│  │  │  ├─ comaker-collateral.service.ts
│  │  │  ├─ comaker-collateral.types.ts
│  │  │  ├─ comaker-collateral.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ comaker-collateral-create-update-form.tsx
│  │  │  └─ index.ts
│  │  ├─ comaker-member-profile
│  │  │  ├─ comaker-member-profile.service.ts
│  │  │  ├─ comaker-member-profile.types.ts
│  │  │  ├─ comaker-member-profile.validation.ts
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ comaker-member-profile-create-update-form.tsx
│  │  │  └─ index.ts
│  │  ├─ company
│  │  │  ├─ company.service.ts
│  │  │  ├─ company.types.ts
│  │  │  ├─ company.validation.ts
│  │  │  ├─ components
│  │  │  │  ├─ company-combobox.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ company-create-update-modal.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ company-page.tsx
│  │  ├─ computation-sheet
│  │  │  ├─ components
│  │  │  │  ├─ computation-sheet-account.tsx
│  │  │  │  ├─ computation-sheet-calculator.tsx
│  │  │  │  ├─ computation-sheet-combobox.tsx
│  │  │  │  ├─ computation-sheet-scheme
│  │  │  │  │  ├─ computation-schemes-sidebar.tsx
│  │  │  │  │  ├─ computation-sheet-scheme-display
│  │  │  │  │  │  ├─ index.tsx
│  │  │  │  │  │  ├─ scheme-deduction-entries.tsx
│  │  │  │  │  │  └─ scheme-negative-include-exclude.tsx
│  │  │  │  │  └─ computation-sheet-scheme-editor.tsx
│  │  │  │  ├─ computation-sheet-scheme-card.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ computation-sheet-create-update-form.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ computation-sheet.tsx
│  │  │  ├─ computation-sheet.service.ts
│  │  │  ├─ computation-sheet.types.ts
│  │  │  ├─ computation-sheet.validation.ts
│  │  │  └─ index.ts
│  │  ├─ computation-type
│  │  │  ├─ components
│  │  │  │  ├─ computation-type-badge.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ computation-type.service.ts
│  │  │  ├─ computation-type.type.ts
│  │  │  ├─ computation-type.validation.ts
│  │  │  └─ index.ts
│  │  ├─ contact-us
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ contact-us-create-form.tsx
│  │  │  ├─ contact-us.service.ts
│  │  │  ├─ contact-us.types.ts
│  │  │  ├─ contact-use.validation.ts
│  │  │  └─ index.ts
│  │  ├─ currency
│  │  │  ├─ components
│  │  │  │  ├─ currency-badge.tsx
│  │  │  │  ├─ currency-combobox.tsx
│  │  │  │  └─ currency-input.tsx
│  │  │  ├─ currency.service.ts
│  │  │  ├─ currency.types.ts
│  │  │  ├─ currency.utils.ts
│  │  │  ├─ currency.validation.ts
│  │  │  └─ index.ts
│  │  ├─ dashboard
│  │  │  ├─ components
│  │  │  │  ├─ income-expense-chart.tsx
│  │  │  │  ├─ kpi-cards.tsx
│  │  │  │  ├─ member-profile-dashboard.mock.ts
│  │  │  │  ├─ member-total.tsx
│  │  │  │  ├─ member-type-pie-chart.tsx
│  │  │  │  ├─ members-growth-chart.tsx
│  │  │  │  └─ new-member.tsx
│  │  │  ├─ dashboard.service.ts
│  │  │  ├─ dashboard.types.ts
│  │  │  ├─ dashboard.validation.ts
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ developer
│  │  │  ├─ components
│  │  │  │  ├─ api-key-gen.tsx
│  │  │  │  ├─ api-request-method-badge.tsx
│  │  │  │  └─ api-routes.tsx
│  │  │  ├─ developer.service.ts
│  │  │  ├─ developer.types.ts
│  │  │  ├─ developer.validation.ts
│  │  │  └─ index.ts
│  │  ├─ disbursement
│  │  │  ├─ components
│  │  │  │  ├─ disbursement-combobox.tsx
│  │  │  │  ├─ disbursement-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ disbursement-create-update-form.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ disbursement.tsx
│  │  │  ├─ disbursement.service.ts
│  │  │  ├─ disbursement.types.ts
│  │  │  ├─ disbursement.validation.ts
│  │  │  └─ index.ts
│  │  ├─ disbursement-transaction
│  │  │  ├─ components
│  │  │  │  ├─ disbursement-transaction-create-form.tsx
│  │  │  │  ├─ disbursement-transaction-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ disbursement-transaction-all-table.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ disbursement-transaction.tsx
│  │  │  ├─ disbursement-transaction.service.ts
│  │  │  ├─ disbursement-transaction.types.ts
│  │  │  ├─ disbursement-transaction.validation.ts
│  │  │  └─ index.ts
│  │  ├─ employee
│  │  │  ├─ components
│  │  │  │  ├─ employee-multi-picker.tsx
│  │  │  │  ├─ employee-picker.tsx
│  │  │  │  ├─ employees-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ employee-create-form.tsx
│  │  │  │  └─ pages
│  │  │  │     ├─ employee-footsteps.tsx
│  │  │  │     └─ view-employees.tsx
│  │  │  ├─ employee.service.ts
│  │  │  ├─ employee.types.ts
│  │  │  ├─ employee.validation.ts
│  │  │  └─ index.ts
│  │  ├─ explore
│  │  │  ├─ components
│  │  │  │  ├─ empty-state.tsx
│  │  │  │  ├─ explore-header.tsx
│  │  │  │  ├─ filters-toolbar.tsx
│  │  │  │  ├─ loading-skeleton.tsx
│  │  │  │  ├─ modals
│  │  │  │  │  └─ organization-preview-modal.tsx
│  │  │  │  └─ scrollable-section.tsx
│  │  │  ├─ explore.type.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ use-explore-data.ts
│  │  │  │  ├─ use-explore-filters.ts
│  │  │  │  └─ use-scroll-navigation.ts
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  ├─ explore-by-categories.tsx
│  │  │  │  ├─ explore-featured.tsx
│  │  │  │  └─ explore-page.tsx
│  │  │  └─ utils
│  │  │     ├─ data-filters.ts
│  │  │     ├─ data-grouping.tsx
│  │  │     └─ sorting.ts
│  │  ├─ feed
│  │  │  ├─ components
│  │  │  │  ├─ feed-create-post-header.tsx
│  │  │  │  ├─ feed-post-card.tsx
│  │  │  │  ├─ feed-post-skeleton.tsx
│  │  │  │  ├─ feeds.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ create-feed-comment-form.tsx
│  │  │  │  │  └─ create-update-feed-post-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ feed-page.tsx
│  │  │  │  └─ text-limit-indicator-progress.tsx
│  │  │  ├─ feed.service.ts
│  │  │  ├─ feed.types.ts
│  │  │  ├─ feed.validation.ts
│  │  │  └─ index.ts
│  │  ├─ feed-comment
│  │  │  ├─ feed-comment.service.ts
│  │  │  ├─ feed-comment.types.ts
│  │  │  ├─ feed-comment.validation.ts
│  │  │  └─ index.ts
│  │  ├─ feed-like
│  │  │  ├─ feed-like.types.ts
│  │  │  ├─ feed-like.validation.ts
│  │  │  └─ index.ts
│  │  ├─ feed-media
│  │  │  ├─ feed-media.types.ts
│  │  │  ├─ feed-media.validation.ts
│  │  │  └─ index.ts
│  │  ├─ feedback
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ feedback-form.tsx
│  │  │  ├─ feedback.service.ts
│  │  │  ├─ feedback.types.ts
│  │  │  ├─ feedback.validation.ts
│  │  │  └─ index.ts
│  │  ├─ financial-statement-account-grouping
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ update-financial-statement-accounts-grouping-form.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ financial-statement-account-grouping.service.ts
│  │  │  ├─ financial-statement-account-grouping.types.ts
│  │  │  ├─ financial-statement-account-grouping.validation.ts
│  │  │  └─ index.ts
│  │  ├─ financial-statement-definition
│  │  │  ├─ components
│  │  │  │  ├─ financial-statement-type-badge.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ financial-statement-create-update-form.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ financial-statement-definition.constants.ts
│  │  │  ├─ financial-statement-definition.service.ts
│  │  │  ├─ financial-statement-definition.types.ts
│  │  │  ├─ financial-statement-definition.validation.ts
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     ├─ components
│  │  │     │  ├─ financial-statement-skeleton.tsx
│  │  │     │  ├─ fs-definition-actions.txt
│  │  │     │  ├─ fs-definition-node.txt
│  │  │     │  └─ fs-defintion-tree.txt
│  │  │     └─ index.tsx
│  │  ├─ financial-statement-title
│  │  │  ├─ components
│  │  │  │  ├─ financial-statement-account.tsx
│  │  │  │  ├─ financial-statement-title-create-update.tsx
│  │  │  │  └─ finanicial-statement-combobox.tsx
│  │  │  ├─ financial-statement-title.service.ts
│  │  │  ├─ financial-statement-title.types.ts
│  │  │  ├─ financial-statement-title.validation.ts
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ fines-maturity
│  │  │  ├─ components
│  │  │  ├─ fines-maturity.service.ts
│  │  │  ├─ fines-maturity.types.ts
│  │  │  ├─ fines-maturity.validation.ts
│  │  │  └─ index.ts
│  │  ├─ footstep
│  │  │  ├─ components
│  │  │  │  ├─ footstep-detail.tsx
│  │  │  │  └─ footsteps-table
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ footstep.service.ts
│  │  │  ├─ footstep.types.ts
│  │  │  ├─ footstep.validation.ts
│  │  │  └─ index.ts
│  │  ├─ funds
│  │  │  ├─ components
│  │  │  ├─ fund.validation.ts
│  │  │  ├─ funds.service.ts
│  │  │  ├─ funds.types.ts
│  │  │  └─ index.ts
│  │  ├─ general-account-grouping-net-surplus-negative
│  │  │  ├─ components
│  │  │  ├─ general-account-grouping-net-surplus-negative.service.ts
│  │  │  ├─ general-account-grouping-net-surplus-negative.types.ts
│  │  │  ├─ general-account-grouping-net-surplus-negative.validation.ts
│  │  │  └─ index.ts
│  │  ├─ general-account-grouping-net-surplus-positive
│  │  │  ├─ components
│  │  │  ├─ general-account-grouping-net-surplus-positive.service.ts
│  │  │  ├─ general-account-grouping-net-surplus-positive.types.ts
│  │  │  ├─ general-account-grouping-net-surplus-positive.validation.ts
│  │  │  └─ index.ts
│  │  ├─ general-accounting-ledger-tag
│  │  │  ├─ components
│  │  │  ├─ general-accounting-ledger-tag.service.ts
│  │  │  ├─ general-accounting-ledger-tag.types.ts
│  │  │  ├─ general-accounting-ledger-tag.validation.ts
│  │  │  └─ index.ts
│  │  ├─ general-ledger
│  │  │  ├─ components
│  │  │  │  ├─ change-or-form.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ gl-books-create-report-form.tsx
│  │  │  │  ├─ general-ledger-source-badge.tsx
│  │  │  │  ├─ general-ledger-type-badge.tsx
│  │  │  │  ├─ ledger-detail.tsx
│  │  │  │  ├─ ledger-source-badge.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ adjustment-entry.tsx
│  │  │  │  │  ├─ cash-entry.tsx
│  │  │  │  │  ├─ check-voucher-entry.tsx
│  │  │  │  │  └─ general-ledger.tsx
│  │  │  │  ├─ pickers
│  │  │  │  │  ├─ general-ledger-source-combobox.tsx
│  │  │  │  │  └─ general-ledger-source-multi-picker.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ general-ledger-running-table
│  │  │  │     │  ├─ columns.tsx
│  │  │  │     │  ├─ index.tsx
│  │  │  │     │  └─ row-action-context.tsx
│  │  │  │     └─ general-ledger-table
│  │  │  │        ├─ columns.tsx
│  │  │  │        ├─ general-ledger-all-table.tsx
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ general-ledger.constants.ts
│  │  │  ├─ general-ledger.service.ts
│  │  │  ├─ general-ledger.types.ts
│  │  │  ├─ general-ledger.validation.ts
│  │  │  ├─ index.ts
│  │  │  └─ reports
│  │  │     ├─ general-ledger-report-templates.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        └─ al-1-normal.njk
│  │  ├─ general-ledger-account-grouping
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ general-ledger-account-grouping-update-form.tsx
│  │  │  │  └─ index.ts
│  │  │  ├─ general-ledger-account-grouping.service.ts
│  │  │  ├─ general-ledger-account-grouping.types.ts
│  │  │  ├─ general-ledger-account-grouping.validation.ts
│  │  │  └─ index.ts
│  │  ├─ general-ledger-accounts-grouping
│  │  │  └─ components
│  │  ├─ general-ledger-definition
│  │  │  ├─  context
│  │  │  │  ├─ general-ledger-context-provider.tsx
│  │  │  │  └─ use-general-ledger-controller.tsx
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  ├─ gl-account-actions.tsx
│  │  │  │  │  └─ gl-definition-actions.tsx
│  │  │  │  ├─ actions-button.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ account-history-create-report-form.tsx
│  │  │  │  │  ├─ account-ledger-report-form.tsx
│  │  │  │  │  ├─ balance-sheet-create-report-form.tsx
│  │  │  │  │  ├─ cash-flow-create-report-form.tsx
│  │  │  │  │  ├─ financial-statement-condition-create-report-form.tsx
│  │  │  │  │  ├─ general-ledger-accounts-view-modal.tsx
│  │  │  │  │  ├─ general-ledger-definition-create-update-form.tsx
│  │  │  │  │  ├─ gl-books-create-report-form.tsx
│  │  │  │  │  ├─ gl-cash-flow-modal.tsx
│  │  │  │  │  ├─ income-statement-create-report-form.tsx
│  │  │  │  │  ├─ post-gl-accounts-modal.tsx
│  │  │  │  │  ├─ sl-gl-comparison-create-report-form.tsx
│  │  │  │  │  ├─ sl-trx-gl-comparison-create-report-form.tsx
│  │  │  │  │  ├─ statements-of-operation-create-report-form.tsx
│  │  │  │  │  ├─ trial-balance-create-report-form.tsx
│  │  │  │  │  └─ update-fs-account-modal.tsx
│  │  │  │  ├─ general-ledger-definition-header-search.tsx
│  │  │  │  ├─ general-ledger-tree.tsx
│  │  │  │  ├─ gl-account-list.tsx
│  │  │  │  ├─ gl-definition-node.tsx
│  │  │  │  ├─ gl-fs-report-panel.tsx
│  │  │  │  ├─ gl-utils.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ general-ledger-definition.constants.ts
│  │  │  ├─ general-ledger-definition.service.ts
│  │  │  ├─ general-ledger-definition.types.ts
│  │  │  ├─ general-ledger-definition.validation.ts
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  └─ index.tsx
│  │  │  ├─ reports
│  │  │  │  ├─ account-ledger-report-templates.ts
│  │  │  │  ├─ general-ledger-report-templates.ts
│  │  │  │  └─ templates
│  │  │  │     ├─ acct_ldgr_t1.njk
│  │  │  │     └─ gl_bk_t1.njk
│  │  │  └─ store
│  │  │     └─ gl-fs-store.ts
│  │  ├─ generated-report
│  │  │  ├─ components
│  │  │  │  ├─ filters
│  │  │  │  │  ├─ context
│  │  │  │  │  │  └─ use-generate-report-filter-context.tsx
│  │  │  │  │  ├─ filter-rule.tsx
│  │  │  │  │  └─ report-filter.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ account-balance-create-report-form.tsx
│  │  │  │  │  ├─ account-column-list-form-section.tsx
│  │  │  │  │  ├─ account-holdout-create-report-form.tsx
│  │  │  │  │  ├─ adjustment-create-report-form.tsx
│  │  │  │  │  ├─ age-range-list-form-section.tsx
│  │  │  │  │  ├─ cash-check-disbursement-create-report-form.tsx
│  │  │  │  │  ├─ close-account-create-report-form.tsx
│  │  │  │  │  ├─ comaker-create-report-form.tsx
│  │  │  │  │  ├─ daily-cash-receipt-create-report-form.tsx
│  │  │  │  │  ├─ daily-collection-detail-create-report-form.tsx
│  │  │  │  │  ├─ daily-collection-summary-create-report-fom.tsx
│  │  │  │  │  ├─ daily-withdrawal-create-report-form.tsx
│  │  │  │  │  ├─ deposit-balances-create-report-form.tsx
│  │  │  │  │  ├─ direct-adjustment-create-report-form.tsx
│  │  │  │  │  ├─ earned-unearned-create-report-form.tsx
│  │  │  │  │  ├─ generate-report-create-update-modal.txt
│  │  │  │  │  ├─ grocery-loan-release-create-report-form.tsx
│  │  │  │  │  ├─ icpr-create-report-form.tsx
│  │  │  │  │  ├─ interest-share-capital-create-report-form.tsx
│  │  │  │  │  ├─ journal-voucher-create-report-form.tsx
│  │  │  │  │  ├─ ledger-create-report-form.tsx
│  │  │  │  │  ├─ loan-balances-create-report-form.tsx
│  │  │  │  │  ├─ loan-collection-detail-create-report-form.tsx
│  │  │  │  │  ├─ loan-collection-due-create-report-form.tsx
│  │  │  │  │  ├─ loan-collection-summary-create-report-form.tsx
│  │  │  │  │  ├─ loan-maturity-create-report-form.tsx
│  │  │  │  │  ├─ loan-protection-place-create-report-form.tsx
│  │  │  │  │  ├─ loan-receivable-create-report-form.tsx
│  │  │  │  │  ├─ loan-release-detail-create-report-form.tsx
│  │  │  │  │  ├─ loan-release-summary-create-report-form.tsx
│  │  │  │  │  ├─ loan-release-tabulated-create-report-form.tsx
│  │  │  │  │  ├─ loan-statement-create-report-form.tsx
│  │  │  │  │  ├─ member-listing-create-report-form.tsx
│  │  │  │  │  ├─ number-tag-create-report-form.tsx
│  │  │  │  │  ├─ other-funds-entry-create-report-form.tsx
│  │  │  │  │  ├─ paper-size-selector.tsx
│  │  │  │  │  ├─ past-due-on-installment-create-report-form.tsx
│  │  │  │  │  ├─ portfolio-at-risk-create-report-form.tsx
│  │  │  │  │  ├─ print-config-section.tsx
│  │  │  │  │  ├─ print-modal-config.txt
│  │  │  │  │  ├─ proof-of-purchase-create-report-form.tsx
│  │  │  │  │  ├─ rebate-create-report-form.tsx
│  │  │  │  │  ├─ share-capital-withdrawal-create-report-form.tsx
│  │  │  │  │  ├─ statement-of-account-create-report-form.tsx
│  │  │  │  │  ├─ subscription-fee-create-report-form.tsx
│  │  │  │  │  ├─ supposed-actual-collection-create-report-form.tsx
│  │  │  │  │  ├─ teller-monitoring-create-report-form.tsx
│  │  │  │  │  ├─ time-deposit-accrued-interest-create-report-form.tsx
│  │  │  │  │  ├─ time-deposit-balance-create-report-form.tsx
│  │  │  │  │  ├─ time-deposit-balance-ytd-create-report-form.tsx
│  │  │  │  │  ├─ time-deposit-create-report-form.tsx
│  │  │  │  │  └─ transaction-batch-create-report-form.tsx
│  │  │  │  ├─ generate-report-hooks
│  │  │  │  │  └─ use-report-generate.tsx
│  │  │  │  ├─ generated-report-template
│  │  │  │  │  ├─ generated-report-helper.utils.ts
│  │  │  │  │  └─ generated-report-template.tsx
│  │  │  │  ├─ generated-report-template-maker
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ generated-report-view
│  │  │  │  │  ├─ generated-report-components.tsx
│  │  │  │  │  ├─ generated-report-view.tsx
│  │  │  │  │  └─ global-generate-report-viewer.store.ts
│  │  │  │  ├─ generated-reports
│  │  │  │  │  ├─ generated-report-card.tsx
│  │  │  │  │  ├─ generated-report-status.tsx
│  │  │  │  │  ├─ generated-reports-filter.tsx
│  │  │  │  │  ├─ generated-reports-list.tsx
│  │  │  │  │  └─ model-combobox.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ report-page.tsx
│  │  │  │  ├─ paper-size-container.tsx
│  │  │  │  ├─ report-listener
│  │  │  │  │  ├─ report-listener-store.ts
│  │  │  │  │  └─ report-listener.headless.tsx
│  │  │  │  ├─ report-menu copy node version.txt
│  │  │  │  └─ report-menu.tsx
│  │  │  ├─ defaults
│  │  │  │  └─ no-template.njk
│  │  │  ├─ generated-report-template-registry.ts
│  │  │  ├─ generated-report.service.ts
│  │  │  ├─ generated-report.types.ts
│  │  │  ├─ generated-report.validation.ts
│  │  │  ├─ generated-reports.constants.ts
│  │  │  ├─ index.ts
│  │  │  └─ reports
│  │  │     ├─ account-balance-report-templates.ts
│  │  │     ├─ adjustment-report-templates.ts
│  │  │     ├─ cash-check-disbursement-templates.ts
│  │  │     ├─ cash-receipt-journal-report-templates.ts
│  │  │     ├─ close-account-report-templates.ts
│  │  │     ├─ daily-collection-detail-report-templates.ts
│  │  │     ├─ daily-collection-summary-report-templates.ts
│  │  │     ├─ daily-withdrawal-report-templates.ts
│  │  │     ├─ deposit-balances-templates.ts
│  │  │     ├─ direct-adustment-report-template.ts
│  │  │     ├─ journal-voucher-report-templates.ts
│  │  │     ├─ ledgger-report-templates.ts
│  │  │     ├─ loan-collection-detail-templates.ts
│  │  │     ├─ loan-collection-summary-report-templates.ts
│  │  │     ├─ loan-maturity-report-template.ts
│  │  │     ├─ loan-release-detail-report-templates.ts
│  │  │     ├─ loan-release-summary-report-templates.ts
│  │  │     ├─ loan-releases-tabulated-report-templates.ts
│  │  │     ├─ member-listing-report-templates.ts
│  │  │     ├─ number-tag-templates.ts
│  │  │     ├─ rebates-report-templates.ts
│  │  │     ├─ samples
│  │  │     │  ├─ page-breaker.md
│  │  │     │  ├─ signature.md
│  │  │     │  ├─ table.md
│  │  │     │  ├─ text.md
│  │  │     │  └─ variant-density-base.md
│  │  │     ├─ teller-monitoring-report-templates.ts
│  │  │     ├─ templates
│  │  │     │  ├─ account-balance-templates
│  │  │     │  │  └─ act-blnce-t1.njk
│  │  │     │  ├─ adjustment-templates
│  │  │     │  │  └─ adj-t1.njk
│  │  │     │  ├─ cash-check-disbursement-templates
│  │  │     │  │  ├─ csh-chk-dsbrsmnt-sglcol-t1.njk.njk
│  │  │     │  │  ├─ csh-chk-dsbrsmnt-stndrd-t1.njk
│  │  │     │  │  └─ csh-chk-dsbrsmnt-tbltd-t1.njk
│  │  │     │  ├─ cash-receipt-journal-templates
│  │  │     │  │  └─ csh-rcpt-journal-t1.njk
│  │  │     │  ├─ close-account-templates
│  │  │     │  │  └─ cls-accnt-t1.njk
│  │  │     │  ├─ daily-collection-summary-templates
│  │  │     │  │  └─ dly-col-summary-t1.njk
│  │  │     │  ├─ daily-collection-templates
│  │  │     │  │  ├─ dly-col-det-detail-summary.njk
│  │  │     │  │  ├─ dly-col-det-mlti-col-t1.njk
│  │  │     │  │  └─ dly-col-det-sgl-col-t1.njk
│  │  │     │  ├─ daily-withdrawal-templates
│  │  │     │  │  └─ dly-wthdrwl-t1.njk
│  │  │     │  ├─ deposit-balances-templates
│  │  │     │  │  ├─ dpst-blncs-cmbne-t1.njk
│  │  │     │  │  └─ dpst-blncs-per-tbl-t1.njk
│  │  │     │  ├─ direct-adjustment-templates
│  │  │     │  │  └─ drct-adj-t1.njk
│  │  │     │  ├─ journal-voucher-templates
│  │  │     │  │  └─ jrnl-vchr-t1.njk
│  │  │     │  ├─ ledger-templates
│  │  │     │  │  └─ ledger-t1.njk
│  │  │     │  ├─ loan-collection-detail-templates
│  │  │     │  │  ├─ ln-coll-detail-simple-t1.njk
│  │  │     │  │  └─ ln-coll-detail-standard-t1.njk
│  │  │     │  ├─ loan-collection-summary-templates
│  │  │     │  │  ├─ ln-col-smmry-list-int-earned-t1.njk
│  │  │     │  │  ├─ ln-col-smmry-list-t1.njk
│  │  │     │  │  └─ ln-col-smmry-smmry-t1.njk
│  │  │     │  ├─ loan-maturity-templates
│  │  │     │  │  ├─ ln-mtrty-stat-elapsed-t1.njk
│  │  │     │  │  ├─ ln-mtrty-stat-int-fines-t1.njk
│  │  │     │  │  ├─ ln-mtrty-stat-member-share-demog-t1.njk
│  │  │     │  │  └─ ln-mtrty-stat-t1.njk
│  │  │     │  ├─ loan-release-detail-templates
│  │  │     │  │  └─ ln-rls-detail-t1.njk
│  │  │     │  ├─ loan-release-summary-templates
│  │  │     │  │  ├─ ln-rls-smry-age-gender-matrix-t1.njk
│  │  │     │  │  ├─ ln-rls-smry-grouped-mbr-t1.njk
│  │  │     │  │  ├─ ln-rls-smry-grouped-summary-t1.njk
│  │  │     │  │  ├─ ln-rls-smry-grouped-t1.njk
│  │  │     │  │  ├─ ln-rls-smry-processor-t1.njk
│  │  │     │  │  └─ ln-rls-smry-release-t1.njk
│  │  │     │  ├─ loan-releases-tabulated-templates
│  │  │     │  │  ├─ ln-rls-rgstr-t1.njk
│  │  │     │  │  └─ ln-rls-tbltd-t1.njk
│  │  │     │  ├─ member-listing-templates
│  │  │     │  │  ├─ mmbr-lstng-bio-t1.njk
│  │  │     │  │  ├─ mmbr-lstng-compliance-tin-t1.njk
│  │  │     │  │  ├─ mmbr-lstng-detailed-loc-t1.njk
│  │  │     │  │  └─ mmbr-lstng-summary-stat-t1.njk
│  │  │     │  ├─ number-tag-templates
│  │  │     │  │  ├─ nmbr-tg-bl-t1.njk
│  │  │     │  │  └─ nmbr-tg-br-t1.njk
│  │  │     │  ├─ rebates-templates
│  │  │     │  │  └─ rbts-t1.njk
│  │  │     │  ├─ teller-monitoring-templates
│  │  │     │  │  ├─ tlr-mntrng-pr-tllr-t1.njk
│  │  │     │  │  ├─ tlr-mntrng-smry-t1.njk
│  │  │     │  │  └─ tlr-mntrng-wthdrwl-t1.njk
│  │  │     │  └─ transaction-batch-templates
│  │  │     │     └─ trnsctn-btch-t1.njk
│  │  │     └─ transaction-batch-report-templates.ts
│  │  ├─ generated-reports-download-users
│  │  │  ├─ generated-reports-download-users.service.ts
│  │  │  ├─ generated-reports-download-users.types.ts
│  │  │  ├─ generated-reports-download-users.validation.ts
│  │  │  └─ index.ts
│  │  ├─ generated-savings-interest
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ generate-savings-interest-create-form.tsx
│  │  │  │  │  ├─ generate-savings-interest-post-form.tsx
│  │  │  │  │  └─ mutual-fund-print-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ generated-savings-interest-page.tsx
│  │  │  │  └─ tables
│  │  │  │     └─ generated-savings-interest-table
│  │  │  │        ├─ columns.tsx
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ generated-savings-interest.constant.ts
│  │  │  ├─ generated-savings-interest.service.ts
│  │  │  ├─ generated-savings-interest.types.ts
│  │  │  ├─ generated-savings-interest.utils.ts
│  │  │  ├─ generated-savings-interest.validation.ts
│  │  │  └─ index.ts
│  │  ├─ generated-savings-interest-entry
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ generated-savings-interest-entry-create-update-form.tsx
│  │  │  │  ├─ savings-interest-entry-daily-balance-view.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ generated-savings-interest-entries-view.tsx
│  │  │  │     └─ generated-savings-interest-entry-table
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ generated-savings-interest-entry.service.ts
│  │  │  ├─ generated-savings-interest-entry.types.ts
│  │  │  ├─ generated-savings-interest-entry.validation.ts
│  │  │  └─ index.ts
│  │  ├─ gl-fs
│  │  │  ├─ gl-fs.services.ts
│  │  │  ├─ gl-fs.types.ts
│  │  │  └─ index.ts
│  │  ├─ grocery-computation-sheet
│  │  │  ├─ components
│  │  │  ├─ grocery-computation-sheet.service.ts
│  │  │  ├─ grocery-computation-sheet.types.ts
│  │  │  ├─ grocery-computation-sheet.validation.ts
│  │  │  └─ index.ts
│  │  ├─ grocery-computation-sheet-monthly
│  │  │  ├─ components
│  │  │  ├─ grocery-computation-sheet-monthly.service.ts
│  │  │  ├─ grocery-computation-sheet-monthly.types.ts
│  │  │  ├─ grocery-computation-sheet-monthly.validation.ts
│  │  │  └─ index.ts
│  │  ├─ heartbeat
│  │  │  ├─ components
│  │  │  │  └─ heartbeat
│  │  │  │     └─ index.tsx
│  │  │  ├─ heartbeat.service.ts
│  │  │  ├─ heartbeat.types.ts
│  │  │  ├─ index.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ holiday
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ holiday-create-update-form.tsx
│  │  │  │  ├─ holiday-editor.tsx
│  │  │  │  ├─ holidays-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ holidays.tsx
│  │  │  ├─ holiday.service.ts
│  │  │  ├─ holiday.types.ts
│  │  │  ├─ holiday.utils.ts
│  │  │  ├─ holiday.validation.ts
│  │  │  └─ index.ts
│  │  ├─ home
│  │  │  ├─ components
│  │  │  │  ├─ about
│  │  │  │  │  └─ team-member-card.tsx
│  │  │  │  ├─ home
│  │  │  │  │  ├─ faq-section.tsx
│  │  │  │  │  ├─ feature-card.tsx
│  │  │  │  │  ├─ feature-section.tsx
│  │  │  │  │  ├─ hero-home.tsx
│  │  │  │  │  ├─ intro-section.tsx
│  │  │  │  │  └─ our-services.tsx
│  │  │  │  ├─ side-panel-poster.tsx
│  │  │  │  ├─ subscription
│  │  │  │  │  └─ subscription-plan-card.tsx
│  │  │  │  └─ ui
│  │  │  │     ├─ banking.tsx
│  │  │  │     ├─ credit-card.tsx
│  │  │  │     └─ member-portal.tsx
│  │  │  ├─ home.constants.tsx
│  │  │  ├─ home.types.ts
│  │  │  └─ pages
│  │  │     ├─ about.tsx
│  │  │     ├─ contact-us.tsx
│  │  │     ├─ index.tsx
│  │  │     └─ subscription.tsx
│  │  ├─ include-negative-accounts
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ include-negative-account-create-update-form.tsx
│  │  │  │  └─ include-negative-accounts-table
│  │  │  │     ├─ action.tsx
│  │  │  │     ├─ columns.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ include-negative-accounts.service.ts
│  │  │  ├─ include-negative-accounts.types.ts
│  │  │  ├─ include-negative-accounts.validation.ts
│  │  │  └─ index.ts
│  │  ├─ interest-maturity
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ interest-maturity.service.ts
│  │  │  ├─ interest-maturity.types.ts
│  │  │  └─ interest-maturity.validation.ts
│  │  ├─ interest-rate-by-amount
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-by-amount.service.ts
│  │  │  ├─ interest-rate-by-amount.types.ts
│  │  │  └─ interest-rate-by-amount.validation.ts
│  │  ├─ interest-rate-by-date
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-by-date.service.ts
│  │  │  ├─ interest-rate-by-date.types.ts
│  │  │  └─ interest-rate-by-date.validation.ts
│  │  ├─ interest-rate-by-term
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-by-term.service.ts
│  │  │  ├─ interest-rate-by-term.types.ts
│  │  │  └─ interest-rate-by-term.validation.ts
│  │  ├─ interest-rate-by-terms-header
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-by-terms-header.service.ts
│  │  │  ├─ interest-rate-by-terms-header.types.ts
│  │  │  └─ interest-rate-by-terms-header.validation.ts
│  │  ├─ interest-rate-by-year
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-by-year.service.ts
│  │  │  ├─ interest-rate-by-year.types.ts
│  │  │  └─ interest-rate-by-year.validation.ts
│  │  ├─ interest-rate-percentage
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-percentage.service.ts
│  │  │  ├─ interest-rate-percentage.types.ts
│  │  │  └─ interest-rate-percentage.validation.ts
│  │  ├─ interest-rate-scheme
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ interest-rate-scheme.service.ts
│  │  │  ├─ interest-rate-scheme.types.ts
│  │  │  └─ interest-rate-scheme.validation.ts
│  │  ├─ inventory
│  │  │  ├─ components
│  │  │  │  ├─ inventory-barcode-scanner.tsx
│  │  │  │  ├─ inventory-entry-form.tsx
│  │  │  │  └─ inventory-item-list.tsx
│  │  │  ├─ helper
│  │  │  │  └─ index.ts
│  │  │  ├─ index.ts
│  │  │  ├─ inventory.service.ts
│  │  │  ├─ inventory.types.ts
│  │  │  ├─ inventory.validation.ts
│  │  │  └─ pages
│  │  │     ├─ index.tsx
│  │  │     └─ inventory-sidebar.tsx
│  │  ├─ inventory-brand
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ inventory-brancd-create-update-modal.tsx
│  │  │  │  ├─ inventory-brand-picker.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-brand.service.ts
│  │  │  ├─ inventory-brand.types.ts
│  │  │  ├─ inventory-brand.validation.ts
│  │  │  └─ pages
│  │  │     └─ inventory-brand.tsx
│  │  ├─ inventory-category
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ create-update-inventory-category-modal.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ inventory-category-picker.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-category.service.ts
│  │  │  ├─ inventory-category.types.ts
│  │  │  ├─ inventory-category.validation.ts
│  │  │  └─ pages
│  │  │     └─ inventory-category.tsx
│  │  ├─ inventory-entry
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-entry.service.ts
│  │  │  ├─ inventory-entry.types.ts
│  │  │  └─ inventory-entry.validation.ts
│  │  ├─ inventory-hazard
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ create-update-inventory-hazard-modal.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-hazard.service.ts
│  │  │  ├─ inventory-hazard.types.ts
│  │  │  ├─ inventory-hazard.validation.ts
│  │  │  └─ pages
│  │  │     └─ inventory-hazard.tsx
│  │  ├─ inventory-item
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-item.service.ts
│  │  │  ├─ inventory-item.types.ts
│  │  │  └─ inventory-item.validation.ts
│  │  ├─ inventory-stock
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-stock.service.ts
│  │  │  ├─ inventory-stock.types.ts
│  │  │  └─ inventory-stock.validation.ts
│  │  ├─ inventory-stock-entry
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-stock-entry.service.ts
│  │  │  ├─ inventory-stock-entry.types.ts
│  │  │  └─ inventory-stock-entry.validation.ts
│  │  ├─ inventory-supplier
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ create-update-inventory-supplier-modal.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ inventory-supplier-picker.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-supplier.service.ts
│  │  │  ├─ inventory-supplier.types.ts
│  │  │  ├─ inventory-supplier.validation.ts
│  │  │  └─ pages
│  │  │     └─ inventory-supplier.tsx
│  │  ├─ inventory-tag
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ inventory-tag-create-update-modal.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-tag.service.ts
│  │  │  ├─ inventory-tag.types.ts
│  │  │  ├─ inventory-tag.validation.ts
│  │  │  └─ pages
│  │  │     └─ inventory-tag.tsx
│  │  ├─ inventory-warehouse
│  │  │  ├─ components
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ create-update-inventory-warehouse-modal.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ inventory-warehouse.service.ts
│  │  │  ├─ inventory-warehouse.types.ts
│  │  │  ├─ inventory-warehouse.validation.ts
│  │  │  └─ pages
│  │  │     ├─ inventory-warehouse-picker.tsx
│  │  │     └─ inventory-warehouse.tsx
│  │  ├─ invitation-code
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ invitation-code-create-update-form.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ invitation-code.service.ts
│  │  │  ├─ invitation-code.types.ts
│  │  │  ├─ invitation-code.validation.ts
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ journal-voucher
│  │  │  ├─ components
│  │  │  │  ├─ Journal-voucher-card.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ journal-entry-table.tsx
│  │  │  │  │  ├─ journal-voucher-approve-release-modal.tsx
│  │  │  │  │  ├─ journal-voucher-create-print-modal.tsx
│  │  │  │  │  ├─ journal-voucher-create-update-modal.tsx
│  │  │  │  │  └─ journal-voucher-reprint-form.tsx
│  │  │  │  ├─ journal-voucher-skeleton-card.tsx
│  │  │  │  ├─ journal-voucher-status-badge.tsx
│  │  │  │  ├─ journal-voucher-status-indicator.tsx
│  │  │  │  ├─ modal-displays
│  │  │  │  │  └─ journal-voucher-release-invalid.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     ├─ journal-voucher-other-action.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ journal-voucher.service.ts
│  │  │  ├─ journal-voucher.types.ts
│  │  │  ├─ journal-voucher.utils.ts
│  │  │  ├─ journal-voucher.validation.ts
│  │  │  ├─ pages
│  │  │  │  └─ journal-voucher.tsx
│  │  │  └─ reports
│  │  │     ├─ jornal-voucher-template.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        ├─ jv-1-compact.njk
│  │  │        ├─ jv-1-large.njk
│  │  │        └─ jv-1-normal.njk
│  │  ├─ journal-voucher-entry
│  │  │  ├─ index.ts
│  │  │  ├─ journal-voucher-entry.service.ts
│  │  │  ├─ journal-voucher-entry.types.ts
│  │  │  └─ journal-voucher-entry.validation.ts
│  │  ├─ journal-voucher-tag
│  │  │  ├─ components
│  │  │  │  └─ journal-voucher-tag-management.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ journal-voucher-tag.service.ts
│  │  │  ├─ journal-voucher-tag.types.ts
│  │  │  └─ journal-voucher-tag.validation.ts
│  │  ├─ loan-account
│  │  │  ├─ index.ts
│  │  │  ├─ loan-account.service.ts
│  │  │  ├─ loan-account.types.ts
│  │  │  └─ loan-account.validation.ts
│  │  ├─ loan-amortization-schedule
│  │  │  ├─ components
│  │  │  │  └─ amortization-schedule-table.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-amortization-schedule.service.ts
│  │  │  ├─ loan-amortization-schedule.types.ts
│  │  │  ├─ loan-amortization-schedule.utils.ts
│  │  │  └─ loan-amortization-schedule.validation.ts
│  │  ├─ loan-clearance-analysis
│  │  │  ├─ components
│  │  │  │  └─ form
│  │  │  │     └─ loan-clearance-analysis-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-clearance-analysis.service.ts
│  │  │  ├─ loan-clearance-analysis.types.ts
│  │  │  └─ loan-clearance-analysis.validation.ts
│  │  ├─ loan-clearance-analysis-institution
│  │  │  ├─ components
│  │  │  │  └─ form
│  │  │  │     └─ loan-clearance-analysis-institution.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-clearance-analysis-institution.service.ts
│  │  │  ├─ loan-clearance-analysis-institution.types.ts
│  │  │  └─ loan-clearance-analysis-institution.validation.ts
│  │  ├─ loan-guaranteed-fund
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ loan-guaranteed-fund.service.ts
│  │  │  ├─ loan-guaranteed-fund.types.ts
│  │  │  └─ loan-guaranteed-fund.validation.ts
│  │  ├─ loan-guaranteed-fund-per-month
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ loan-guaranteed-fund-per-month.service.ts
│  │  │  ├─ loan-guaranteed-fund-per-month.types.ts
│  │  │  └─ loan-guaranteed-fund-per-month.validation.ts
│  │  ├─ loan-guide
│  │  │  ├─ components
│  │  │  │  └─ loan-guide.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-guide-constant.ts
│  │  │  ├─ loan-guide.service.ts
│  │  │  ├─ loan-guide.types.ts
│  │  │  ├─ loan-guide.utils.ts
│  │  │  └─ loan-guide.validation.ts
│  │  ├─ loan-ledger
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ loan-ledger-change-line-form.tsx
│  │  │  │  │  └─ loan-ledger-print-form.tsx
│  │  │  │  └─ loan-ledger-table
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-ledger.service.ts
│  │  │  ├─ loan-ledger.types.ts
│  │  │  └─ loan-ledger.validation.ts
│  │  ├─ loan-payment
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ loan-payables-form.tsx
│  │  │  │  └─ loan-payment.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-payment.service.ts
│  │  │  ├─ loan-payment.types.ts
│  │  │  ├─ loan-payment.validation.ts
│  │  │  └─ pages
│  │  │     └─ loan-payment-page.tsx
│  │  ├─ loan-purpose
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ loan-purpose-create-update-form.tsx
│  │  │  │  ├─ loan-purpose-combobox.tsx
│  │  │  │  ├─ loan-purpose-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ page
│  │  │  │     └─ loan-purpose.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-purpose.service.ts
│  │  │  ├─ loan-purpose.types.ts
│  │  │  └─ loan-purpose.validation.ts
│  │  ├─ loan-status
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ loan-status-create-update-form.tsx
│  │  │  │  ├─ loan-status-combobox.tsx
│  │  │  │  ├─ loan-status-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ page
│  │  │  │     └─ loan-status.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-status.service.ts
│  │  │  ├─ loan-status.types.ts
│  │  │  └─ loan-status.validation.ts
│  │  ├─ loan-tag
│  │  │  ├─ index.ts
│  │  │  ├─ loan-tag.service.ts
│  │  │  ├─ loan-tag.types.ts
│  │  │  └─ loan-tag.validation.ts
│  │  ├─ loan-terms-and-condition-amount-receipt
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ loan-terms-and-condition-amount-receipt-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-terms-and-condition-amount-receipt.service.ts
│  │  │  ├─ loan-terms-and-condition-amount-receipt.types.ts
│  │  │  └─ loan-terms-and-condition-amount-receipt.validation.ts
│  │  ├─ loan-terms-and-condition-suggested-payment
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ loan-terms-and-condition-suggested-payment-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-terms-and-condition-suggested-payment.service.ts
│  │  │  ├─ loan-terms-and-condition-suggested-payment.types.ts
│  │  │  └─ loan-terms-and-condition-suggested-payment.validation.ts
│  │  ├─ loan-transaction
│  │  │  ├─ components
│  │  │  │  ├─ confirm-dialog-displays
│  │  │  │  │  └─ loan-type-confirm-display.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ loan-add-interest-form.tsx
│  │  │  │  │  ├─ loan-edit-form.tsx
│  │  │  │  │  ├─ loan-inquire-advance-interest-fines-form.tsx
│  │  │  │  │  ├─ loan-print-form.tsx
│  │  │  │  │  ├─ loan-reprint-form.tsx
│  │  │  │  │  ├─ loan-suggested-amortization-form.tsx
│  │  │  │  │  ├─ loan-transaction-adjustment-form.tsx
│  │  │  │  │  ├─ loan-transaction-create-update-form
│  │  │  │  │  │  ├─ index.tsx
│  │  │  │  │  │  ├─ loan-clearance-analysis.tsx
│  │  │  │  │  │  ├─ loan-comaker-section.tsx
│  │  │  │  │  │  ├─ loan-entries-editor.tsx
│  │  │  │  │  │  └─ loan-terms-and-condition-receipt.tsx
│  │  │  │  │  └─ loan-transaction-signature-form.tsx
│  │  │  │  ├─ loan-amortization.tsx
│  │  │  │  ├─ loan-approve-release-display-modal.tsx
│  │  │  │  ├─ loan-collector-place-badge.tsx
│  │  │  │  ├─ loan-comaker-type-badge.tsx
│  │  │  │  ├─ loan-combobox.tsx
│  │  │  │  ├─ loan-mini-info-card.tsx
│  │  │  │  ├─ loan-mode-of-payment-badge.tsx
│  │  │  │  ├─ loan-mode-of-payment-combobox.tsx
│  │  │  │  ├─ loan-other-actions.tsx
│  │  │  │  ├─ loan-payment-status-type-badges.tsx
│  │  │  │  ├─ loan-picker-all.tsx
│  │  │  │  ├─ loan-picker.tsx
│  │  │  │  ├─ loan-status-badge.tsx
│  │  │  │  ├─ loan-status-indicator.tsx
│  │  │  │  ├─ loan-tag-manager.tsx
│  │  │  │  ├─ loan-transaction-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  ├─ loan-type-badge.tsx
│  │  │  │  ├─ loan-type-combobox.tsx
│  │  │  │  ├─ loan-view
│  │  │  │  │  ├─ loan-accounts-view.tsx
│  │  │  │  │  ├─ loan-comakers.tsx
│  │  │  │  │  ├─ loan-details.tsx
│  │  │  │  │  ├─ loan-ledger-header.tsx
│  │  │  │  │  ├─ loan-ledger-table
│  │  │  │  │  │  ├─ loan-ledger-table.tsx
│  │  │  │  │  │  └─ loan-ledger-table.utils.ts
│  │  │  │  │  └─ loan-view.tsx
│  │  │  │  ├─ member-loan-table-summary
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ modal-displays
│  │  │  │  │  └─ loan-release-invalid.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ loan-application.tsx
│  │  │  │  │  └─ loans.tsx
│  │  │  │  ├─ skeletons
│  │  │  │  │  └─ loan-view-skeleton.tsx
│  │  │  │  ├─ statistics
│  │  │  │  │  └─ loan-all-member-summary.tsx
│  │  │  │  └─ weekday-combobox.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-transaciton.utils.test.ts
│  │  │  ├─ loan-transaction.service.ts
│  │  │  ├─ loan-transaction.types.ts
│  │  │  ├─ loan-transaction.utils.ts
│  │  │  ├─ loan-transaction.validation.ts
│  │  │  ├─ loan.constants.ts
│  │  │  └─ reports
│  │  │     ├─ loan-transaction-templates.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        ├─ lrv-1-compact.njk
│  │  │        ├─ lrv-1-large.njk
│  │  │        └─ lrv-1-normal.njk
│  │  ├─ loan-transaction-entry
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ loan-transaction-entry-create-update-modal.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ loan-transaction-constant.ts
│  │  │  ├─ loan-transaction-entry.service.ts
│  │  │  ├─ loan-transaction-entry.types.ts
│  │  │  └─ loan-transaction-entry.validation.ts
│  │  ├─ location
│  │  │  ├─ components
│  │  │  │  └─ barangay-combobox.tsx
│  │  │  ├─ data
│  │  │  │  ├─ barangays.json
│  │  │  │  └─ cities-municipalities.json
│  │  │  ├─ index.ts
│  │  │  ├─ location.types.ts
│  │  │  └─ location.utils.ts
│  │  ├─ media
│  │  │  ├─ components
│  │  │  │  ├─ file-type.tsx
│  │  │  │  ├─ media-previewer.tsx
│  │  │  │  ├─ media-resource-file-icon.tsx
│  │  │  │  └─ media-uploader.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ media.service.ts
│  │  │  ├─ media.types.ts
│  │  │  └─ media.utils.ts
│  │  ├─ member-account-ledger
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-account-ledger.service.ts
│  │  │  └─ member-account-ledger.types.ts
│  │  ├─ member-accounting-ledger
│  │  │  ├─ components
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ member-accounting-ledger-picker.tsx
│  │  │  │  ├─ member-accounting-ledger-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ member-account-general-ledger-table
│  │  │  │  │     ├─ actions.tsx
│  │  │  │  │     ├─ columns.tsx
│  │  │  │  │     ├─ index.tsx
│  │  │  │  │     └─ transaction-member-account-modal.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-accounting-ledger.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-accounting-ledger.service.ts
│  │  │  ├─ member-accounting-ledger.types.ts
│  │  │  └─ member-accounting-ledger.validation.ts
│  │  ├─ member-address
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ member-address-create-update-form.tsx
│  │  │  │  └─ home-type-combobox.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-address.constants.ts
│  │  │  ├─ member-address.service.ts
│  │  │  ├─ member-address.types.ts
│  │  │  └─ member-address.validation.ts
│  │  ├─ member-asset
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-asset-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-asset-validation.ts
│  │  │  ├─ member-asset.service.ts
│  │  │  └─ member-asset.types.ts
│  │  ├─ member-bank-card
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-bank-card.service.ts
│  │  │  └─ member-bank-card.types.ts
│  │  ├─ member-center
│  │  │  ├─ components
│  │  │  │  ├─ member-center-combobox.tsx
│  │  │  │  ├─ member-center-create-update-form.tsx
│  │  │  │  ├─ member-center-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-center.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-center.service.ts
│  │  │  ├─ member-center.types.ts
│  │  │  └─ member-center.validation.ts
│  │  ├─ member-center-history
│  │  │  ├─ components
│  │  │  │  └─ center-history
│  │  │  │     ├─ columns.tsx
│  │  │  │     └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-center-history.service.ts
│  │  │  └─ member-center-history.types.ts
│  │  ├─ member-classification
│  │  │  ├─ components
│  │  │  │  ├─ member-classification-combobox.tsx
│  │  │  │  ├─ member-classification-create-update-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ member-classification.tsx
│  │  │  │  └─ tables
│  │  │  │     └─ member-classification-table
│  │  │  │        ├─ columns.tsx
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-classification.service.ts
│  │  │  ├─ member-classification.types.ts
│  │  │  └─ member-classification.validation.ts
│  │  ├─ member-classification-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ classification-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-classification-history.service.ts
│  │  │  └─ member-classification-history.types.ts
│  │  ├─ member-classification-interest-rate
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-classification-interest-rate.service.ts
│  │  │  └─ member-classification-interest-rate.types.ts
│  │  ├─ member-close-remark
│  │  │  ├─ components
│  │  │  │  ├─ closure-reasons-combobox.tsx
│  │  │  │  └─ forms
│  │  │  │     └─ member-profile-close-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-close-remark.constants.ts
│  │  │  ├─ member-close-remark.service.ts
│  │  │  ├─ member-close-remark.types.ts
│  │  │  └─ member-close-remark.validation.ts
│  │  ├─ member-contact-reference
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-contact-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-contact-reference.service.ts
│  │  │  ├─ member-contact-reference.types.ts
│  │  │  └─ member-contact-reference.validation.ts
│  │  ├─ member-damayan-extension-entry
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-damayan-extension-entry.service.ts
│  │  │  └─ member-damayan-extension-entry.types.ts
│  │  ├─ member-deduction-entry
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-deduction-entry.service.ts
│  │  │  └─ member-deduction-entry.types.ts
│  │  ├─ member-department
│  │  │  ├─ components
│  │  │  │  ├─ member-department-combobox.tsx
│  │  │  │  ├─ member-department-create-update-form.tsx
│  │  │  │  ├─ member-department-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-department.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-department.service.ts
│  │  │  ├─ member-department.types.ts
│  │  │  └─ member-department.validation.ts
│  │  ├─ member-department-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ department-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-department-history.service.ts
│  │  │  └─ member-department-history.types.ts
│  │  ├─ member-description-schema
│  │  │  ├─ index.ts
│  │  │  ├─ member-description-schema.service.ts
│  │  │  └─ member-description-schema.types.ts
│  │  ├─ member-educational-attainment
│  │  │  ├─ components
│  │  │  │  ├─ educational-attainment-combobox.tsx
│  │  │  │  └─ forms
│  │  │  │     └─ member-educational-attainment-create-update-form.tsx
│  │  │  ├─ constants.ts
│  │  │  ├─ index.ts
│  │  │  ├─ member-educational-attainment.service.ts
│  │  │  ├─ member-educational-attainment.types.ts
│  │  │  └─ member-educational-attainment.validation.ts
│  │  ├─ member-expense
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-expense-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-expense.service.ts
│  │  │  ├─ member-expense.types.ts
│  │  │  └─ member-expense.validation.ts
│  │  ├─ member-gender
│  │  │  ├─ components
│  │  │  │  ├─ member-gender-combobox.tsx
│  │  │  │  ├─ member-gender-create-update-form.tsx
│  │  │  │  ├─ member-genders-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-gender.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-gender.service.ts
│  │  │  ├─ member-gender.types.ts
│  │  │  └─ member-gender.validation.ts
│  │  ├─ member-gender-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ gender-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-gender-history.service.ts
│  │  │  └─ member-gender-history.types.ts
│  │  ├─ member-government-benefit
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ member-government-benefits-create-update-form.tsx
│  │  │  │  └─ government-id-combobox.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-government-benefit.service.ts
│  │  │  ├─ member-government-benefit.types.ts
│  │  │  └─ member-government-benefit.validation.ts
│  │  ├─ member-group
│  │  │  ├─ components
│  │  │  │  ├─ member-group-combobox.tsx
│  │  │  │  ├─ member-group-create-update-form.tsx
│  │  │  │  ├─ member-group-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-group.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-group.service.ts
│  │  │  ├─ member-group.types.ts
│  │  │  └─ member-group.validation.ts
│  │  ├─ member-group-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ group-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-group-history.service.ts
│  │  │  └─ member-group-history.types.ts
│  │  ├─ member-income
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-income-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-income.service.ts
│  │  │  ├─ member-income.types.ts
│  │  │  └─ member-income.validation.ts
│  │  ├─ member-joint-account
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-joint-account-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-joint-account.service.ts
│  │  │  ├─ member-joint-account.types.ts
│  │  │  └─ member-joint-account.validation.ts
│  │  ├─ member-mutual-fund-history
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-mutual-fund-history.service.ts
│  │  │  └─ member-mutual-fund-history.types.ts
│  │  ├─ member-occupation
│  │  │  ├─ components
│  │  │  │  ├─ member-occupation-combobox.tsx
│  │  │  │  ├─ member-occupation-create-update-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ member-occupation.tsx
│  │  │  │  └─ tables
│  │  │  │     └─ member-occupation-table
│  │  │  │        ├─ columns.tsx
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-occupation.service.ts
│  │  │  ├─ member-occupation.types.ts
│  │  │  └─ member-occupation.validation.ts
│  │  ├─ member-occupation-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ occupation-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-occupation-history.service.ts
│  │  │  └─ member-occupation-history.types.ts
│  │  ├─ member-other-information-entry
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-other-information-entry.service.ts
│  │  │  └─ member-other-information-entry.types.ts
│  │  ├─ member-profile
│  │  │  ├─ components
│  │  │  │  ├─ badges
│  │  │  │  │  └─ civil-status-badge.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ member-membership-form.tsx
│  │  │  │  │  ├─ member-personal-info-form.tsx
│  │  │  │  │  └─ member-profile-quick-create-form.tsx
│  │  │  │  ├─ member-closed-account-banner.tsx
│  │  │  │  ├─ member-histories.tsx
│  │  │  │  ├─ member-infos
│  │  │  │  │  ├─ banners
│  │  │  │  │  │  ├─ company-branch-display.tsx
│  │  │  │  │  │  ├─ member-closed-account-banner.tsx
│  │  │  │  │  │  └─ member-info-banner.tsx
│  │  │  │  │  ├─ displays
│  │  │  │  │  │  ├─ addresses-display.tsx
│  │  │  │  │  │  ├─ contact-numbers-display.tsx
│  │  │  │  │  │  ├─ member-descriptions-display.tsx
│  │  │  │  │  │  └─ member-file-archives-display.tsx
│  │  │  │  │  ├─ file-card.tsx
│  │  │  │  │  ├─ info-field.tsx
│  │  │  │  │  ├─ member-accounts-loans
│  │  │  │  │  │  ├─ index.tsx
│  │  │  │  │  │  ├─ member-account-general-ledger.tsx
│  │  │  │  │  │  ├─ member-accounting-ledger.tsx
│  │  │  │  │  │  └─ member-loan-summary.tsx
│  │  │  │  │  ├─ member-comakers.tsx
│  │  │  │  │  ├─ member-financial-info.tsx
│  │  │  │  │  ├─ member-general-membership-info.tsx
│  │  │  │  │  ├─ member-government-benefits-info.tsx
│  │  │  │  │  ├─ member-histories.tsx
│  │  │  │  │  ├─ member-medias-info.tsx
│  │  │  │  │  ├─ member-personal-info.tsx
│  │  │  │  │  ├─ recruited-members.tsx
│  │  │  │  │  ├─ section-card.tsx
│  │  │  │  │  ├─ section-title.tsx
│  │  │  │  │  └─ view-member-info.tsx
│  │  │  │  ├─ member-picker.tsx
│  │  │  │  ├─ member-profile-info-loan-view-card.tsx
│  │  │  │  ├─ member-profile-mini-info-card.tsx
│  │  │  │  ├─ member-profile-qr-result-card.tsx
│  │  │  │  ├─ member-profile-settings
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  ├─ member-profile-settings-banner.tsx
│  │  │  │  │  └─ settings-tab-pages
│  │  │  │  │     ├─ account-relationship
│  │  │  │  │     │  ├─ index.tsx
│  │  │  │  │     │  ├─ joint-accounts.tsx
│  │  │  │  │     │  └─ member-relative-accounts.tsx
│  │  │  │  │     ├─ empty-list-indicator.tsx
│  │  │  │  │     ├─ member-address-contact
│  │  │  │  │     │  ├─ index.tsx
│  │  │  │  │     │  └─ member-contact-references.tsx
│  │  │  │  │     ├─ member-educational-attainment
│  │  │  │  │     │  └─ index.tsx
│  │  │  │  │     ├─ member-financial-info
│  │  │  │  │     │  ├─ index.tsx
│  │  │  │  │     │  ├─ member-assets.tsx
│  │  │  │  │     │  ├─ member-expenses.tsx
│  │  │  │  │     │  └─ member-income.tsx
│  │  │  │  │     ├─ member-government-benefits
│  │  │  │  │     │  └─ index.tsx
│  │  │  │  │     ├─ member-profile-personal-info
│  │  │  │  │     │  └─ index.tsx
│  │  │  │  │     ├─ member-user-account
│  │  │  │  │     │  ├─ index.tsx
│  │  │  │  │     │  └─ member-account-card-mini.tsx
│  │  │  │  │     └─ membership-info.tsx
│  │  │  │  ├─ member-qr-scanner.tsx
│  │  │  │  ├─ modal-displays
│  │  │  │  │  └─ profile-closure-content.tsx
│  │  │  │  ├─ profile-connect-user-content.tsx
│  │  │  │  └─ tables
│  │  │  │     └─ members-profile-table
│  │  │  │        ├─ columns.tsx
│  │  │  │        ├─ index.tsx
│  │  │  │        └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-profile.service.ts
│  │  │  ├─ member-profile.types.ts
│  │  │  ├─ member-profile.utils.test.ts
│  │  │  ├─ member-profile.utils.ts
│  │  │  ├─ member-profile.validation.ts
│  │  │  └─ pages
│  │  │     ├─ member-profile-page.tsx
│  │  │     └─ member-profile-settings-page.tsx
│  │  ├─ member-profile-archive
│  │  │  ├─ components
│  │  │  │  ├─ form
│  │  │  │  │  ├─ update-member-profile-archive-form.tsx
│  │  │  │  │  └─ updatemember-profile-archive-upload-form.tsx
│  │  │  │  ├─ member-archive-item.tsx
│  │  │  │  └─ member-profile-archive-category-combobox.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-profile-archive.service.ts
│  │  │  ├─ member-profile-archive.types.ts
│  │  │  └─ member-profile-archive.validation.ts
│  │  ├─ member-profile-media
│  │  │  ├─ components
│  │  │  │  ├─ form
│  │  │  │  │  └─ update-member-profile-media-form.tsx
│  │  │  │  └─ member-media-item.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-profile-media.service.ts
│  │  │  ├─ member-profile-media.types.ts
│  │  │  └─ member-profile-media.validation.ts
│  │  ├─ member-recruits
│  │  │  ├─ index.ts
│  │  │  ├─ member-recruits.service.ts
│  │  │  └─ member-recruits.types.ts
│  │  ├─ member-relative-account
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-relative-account-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-relative-account.service.ts
│  │  │  ├─ member-relative-account.types.ts
│  │  │  ├─ member-relative-account.validation.ts
│  │  │  └─ member-relative.constants.ts
│  │  ├─ member-type
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ member-type-create-update-form.tsx
│  │  │  │  ├─ member-type-combobox.tsx
│  │  │  │  ├─ member-type-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ member-types.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-type.service.ts
│  │  │  ├─ member-type.types.ts
│  │  │  └─ member-type.validation.ts
│  │  ├─ member-type-history
│  │  │  ├─ components
│  │  │  │  └─ tables
│  │  │  │     └─ member-type-history
│  │  │  │        ├─ columns.tsx
│  │  │  │        └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ member-type-history.service.ts
│  │  │  └─ member-type-history.types.ts
│  │  ├─ member-user-account
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ member-account-create-update-form.tsx
│  │  │  ├─ member-user-account.service.ts
│  │  │  ├─ member-user-account.types.ts
│  │  │  └─ member-user-account.validation.ts
│  │  ├─ member-verification
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ member-verification.service.ts
│  │  │  └─ member-verification.types.ts
│  │  ├─ mutual-fund
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ mutual-fund-create-update-form
│  │  │  │  │  │  ├─ mutual-fund-additional-member-section.tsx
│  │  │  │  │  │  ├─ mutual-fund-create-update-form.tsx
│  │  │  │  │  │  ├─ mutual-fund-print-form.tsx
│  │  │  │  │  │  └─ mutual-fund-table-section.tsx
│  │  │  │  │  └─ mutual-fund-post-form.tsx
│  │  │  │  ├─ mutual-fund-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ pages
│  │  │  │     └─ mutual-fund-page.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ mutual-fund.constant.ts
│  │  │  ├─ mutual-fund.service.ts
│  │  │  ├─ mutual-fund.types.ts
│  │  │  ├─ mutual-fund.utils.ts
│  │  │  └─ mutual-fund.validation.ts
│  │  ├─ mutual-fund-additional-members
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  ├─ index.ts
│  │  │  ├─ mutual-fund-additional-members.service.ts
│  │  │  ├─ mutual-fund-additional-members.types.ts
│  │  │  └─ mutual-fund-additional-members.validation.ts
│  │  ├─ mutual-fund-entry
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ mutual-fund-entry-create-update-form.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ mutual-fund-entry-table
│  │  │  │     │  ├─ index.tsx
│  │  │  │     │  └─ row-action-context.tsx
│  │  │  │     └─ mutual-fund-entry-view.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ mutual-fund-entry.service.ts
│  │  │  ├─ mutual-fund-entry.types.ts
│  │  │  └─ mutual-fund-entry.validation.ts
│  │  ├─ mutual-fund-table
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  ├─ index.ts
│  │  │  ├─ mutual-fund-table.service.ts
│  │  │  ├─ mutual-fund-table.types.ts
│  │  │  └─ mutual-fund-table.validation.ts
│  │  ├─ notification
│  │  │  ├─ components
│  │  │  │  ├─ notification-view.tsx
│  │  │  │  └─ notification.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ notification.constant.ts
│  │  │  ├─ notification.service.ts
│  │  │  ├─ notification.types.ts
│  │  │  └─ notification.validation.ts
│  │  ├─ online-remittance
│  │  │  ├─ components
│  │  │  │  └─ forms
│  │  │  │     └─ online-remittance-create-update-form.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ online-remittance.service.ts
│  │  │  ├─ online-remittance.types.ts
│  │  │  └─ online-remittance.validation.ts
│  │  ├─ or-builder
│  │  │  ├─ index.tsx
│  │  │  ├─ or-builder.utils.test.ts
│  │  │  ├─ or-builder.utils.ts
│  │  │  └─ or-buildre.types.ts
│  │  ├─ organization
│  │  │  ├─ components
│  │  │  │  ├─ cards
│  │  │  │  │  ├─ organization-card-header.tsx
│  │  │  │  │  ├─ organization-card-label.tsx
│  │  │  │  │  ├─ organization-card-tooltip-content.tsx
│  │  │  │  │  ├─ organization-footer-card.tsx
│  │  │  │  │  ├─ organization-mini-card-tooltip.tsx
│  │  │  │  │  └─ organization-mini-card.tsx
│  │  │  │  ├─ categories-item.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ list-of-branches.tsx
│  │  │  │  ├─ modal
│  │  │  │  │  ├─ org-branches-modal.tsx
│  │  │  │  │  ├─ organization-details-modal.tsx
│  │  │  │  │  └─ organization-preview-modal.tsx
│  │  │  │  ├─ no-organization-view.tsx
│  │  │  │  ├─ onboarding-back.tsx
│  │  │  │  ├─ org-status-badge.tsx
│  │  │  │  ├─ organization-category-picker.tsx
│  │  │  │  ├─ organization-item-skeleton.tsx
│  │  │  │  ├─ organization-preview-display-skeleton.tsx
│  │  │  │  └─ organization-preview-display.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ organization-forms
│  │  │  │  ├─ branch-card-info.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ join-organization-form.tsx
│  │  │  │  ├─ organization-form-stepper.tsx
│  │  │  │  ├─ organization-forms.tsx
│  │  │  │  ├─ organization-stepper-config.ts
│  │  │  │  ├─ update-organization-form.tsx
│  │  │  │  └─ use-form-stepper-navigation.ts
│  │  │  ├─ organization.service.ts
│  │  │  ├─ organization.types.ts
│  │  │  ├─ organization.validation.ts
│  │  │  └─ pages
│  │  │     ├─ index.ts
│  │  │     ├─ onboarding
│  │  │     │  ├─ index.tsx
│  │  │     │  └─ with-organization
│  │  │     │     ├─ index.tsx
│  │  │     │     ├─ organization-list.tsx
│  │  │     │     └─ organization-preview-details-modal.tsx
│  │  │     ├─ organization
│  │  │     │  ├─ components
│  │  │     │  │  ├─ join-org-search.tsx
│  │  │     │  │  └─ organization-card-with-tool-tip.tsx
│  │  │     │  └─ index.tsx
│  │  │     └─ organization-details.tsx
│  │  ├─ organization-category
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ organization-category.service.ts
│  │  │  ├─ organization-category.types.ts
│  │  │  └─ organization-category.validation.ts
│  │  ├─ organization-daily-usage
│  │  │  └─ components
│  │  ├─ organization-media
│  │  │  ├─ components
│  │  │  │  ├─ organization-media-item.tsx
│  │  │  │  ├─ organization-media.tsx
│  │  │  │  └─ update-organization-media-modal.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ organization-media.service.ts
│  │  │  ├─ organization-media.types.ts
│  │  │  └─ organization-media.validation.ts
│  │  ├─ orgnaization-daily-usage
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ orgnaization-daily-usage.service.ts
│  │  │  ├─ orgnaization-daily-usage.types.ts
│  │  │  └─ orgnaization-daily-usage.validation.ts
│  │  ├─ other-fund
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ create-update-other-fund-modal.tsx
│  │  │  │  │  ├─ other-fund-approve-release-modal.tsx
│  │  │  │  │  ├─ other-fund-print-modal.tsx
│  │  │  │  │  └─ other-fund-reprint-form.tsx
│  │  │  │  ├─ other-fund-entry-table.tsx
│  │  │  │  ├─ other-fund-release-invalid.tsx
│  │  │  │  ├─ other-fund-status-badge.tsx
│  │  │  │  ├─ other-fund-status-indicatior.tsx
│  │  │  │  ├─ other-fund-tag-manager.tsx
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     ├─ other-fund-other-action.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ other-fund.service.ts
│  │  │  ├─ other-fund.types.ts
│  │  │  ├─ other-fund.validation.ts
│  │  │  ├─ pages
│  │  │  │  └─ other-fund-page.tsx
│  │  │  └─ reports
│  │  │     ├─ other-fund-templates.ts
│  │  │     ├─ template guide.md
│  │  │     └─ templates
│  │  │        ├─ ofv-1-compact.njk
│  │  │        ├─ ofv-1-large.njk
│  │  │        └─ ofv-1-normal.njk
│  │  ├─ other-fund-entry
│  │  │  ├─ index.ts
│  │  │  ├─ other-fund-entry.service.ts
│  │  │  ├─ other-fund-entry.types.ts
│  │  │  └─ other-fund-entry.validation.ts
│  │  ├─ other-fund-tag
│  │  │  ├─ index.ts
│  │  │  ├─ other-fund-tag.service.ts
│  │  │  ├─ other-fund-tag.types.ts
│  │  │  └─ other-fund-tag.validation.ts
│  │  ├─ payment-type
│  │  │  ├─ components
│  │  │  │  ├─ combobox
│  │  │  │  │  └─ payment-type-combobox.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  └─ payment-type-create-update-form.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  └─ tables
│  │  │  │     ├─ column.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  └─ index.tsx
│  │  │  ├─ payment-type.service.ts
│  │  │  ├─ payment-type.types.ts
│  │  │  └─ payment-type.validation.ts
│  │  ├─ pdf
│  │  │  ├─ components
│  │  │  │  └─ pdf-viewer
│  │  │  │     ├─ pdf-components.tsx
│  │  │  │     ├─ pdf-viewer-modal.tsx
│  │  │  │     └─ pdf-viewer.tsx
│  │  │  └─ pdf-utils.ts
│  │  ├─ permission
│  │  │  ├─ components
│  │  │  │  ├─ permission-action-badge.tsx
│  │  │  │  ├─ permission-guard.tsx
│  │  │  │  ├─ permission-matrix
│  │  │  │  │  ├─ permission-checkbox.tsx
│  │  │  │  │  └─ permission-matrix.tsx
│  │  │  │  └─ permission-not-allowed-display.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ permission.constants.ts
│  │  │  ├─ permission.service.ts
│  │  │  ├─ permission.types.ts
│  │  │  ├─ permission.utils.test.ts
│  │  │  ├─ permission.utils.ts
│  │  │  └─ permission.validation.ts
│  │  ├─ permission-template
│  │  │  ├─ components
│  │  │  │  ├─ pages
│  │  │  │  │  └─ permission-template.tsx
│  │  │  │  ├─ permission
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ permission-view.tsx
│  │  │  │  ├─ permission-template-create-update-form.tsx
│  │  │  │  ├─ permission-template-picker.tsx
│  │  │  │  └─ permission-template-table
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ permission-template.service.ts
│  │  │  ├─ permission-template.types.ts
│  │  │  └─ permission-template.validation.ts
│  │  ├─ playground
│  │  │  ├─ components
│  │  │  │  ├─ broadcaster.tsx
│  │  │  │  ├─ pdf-uploader.tsx
│  │  │  │  └─ tanstack-virtual-pinning-sample.tsx
│  │  │  └─ pages
│  │  │     └─ index.tsx
│  │  ├─ post-dated-check
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ post-dated-check.service.ts
│  │  │  ├─ post-dated-check.types.ts
│  │  │  └─ post-dated-check.validation.ts
│  │  ├─ qr-crypto
│  │  │  ├─ index.ts
│  │  │  ├─ qr-crypto.service.ts
│  │  │  └─ qr-crypto.types.ts
│  │  ├─ quick-transfer
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ quick-transfer-transaction-form.tsx
│  │  │  │  ├─ history
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  └─ quick-deposit-withdraw.tsx
│  │  │  ├─ context
│  │  │  │  ├─ quick-transfer-context.tsx
│  │  │  │  └─ quick-transfer-form-controller.ts
│  │  │  ├─ hooks
│  │  │  │  └─ use-quick-hot-keys.ts
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  ├─ deposit-withdraw.tsx
│  │  │  │  └─ index.tsx
│  │  │  ├─ quick-transfer.service.ts
│  │  │  ├─ quick-transfer.types.ts
│  │  │  ├─ quick-transfer.utils.ts
│  │  │  └─ quick-transfer.validation.ts
│  │  ├─ settings
│  │  │  ├─ components
│  │  │  │  ├─ appearance-settings
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  ├─ light-dark-mode-settings.tsx
│  │  │  │  │  ├─ themes-settings.tsx
│  │  │  │  │  └─ transition-settings.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ settings.tsx
│  │  │  │  └─ theme-picker.tsx
│  │  │  ├─ data
│  │  │  │  └─ themes.json
│  │  │  └─ provider
│  │  │     └─ theme-provider.tsx
│  │  ├─ subscription-plan
│  │  │  ├─ components
│  │  │  │  └─ subscription-plan
│  │  │  │     └─ subscription.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ subscription-plan.service.ts
│  │  │  ├─ subscription-plan.types.ts
│  │  │  └─ subscription-plan.validation.ts
│  │  ├─ tag-template
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  └─ tag-template-create-update-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ tag-template.tsx
│  │  │  │  ├─ tag-template-category-badge.tsx
│  │  │  │  ├─ tag-template-picker.tsx
│  │  │  │  └─ tag-template-table
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ tag-template.service.ts
│  │  │  ├─ tag-template.types.ts
│  │  │  ├─ tag-template.validation.ts
│  │  │  └─ tag.constants.ts
│  │  ├─ time-deposit-computation
│  │  │  ├─ index.ts
│  │  │  ├─ time-deposit-computation.service.ts
│  │  │  ├─ time-deposit-computation.types.ts
│  │  │  └─ time-deposit-computation.validation.ts
│  │  ├─ time-deposit-computation-pre-mature
│  │  │  ├─ index.ts
│  │  │  ├─ time-deposit-computation-pre-mature.service.ts
│  │  │  ├─ time-deposit-computation-pre-mature.types.ts
│  │  │  └─ time-deposit-computation-pre-mature.validation.ts
│  │  ├─ time-deposit-type
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ time-deposit-type-create-form.tsx
│  │  │  │  │  └─ time-deposit-type-update-form
│  │  │  │  │     ├─ time-deposit-computation-pre-mature-section.tsx
│  │  │  │  │     ├─ time-deposit-computation-section.tsx
│  │  │  │  │     └─ time-deposit-type-update-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ time-deposit-type.tsx
│  │  │  │  └─ time-deposit-type
│  │  │  │     ├─ time-deposit-type-editor.tsx
│  │  │  │     └─ time-deposit-type-sidebar.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ time-deposit-type.service.ts
│  │  │  ├─ time-deposit-type.types.ts
│  │  │  └─ time-deposit-type.validation.ts
│  │  ├─ time-machine-log
│  │  │  ├─ components
│  │  │  │  ├─ cancel-time-machine-modal.tsx
│  │  │  │  ├─ time-left.tsx
│  │  │  │  ├─ time-machine-log-display.tsx
│  │  │  │  ├─ time-machine-log-list.tsx
│  │  │  │  ├─ time-machine-modal.tsx
│  │  │  │  └─ time-mahine-list-item.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ use-auto-cancel-time-machine.ts
│  │  │  │  └─ use-time-left.ts
│  │  │  ├─ index.ts
│  │  │  ├─ time-machine-log.service.ts
│  │  │  ├─ time-machine-log.types.ts
│  │  │  ├─ time-machine-log.utils.ts
│  │  │  └─ time-machine-log.validation.ts
│  │  ├─ timesheet
│  │  │  ├─ components
│  │  │  │  ├─ nav-time-in-bar.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ branch-timesheet.tsx
│  │  │  │  ├─ timesheet-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ worktimer
│  │  │  │     ├─ index.tsx
│  │  │  │     ├─ realtime-time-text.tsx
│  │  │  │     ├─ time-in-out.tsx
│  │  │  │     ├─ utils.ts
│  │  │  │     ├─ utils.unit.test.ts
│  │  │  │     └─ work-time-duration-display.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ timeshee.validation.ts
│  │  │  ├─ timesheet.service.ts
│  │  │  └─ timesheet.types.ts
│  │  ├─ transaction
│  │  │  ├─ components
│  │  │  │  ├─ actions
│  │  │  │  │  └─ transaction-actions.tsx
│  │  │  │  ├─ current-payment
│  │  │  │  │  ├─ transaction-current-payment-item.tsx
│  │  │  │  │  ├─ transaction-current-payment.tsx
│  │  │  │  │  └─ transaction-no-current-payment-found.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ create-payment-with-transaction-form.tsx
│  │  │  │  │  ├─ payment-wrapper.tsx
│  │  │  │  │  └─ transaction-form.tsx
│  │  │  │  ├─ history
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ transaction-no-found.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ input
│  │  │  │  │  └─ transaction-reference-number-field.tsx
│  │  │  │  ├─ modals
│  │  │  │  │  ├─ joint-member
│  │  │  │  │  │  ├─ joint-member-picker.tsx
│  │  │  │  │  │  └─ transaction-member-profile.tsx
│  │  │  │  │  ├─ transaction-modal-no-found-batch.tsx
│  │  │  │  │  ├─ transaction-modal-request-reverse.tsx
│  │  │  │  │  └─ transaction-modal-success-payment.tsx
│  │  │  │  ├─ skeleton
│  │  │  │  │  ├─ transaction-payment-entry-skeleton.tsx
│  │  │  │  │  └─ transaction-skeleton-card.tsx
│  │  │  │  ├─ tables
│  │  │  │  │  └─ transaction-account-member-ledger.tsx
│  │  │  │  ├─ transaction-card-item.tsx
│  │  │  │  ├─ transaction-details.tsx
│  │  │  │  ├─ transaction-member-scanner.tsx
│  │  │  │  ├─ transaction-message-generator.tsx
│  │  │  │  ├─ transaction-user-info-grid.tsx
│  │  │  │  └─ view
│  │  │  │     ├─ transaction-joint-member-card.tsx
│  │  │  │     └─ transaction-view-no-member-selected.tsx
│  │  │  ├─ context
│  │  │  │  └─ transaction-context.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ use-navigate.tsx
│  │  │  │  ├─ use-transaction-controller.ts
│  │  │  │  ├─ use-transaction-hot-keys.tsx
│  │  │  │  └─ use-transaction-payment-success.ts
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  └─ index.tsx
│  │  │  ├─ transaction.service.ts
│  │  │  ├─ transaction.types.ts
│  │  │  ├─ transaction.utils.ts
│  │  │  └─ transaction.validation.ts
│  │  ├─ transaction-batch
│  │  │  ├─ components
│  │  │  │  ├─ approval-kanbans
│  │  │  │  │  ├─ blotter-request-kanban.tsx
│  │  │  │  │  └─ ended-transaction-batch-kanban.tsx
│  │  │  │  ├─ batch-nav-button.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ transaction-batch-create-form.tsx
│  │  │  │  │  ├─ transaction-batch-end-form.tsx
│  │  │  │  │  └─ transaction-batch-sign-create-update-form.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ transaction-batch.tsx
│  │  │  │  ├─ trans-batch-title-user-display.tsx
│  │  │  │  ├─ transaction-batch
│  │  │  │  │  ├─ batch-blotter-summary.tsx
│  │  │  │  │  ├─ batch-blotter.tsx
│  │  │  │  │  ├─ deposit-in-bank
│  │  │  │  │  │  ├─ deposit-in-bank-card.tsx
│  │  │  │  │  │  └─ deposit-in-bank-edit-form.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  ├─ remittance
│  │  │  │  │  │  ├─ check-remittance.tsx
│  │  │  │  │  │  └─ online-remittance.tsx
│  │  │  │  │  ├─ transaction-batch-cash-count
│  │  │  │  │  │  ├─ batch-cash-count.tsx
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ transaction-batch-disbursements.tsx
│  │  │  │  │  ├─ transaction-batch-funding-card
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ transaction-batch-histories
│  │  │  │  │  │  ├─ batch-funding-history.tsx
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ transaction-batch-mini-card.tsx
│  │  │  │  │  ├─ transaction-batch-quick-view
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ transaction-batch-status-indicator.tsx
│  │  │  │  │  ├─ transaction-batch-utils.test.ts
│  │  │  │  │  └─ transaction-batch-utils.ts
│  │  │  │  ├─ transaction-batch-date-mismatch-display.tsx
│  │  │  │  ├─ transaction-batch-table
│  │  │  │  │  ├─ columns.tsx
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ row-action-context.tsx
│  │  │  │  └─ unclosed-transaction-batch
│  │  │  │     └─ unclosed-transaction-batch.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ store
│  │  │  │  └─ transaction-batch-store.ts
│  │  │  ├─ transaction-batch.service.ts
│  │  │  ├─ transaction-batch.types.ts
│  │  │  └─ transaction-batch.validation.ts
│  │  ├─ transaction-tag
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ transaction-tag.service.ts
│  │  │  └─ transaction-tag.types.ts
│  │  ├─ transactions
│  │  │  ├─ components
│  │  │  │  ├─ index.ts
│  │  │  │  └─ tables
│  │  │  │     ├─ columns.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ row-action-context.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ pages
│  │  │  │  └─ index.tsx
│  │  │  ├─ transactions.service.ts
│  │  │  ├─ transactions.types.ts
│  │  │  └─ transactions.validation.ts
│  │  ├─ unbalance-account
│  │  │  ├─ index.ts
│  │  │  ├─ unbalance-account.service.ts
│  │  │  ├─ unbalance-account.types.ts
│  │  │  ├─ unbalance-account.utils.ts
│  │  │  └─ unbalance-account.validation.ts
│  │  ├─ user
│  │  │  ├─ components
│  │  │  │  ├─ hover-user-info.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  └─ my-timesheet.tsx
│  │  │  │  └─ user-avatar.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ user.constants.ts
│  │  │  ├─ user.service.ts
│  │  │  ├─ user.types.ts
│  │  │  └─ user.validation.ts
│  │  ├─ user-organization
│  │  │  ├─ components
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ user-org-permission-update-form.tsx
│  │  │  │  │  └─ user-org-settings-form.tsx
│  │  │  │  ├─ time-machine-time-status-bar.tsx
│  │  │  │  ├─ user-org-settings
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ user-organization-application-status-badge.tsx
│  │  │  │  └─ user-organization-picker.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ user-organization-utils.ts
│  │  │  ├─ user-organization.service.ts
│  │  │  ├─ user-organization.types.ts
│  │  │  └─ user-organization.validation.ts
│  │  ├─ user-profile
│  │  │  ├─ components
│  │  │  │  ├─ account-profile-picture.tsx
│  │  │  │  ├─ account-qr.tsx
│  │  │  │  ├─ account-settings-sidebar.tsx
│  │  │  │  ├─ account-settings-user-banner.tsx
│  │  │  │  ├─ accounts-settings
│  │  │  │  │  ├─ contact-info.tsx
│  │  │  │  │  ├─ external-links.tsx
│  │  │  │  │  ├─ mobile-dropdown.tsx
│  │  │  │  │  ├─ navigation-section.tsx
│  │  │  │  │  └─ quick-actions.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ account-general-form.tsx
│  │  │  │  │  ├─ account-profile-form.tsx
│  │  │  │  │  ├─ account-security-form.tsx
│  │  │  │  │  └─ account.inactivity.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ use-get-use-settings.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ modals
│  │  │  │  │  └─ user-inactivity-modal.tsx
│  │  │  │  ├─ nav
│  │  │  │  │  └─ nav-profile-menu.tsx
│  │  │  │  ├─ user-profile-inactivity-prompter.tsx
│  │  │  │  └─ verify-notice
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ verify-contact-bar.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ use-user-profile-inactivity-hook.ts
│  │  │  ├─ index.ts
│  │  │  ├─ store
│  │  │  │  └─ profile-inactivity-store.ts
│  │  │  ├─ user-profile.constants.ts
│  │  │  ├─ user-profile.service.ts
│  │  │  ├─ user-profile.types.ts
│  │  │  └─ user-profile.validation.ts
│  │  ├─ user-rating
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ user-rating.service.ts
│  │  │  ├─ user-rating.types.ts
│  │  │  └─ user-rating.validation.ts
│  │  └─ voucher-pay-to
│  │     ├─ components
│  │     ├─ index.ts
│  │     ├─ voucher-pay-to.service.ts
│  │     ├─ voucher-pay-to.types.ts
│  │     └─ voucher-pay-to.validation.ts
│  ├─ providers
│  │  ├─ action-security-provider.tsx
│  │  ├─ api
│  │  │  ├─ client.ts
│  │  │  ├─ index.ts
│  │  │  └─ streamer.ts
│  │  ├─ connection-provider.tsx
│  │  ├─ global-hotkeys-provider.tsx
│  │  ├─ head-provider.tsx
│  │  ├─ repositories
│  │  │  ├─ api-crud-factory.ts
│  │  │  ├─ data-layer-factory.ts
│  │  │  └─ mutation-factory.ts
│  │  ├─ scroll-parent-provider.tsx
│  │  └─ storage
│  │     ├─ index.ts
│  │     ├─ storage.index-storage.ts
│  │     ├─ storage.types.ts
│  │     └─ storage.utils.ts
│  ├─ routeTree.gen.ts
│  ├─ routes
│  │  ├─ (landing)
│  │  │  ├─ -landing-components
│  │  │  │  ├─ mission-vision.tsx
│  │  │  │  ├─ policy-nav.tsx
│  │  │  │  └─ version
│  │  │  │     ├─ feedback-form.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     ├─ version-and-feedback.tsx
│  │  │  │     └─ version-updates.tsx
│  │  │  ├─ about.tsx
│  │  │  ├─ contact.tsx
│  │  │  ├─ developers.tsx
│  │  │  ├─ explore
│  │  │  │  ├─ $organization_id.tsx
│  │  │  │  └─ route.tsx
│  │  │  ├─ frequently-asked-questions.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ policy
│  │  │  │  ├─ -components
│  │  │  │  │  ├─ link-tag.tsx
│  │  │  │  │  └─ site-policy-items.tsx
│  │  │  │  ├─ aml-ctf-policy.tsx
│  │  │  │  ├─ code-of-conduct-ethics-policy.tsx
│  │  │  │  ├─ complaint-handling-and-dispute-policy.tsx
│  │  │  │  ├─ cookie-policy.tsx
│  │  │  │  ├─ data-protection-policy.tsx
│  │  │  │  ├─ developer-policy.tsx
│  │  │  │  ├─ fee-and-charges-policy.tsx
│  │  │  │  ├─ kyc-policy.tsx
│  │  │  │  ├─ privacy-policy.tsx
│  │  │  │  ├─ risk-management-policy.tsx
│  │  │  │  ├─ route.tsx
│  │  │  │  ├─ security-policy.tsx
│  │  │  │  ├─ terms-and-condition.tsx
│  │  │  │  └─ terms-of-use.tsx
│  │  │  ├─ route.tsx
│  │  │  └─ subscription.tsx
│  │  ├─ -common-pages
│  │  │  ├─ error-page.tsx
│  │  │  └─ not-found-page.tsx
│  │  ├─ __root.tsx
│  │  ├─ account-profile
│  │  │  ├─ appearance.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ qr.tsx
│  │  │  ├─ route.tsx
│  │  │  ├─ security.tsx
│  │  │  └─ verify
│  │  │     ├─ contact.tsx
│  │  │     └─ email.tsx
│  │  ├─ auth
│  │  │  ├─ -components
│  │  │  │  ├─ auth-page-wrapper.tsx
│  │  │  │  ├─ not-found.tsx
│  │  │  │  └─ resend-verify-contact-button.tsx
│  │  │  ├─ -hooks
│  │  │  │  └─ use-count-down.ts
│  │  │  ├─ -validations
│  │  │  │  └─ page-search.ts
│  │  │  ├─ forgot-password.tsx
│  │  │  ├─ password-reset.$resetId.tsx
│  │  │  ├─ route.tsx
│  │  │  ├─ sign-in.tsx
│  │  │  └─ sign-up.lazy.tsx
│  │  ├─ onboarding
│  │  │  ├─ create-branch.$organization_id.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ organization
│  │  │  │  ├─ $organization_id.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ route.tsx
│  │  │  ├─ route.tsx
│  │  │  └─ setup-org.tsx
│  │  ├─ org
│  │  │  ├─ $orgname
│  │  │  │  └─ branch.$branchname
│  │  │  │     ├─ (accounting)
│  │  │  │     │  ├─ accounts.tsx
│  │  │  │     │  ├─ check-warehousing.tsx
│  │  │  │     │  └─ financial-statement-definition.tsx
│  │  │  │     ├─ (approvals)
│  │  │  │     │  └─ approvals.tsx
│  │  │  │     ├─ (blotter)
│  │  │  │     │  ├─ cash-count.tsx
│  │  │  │     │  ├─ general-ledger-definition.tsx
│  │  │  │     │  └─ transaction-batch.tsx
│  │  │  │     ├─ (common)
│  │  │  │     │  ├─ (settings)
│  │  │  │     │  │  └─ settings.tsx
│  │  │  │     │  ├─ dashboard.tsx
│  │  │  │     │  └─ feed.tsx
│  │  │  │     ├─ (employees)
│  │  │  │     │  ├─ employee-footsteps.tsx
│  │  │  │     │  ├─ invitation-code.tsx
│  │  │  │     │  ├─ permission-template.tsx
│  │  │  │     │  ├─ timesheets.tsx
│  │  │  │     │  └─ view-employees.tsx
│  │  │  │     ├─ (inventory)
│  │  │  │     │  └─ inventory.tsx
│  │  │  │     ├─ (inventory-maintenance)
│  │  │  │     │  ├─ inventory-brand.tsx
│  │  │  │     │  ├─ inventory-category.tsx
│  │  │  │     │  ├─ inventory-hazard.tsx
│  │  │  │     │  ├─ inventory-supplier.tsx
│  │  │  │     │  ├─ inventory-tag.tsx
│  │  │  │     │  └─ inventory-warehouse.tsx
│  │  │  │     ├─ (members)
│  │  │  │     │  ├─ member-accounting-ledger.tsx
│  │  │  │     │  ├─ member-profile.$memberId.$settings
│  │  │  │     │  │  └─ index.tsx
│  │  │  │     │  ├─ member-settings
│  │  │  │     │  │  ├─ member-center.tsx
│  │  │  │     │  │  ├─ member-classification.tsx
│  │  │  │     │  │  ├─ member-department.tsx
│  │  │  │     │  │  ├─ member-gender.tsx
│  │  │  │     │  │  ├─ member-group.tsx
│  │  │  │     │  │  ├─ member-occupation.tsx
│  │  │  │     │  │  └─ member-types.tsx
│  │  │  │     │  └─ view-members.tsx
│  │  │  │     ├─ (schemes)
│  │  │  │     │  └─ schemes
│  │  │  │     │     └─ index.tsx
│  │  │  │     ├─ (settings)
│  │  │  │     │  └─ my-settings
│  │  │  │     │     ├─ my-all-footsteps.tsx
│  │  │  │     │     ├─ my-branch-footsteps.tsx
│  │  │  │     │     ├─ my-disbursement-transaction.tsx
│  │  │  │     │     ├─ my-general-ledger-entries.tsx
│  │  │  │     │     └─ my-timesheet.tsx
│  │  │  │     ├─ (transactions)
│  │  │  │     │  ├─ adjustment-entry.tsx
│  │  │  │     │  ├─ cash-check-journal-voucher.tsx
│  │  │  │     │  ├─ deposit.tsx
│  │  │  │     │  ├─ disbursement-transaction.tsx
│  │  │  │     │  ├─ journal-voucher.tsx
│  │  │  │     │  ├─ loan-payment.tsx
│  │  │  │     │  ├─ loan.tsx
│  │  │  │     │  ├─ other-fund.tsx
│  │  │  │     │  ├─ payment.tsx
│  │  │  │     │  ├─ transactions.tsx
│  │  │  │     │  └─ withdraw.tsx
│  │  │  │     ├─ dev
│  │  │  │     │  └─ documentation.tsx
│  │  │  │     ├─ index.tsx
│  │  │  │     ├─ maintenance
│  │  │  │     │  ├─ accounts
│  │  │  │     │  │  ├─ account-category.tsx
│  │  │  │     │  │  ├─ account-classification.tsx
│  │  │  │     │  │  ├─ disbursement-type.tsx
│  │  │  │     │  │  └─ payment-type.tsx
│  │  │  │     │  ├─ area.tsx
│  │  │  │     │  ├─ banks.tsx
│  │  │  │     │  ├─ bills-and-coins.tsx
│  │  │  │     │  ├─ company.tsx
│  │  │  │     │  ├─ holidays.tsx
│  │  │  │     │  ├─ loans
│  │  │  │     │  │  ├─ collateral.tsx
│  │  │  │     │  │  ├─ loan-application.tsx
│  │  │  │     │  │  ├─ loan-purpose.tsx
│  │  │  │     │  │  └─ loan-status.tsx
│  │  │  │     │  └─ tag-template.tsx
│  │  │  │     ├─ route.tsx
│  │  │  │     └─ system
│  │  │  │        ├─ account-transaction.tsx
│  │  │  │        ├─ generate-mutual-aid.tsx
│  │  │  │        ├─ generate-savings-interest.tsx
│  │  │  │        └─ report.tsx
│  │  │  └─ $orgname.tsx
│  │  ├─ playground.tsx
│  │  └─ report-template-maker.tsx
│  ├─ store
│  │  ├─ action-security-store.ts
│  │  ├─ cash-check-voucher-store.ts
│  │  ├─ confirm-modal-store.ts
│  │  ├─ financial-statement-accounts-grouping-store.txt
│  │  ├─ generated-report-config-store.ts
│  │  ├─ image-preview-store.ts
│  │  ├─ info-modal-store.ts
│  │  ├─ journal-voucher-store.ts
│  │  ├─ live-monitoring-store.ts
│  │  ├─ map-store.ts
│  │  ├─ member-picker-store.ts
│  │  ├─ name-confirm-modal-store.ts
│  │  ├─ nats-pubsub-store.ts
│  │  ├─ onboarding
│  │  │  └─ category-store.ts
│  │  ├─ selected-organization.store.ts
│  │  ├─ signature-store.ts
│  │  ├─ transaction
│  │  │  ├─ deposit-withdraw-store.tsx
│  │  │  ├─ transaction-store.ts
│  │  │  └─ use-verify-request-reverse-transaction.ts
│  │  └─ transaction-reverse-security-store.ts
│  ├─ types
│  │  ├─ api.ts
│  │  ├─ augmentation
│  │  │  ├─ global-types.d.ts
│  │  │  ├─ tanstack-query.d.ts
│  │  │  └─ vite-env.d.ts
│  │  ├─ common.ts
│  │  ├─ component-types
│  │  │  ├─ base-component.ts
│  │  │  ├─ form.ts
│  │  │  ├─ image-preview
│  │  │  │  └─ index.ts
│  │  │  ├─ index.ts
│  │  │  └─ picker.ts
│  │  ├─ date.ts
│  │  ├─ index.ts
│  │  ├─ map
│  │  │  └─ map.ts
│  │  ├─ reports
│  │  │  ├─ report-account-history.types.ts
│  │  │  ├─ report-balance-sheet.types.ts
│  │  │  ├─ report-base.tsx
│  │  │  ├─ report-cash-check-disbursement.types.ts
│  │  │  ├─ report-coop-pesos.types.ts
│  │  │  ├─ report-daily-collection-book.ts
│  │  │  ├─ report-fs-notes-schedule.types.ts
│  │  │  ├─ report-general-ledger.types.ts
│  │  │  ├─ report-gl-books.types.ts
│  │  │  ├─ report-gl-sl-comparison.types.ts
│  │  │  ├─ report-income-statement.types.ts
│  │  │  ├─ report-journal-entry.types.ts
│  │  │  ├─ report-loan-release-voucher.types.ts
│  │  │  ├─ report-statement-operations.types.ts
│  │  │  └─ report-trial-balance.type.ts
│  │  └─ type-utils.ts
│  └─ validation
│     ├─ common.validation.ts
│     ├─ index.ts
│     └─ validation-fn.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```