
# Quran Admin Panel

A lightweight admin dashboard built with **React**, **Supabase**, and **TailwindCSS** for managing Quran content such as Surahs, Ayahs, Thafseer, About App details, Feedbacks, and DB versions.

---

## Features
- Supabase authentication  
- Dashboard with database version info  
- Manage Surahs, Verses, and Thafseer  
- Edit About App content  
- View feedback submissions  
- Clean and minimal UI with sidebar navigation  
- Toast notifications powered by Sonner  

---

## Tech Stack
- React  
- React Router  
- TailwindCSS  
- Supabase  
- Sonner (toast notifications)  
- Lucide Icons  

---

## Setup
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd quran-admin-panel
   ```
2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a .env file and add:
    ```sh
    VITE_SUPABASE_URL=your-url
    VITE_SUPABASE_ANON_KEY=your-key
    ```

4. Run the development server:
    ```sh
     npm run dev
    ```
Project Structure
src/
 ├─ pages/
 │   ├─ Dashboard.jsx
 │   ├─ Surahs.jsx
 │   ├─ Verses.jsx
 │   ├─ Thafseer.jsx
 │   ├─ About.jsx
 │   ├─ Feedbacks.jsx
 │   └─ Settings.jsx
 ├─ components/
 │   ├─ Sidebar.jsx
 │   ├─ Layout.jsx
 │   └─ Table.jsx
 ├─ libs/
 │   ├─ createClient.js
 │   └─ useAuth.js
 └─ App.jsx


