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
