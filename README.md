# ToBuk (Toko Buku)

![Laravel](https://img.shields.io/badge/Laravel-v12-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia)
![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**ToBuk** is a modern, full-stack bookstore application designed to provide a seamless browsing and purchasing experience. Built with the latest technologies, it features a robust admin panel for inventory management and a sleek, responsive public interface.

## 🚀 Tech Stack

- **Framework:** [Laravel v12](https://laravel.com)
- **Frontend:** [React](https://react.dev)
- **Glue:** [Inertia.js](https://inertiajs.com)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)

## 📋 Requirements

Ensure you have the following installed on your machine:

- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL Database

## 🛠️ Installation

Follow these steps to set up the project locally:

1.  **Clone the repository**

    ```bash
    git clone https://github.com/NojinNojs/tobuk-app.git
    cd tobuk-app
    ```

2.  **Install PHP dependencies**

    ```bash
    composer install
    ```

3.  **Install Node.js dependencies**

    ```bash
    npm install
    ```

4.  **Environment Setup**
    Copy the example environment file and configure your database settings.

    ```bash
    cp .env.example .env
    ```

    Open `.env` and update the `DB_` variables (DB_DATABASE, DB_USERNAME, DB_PASSWORD) to match your local MySQL configuration.

5.  **Generate Application Key**

    ```bash
    php artisan key:generate
    ```

6.  **Run Migrations**
    Create the database tables.
    ```bash
    php artisan migrate
    ```

## 🌱 Database Seeding

To populate the database with initial data, including a list of books, use the following command:

```bash
php artisan db:seed --class=BookSeeder
```

> **Note:** This will seed the `books` table with sample data for testing and development.

## 💻 Development

To start the development server, use the helper script which runs the Laravel server, queue listener, and Vite development server concurrently:

```bash
composer run dev
```

Access the application at `http://localhost:8000`.

## 📦 Production

For a production environment, follow these optimization steps:

1.  **Build Frontend Assets**

    ```bash
    npm run build
    ```

2.  **Optimize Configuration**

    ```bash
    php artisan optimize
    ```

3.  **Run Migrations (Force)**

    ```bash
    php artisan migrate --force
    ```

4.  **Serve the Application**
    Point your web server (Nginx or Apache) to the `public/` directory of the project.

## 🐘 Laragon (Windows)

If you are using [Laragon](https://laragon.org/) for development or production on Windows:

1.  **Clone into Root**
    Clone the repository into your Laragon root directory (usually `C:\laragon\www`).

    ```bash
    cd C:\laragon\www
    git clone https://github.com/NojinNojs/tobuk-app.git
    ```

2.  **Auto-Virtual Hosts**
    Reload Laragon (**Menu > Apache/Nginx > Reload**). Laragon will automatically create a hostname for you, likely `http://tobuk-app.test`.

3.  **PHP Version**
    Ensure you have selected **PHP 8.2** or higher in Laragon (**Menu > PHP > Version**).

4.  **Database Setup**
    Laragon includes HeidiSQL. Open it, create a new database named `tobuk_db` (or whatever you set in `.env`), and then run the migrations:
    ```bash
    php artisan migrate
    php artisan db:seed --class=BookSeeder
    ```

---

_Enjoy building with ToBuk!_
