# V-shy Blogs

Welcome to **V-shy Blogs**, an open-source blogging platform built with [Next.js](https://nextjs.org). Whether you're a developer looking to host your own blog or a contributor eager to improve the project, this guide will help you get started!

### Hero Section
![Hero Section](https://i.imgur.com/u8hFiXS.png)

---

## 📸 Screenshots/Demo

### Blog Editor Interface
![Editor Screenshot](https://i.imgur.com/VinUVg5.png)

### UI Walkthrough
[![Watch the demo video](https://cdn-cf-east.streamable.com/image/597f0d.jpg)](https://streamable.com/597f0d)
---

## 🚀 Getting Started

Follow these steps to set up V-shy Blogs locally.

### Prerequisites

- **Node.js**: >= 16.x
- **npm** or **yarn**: For package management
- **Database**: PostgreSQL (recommended)

---

## 🛠 Installation Guide

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/v-shy-blogs.git
   cd v-shy-blogs
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and populate it using the following template:

   ```env
   DATABASE_URL=your-database-url

   AUTH_SECRET=your-auth-secret

   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret

   EDGE_STORE_ACCESS_KEY=your-edge-store-access-key
   EDGE_STORE_SECRET_KEY=your-edge-store-secret-key

   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run Database Migrations**:

   If you're using Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

---



## 🌐 Live Version

Check out the live version of the site at: [https://vishay-blogs.vercel.app/](https://vishay-blogs.vercel.app/)

---

Happy blogging! 🌱

