# Development Guidelines

## 🚀 Quick Start
1.  **Switch to Staging**: Ensure your `.env.local` matches values from `.env.staging`.
2.  **Run App**: `npm run dev` or `npm run dev:staging` (auto-loads staging env)

---

## 🔐 Staging Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.pl` | `admin1234` |

---

## 🌳 Branching Strategy
We use a simplified Git flow mapped to Vercel environments.
 
| Environment | Branch | Database | URL |
| :--- | :--- | :--- | :--- |
| **Production** | `main` | Production (`...qnlx`) | [art-tim.vercel.app](https://art-tim.vercel.app) |
| **Preview** | `feature/*` | Staging (`...syzu`) | *(Auto-generated on PR)* |
| **Local** | `feature/*` | Staging (`...syzu`) | `localhost:3000` |

---

## 🛠 Common Workflows

### 1. Starting a New Feature
1.  **Checkout main**: `git checkout main && git pull`
2.  **Create branch**: `git checkout -b feature/my-new-feature`
3.  **Develop**: Work locally. You are connected to the **Staging DB**.
    *   *Note*: You can safely modify data in Staging.
    *   *Schema*: If you need new tables, add them to Staging via Supabase SQL Editor. Save the SQL!

### 2. Submitting Changes
1.  **Push**: `git push origin feature/my-new-feature`
2.  **Pull Request**: Open a PR to `main` on GitHub.
3.  **Test**: Vercel will comment with a Preview URL. Test your feature there.

### 3. Deploying to Production
1.  **Pre-Merge (Schema Check)**:
    *   Did you change the database structure?
    *   **YES**: You MUST apply those identical SQL changes to the **Production Database** manually before merging.
2.  **Merge**: Merge the PR into `main`.
3.  **Verify**: Check the production site.

---

## 🗄 Database Management
*   **Staging Project**: `[Art-Tim] Staging` (Safe playground)
*   **Production Project**: `[Art-Tim] Baza Samochodów` (Live data - CAUTION)

### Syncing Staging with Production
If Staging gets messy or outdated:
1.  Go to **Production** -> Database -> Schema Visualizer -> Export.
2.  Go to **Staging** -> SQL Editor -> Paste & Run.
*(Warning: This applies structure only. For data sync, you'd need CSV exports/imports)*
