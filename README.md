
### Installation

- NOTE: All commands should be ran in the root directory unless otherwise specified

1. **Install the dependencies:**  
   In the root folder, run this command. It will install all dependencies both for the web and api.
   ```bash
   pnpm install
   ```

2. **Setup the Docker database:**
   ```bash
   docker run --name postgresDB -e POSTGRES_PASSWORD=webdevel -p 5433:5432 -d postgres
   ```
   Create .env file. Refer to .env.example to see the details.

3. **Run the frontend:**
   ```bash
   pnpm dev
   ```
   Frontend runs on http://localhost:3000 and backend on http://localhost:3001.

4. **Run the backend:**
   ```bash
   cd apps/api
   pnpm run start:dev
   ```
