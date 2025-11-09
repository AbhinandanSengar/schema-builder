# 🗂️ Schema Builder

> A full-stack visual database schema designer with authentication, project management, and multi-format code generation.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-Provider Login**: Google, GitHub, and email/password authentication via NextAuth.js
- **Secure Sessions**: JWT-based session management with automatic token refresh
- **User Profiles**: Persistent user data with social login integration

### 📊 Project Management Dashboard
- **Project Creation**: Create and organize multiple database schema projects
- **Project Metadata**: Add names, descriptions, and manage project lifecycle
- **Persistent Storage**: All projects saved to PostgreSQL database via Prisma ORM
- **Quick Access**: Dashboard interface for easy project navigation

### 🎨 Visual Schema Designer
- **Interactive Canvas**: React Flow-powered drag-and-drop interface with infinite scroll and zoom
- **Custom Table Components**: Purpose-built table nodes with dynamic attribute containers
- **10+ Field Data Types**: Support for INTEGER, STRING, BOOLEAN, DATE, DATETIME, FLOAT, DECIMAL, JSON, UUID, ENUM
- **Advanced Constraints**: Primary keys, foreign keys, unique, required, default values, and custom validation
- **Relationship Mapping**: Visual connection system for 1:1, 1:N, and N:N database relationships
- **Real-time Validation**: Instant visual feedback and error highlighting for schema conflicts

### 🔗 Advanced Relationship Management
- **3 Relationship Types**: Complete support for 1:1, 1:N, and N:N database relationships
- **Interactive Edge System**: Custom edge components with bidirectional relationship configuration
- **5+ Constraint Types**: Primary keys, foreign keys, unique, required, default values
- **Cascade Options**: ON DELETE and ON UPDATE cascade configuration
- **Visual Validation**: Real-time relationship validation with conflict detection and error highlighting
- **Relationship Metadata**: Store additional relationship properties and documentation

### 💾 Schema Persistence & Export
- **JSON Schema Export**: Export complete schema as structured JSON
- **Database Storage**: Save schemas directly to PostgreSQL for cross-session access
- **Schema Versioning**: Track changes and maintain schema history
- **Import/Export**: Share schemas between users and projects

### 🚀 Multi-Format Code Generation
- **3 Export Formats**: Generate production-ready code in SQL DDL, Prisma, and MongoDB/Mongoose
- **Smart Type Mapping**: Automatic conversion between 10+ field types across different database systems
- **Relationship Translation**: Intelligent foreign key and reference mapping with constraint preservation
- **Schema Optimization**: Automated index suggestions and performance optimization hints
- **Custom Naming**: Support for custom table/field naming conventions (camelCase, snake_case, PascalCase)
- **Batch Export**: Generate complete database schemas with 50+ tables in seconds

### 🎯 Upcoming Features
- **Real-time Collaboration**: Multi-user editing with role-based permissions (Viewer/Editor)
- **Live Cursors**: See other users' actions in real-time
- **Project Sharing**: Share projects with team members
- **Comment System**: Add comments and suggestions to schema elements

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 15.4.4 |
| **Frontend** | React | 19.1.0 |
| **Language** | TypeScript | 5.x |
| **Database** | Prisma ORM | 6.13.0 |
| **Authentication** | NextAuth.js | 4.24.11 |
| **Visualization** | React Flow (@xyflow/react) | 12.8.2 |
| **UI Components** | Radix UI/ShadCN UI | Multiple packages |
| **Styling** | TailwindCSS | 4.1.11 |
| **Validation** | Zod | 4.0.15 |
| **HTTP Client** | Axios | 1.11.0 |
| **Deployment** | Vercel | Latest |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhinandanSengar/schema-builder.git
   cd schema-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/schema_builder"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # GitHub OAuth (optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   #Resend API
   RESEND_API_KEY="your-resend-api-key"

   #OPENROUTER API
   OPENROUTER_API_KEY="your-openrouter-api-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Open Prisma Studio
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Sign Up/Login**: Choose from Google, GitHub, or email authentication
2. **Create Project**: From the dashboard, create a new schema project
3. **Design Schema**: Use the visual canvas to create tables and relationships
4. **Configure Attributes**: Set primary keys, constraints, and data types
5. **Export Schema**: Generate code in your preferred format (SQL/Prisma/MongoDB)

### Project Workflow

```mermaid
graph TD
    A[Login/Signup] --> B[Dashboard]
    B --> C[Create Project]
    C --> D[Canvas Editor]
    D --> E[Add Tables]
    E --> F[Define Relationships]
    F --> G[Configure Constraints]
    G --> H[Save to Database]
    G --> I[Export Schema]
    H --> J[Code Generation]
```

### Canvas Controls & Features

- **Table Management**: Create unlimited tables with 10+ field types each
- **Field Types**: INTEGER, STRING, BOOLEAN, DATE, DATETIME, FLOAT, DECIMAL, JSON, UUID, ENUM
- **Constraint Options**: 5+ constraint types including primary keys, foreign keys, unique, required, default values
- **Multi-Selection**: Select and manipulate up to 50+ elements simultaneously
- **Canvas Navigation**: Infinite scroll, zoom (10%-500%), and pan functionality
- **Relationship Creation**: Drag-and-drop connections supporting 3 relationship types (1:1, 1:N, N:N)
- **Bulk Operations**: Duplicate, delete, or modify multiple tables at once
- **Undo/Redo**: 50+ action history with full state restoration

### Schema Export Options

#### SQL
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Prisma Schema
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  posts     Post[]
}

model Post {
  id      String @id @default(uuid())
  title   String
  content String?
  userId  String @map("user_id")
  user    User   @relation(fields: [userId], references: [id])
}
```

#### MongoDB/Mongoose
```javascript
import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const User = model("User", UserSchema);
export const Post = model("Post", PostSchema);
```

## 🏗️ Architecture

### Database Schema (Prisma)
```prisma
model User {
  id       String    @id @default(cuid())
  email    String    @unique
  name     String?
  image    String?
  accounts Account[]
  sessions Session[]
  projects Project[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  schema      Json?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
```

### Component Structure
```
prisma/
├── migrations/
├── schema.prisma
src/
├── app/                   # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Project dashboard
│   ├── Components/        # Schema editor canvas
│   └── page.tsx/          # Landing Page
├── components/
│   ├── ui/                # Radix UI components
│   ├── magicui/           # Magic UI components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── authOptions.ts     # NextAuth providers
│   ├── email.ts           # Resend email function
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utility functions
│   └── types.ts           # TypeScript type definitions

```

## 🔮 Roadmap

### Phase 1: Real-time Collaboration (In Progress)
- [ ] WebSocket integration for real-time updates
- [ ] Multi-user cursor tracking
- [ ] Role-based permissions (Viewer/Editor)
- [ ] Project sharing system
- [ ] Conflict resolution for simultaneous edits

### Phase 2: Enhanced Features
- [ ] Schema versioning and history
- [ ] Advanced relationship types
- [ ] Custom data type definitions
- [ ] Schema validation and suggestions
- [ ] Template library

## 🤝 Contributing

We welcome contributions!

### Development Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhinandan Pratap Singh Sengar**
- GitHub: [@AbhinandanSengar](https://github.com/AbhinandanSengar)
- LinkedIn: [@AbhinandanSengar](https://www.linkedin.com/in/abhinandansengar)

**Shreya Kumari**
- GIthub: [@ShreyaKumari](https://github.com/ShreyaKumari16)
- LinkedIn: [@ShreyaKumari](https://www.linkedin.com/in/shreyakumari03/)

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) for the amazing flow library
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Prisma](https://prisma.io/) for the excellent ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Vercel](https://vercel.com/) for hosting and deployment

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

<p align="center">
  <i>Building the future of database schema design, one node at a time.</i>
</p>
