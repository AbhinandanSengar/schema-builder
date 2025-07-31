# 🧩 Schema Designer

**Schema Designer** is a visual, interactive tool for designing database schemas with zero config and instant code generation.

It lets you drag, drop, and link tables visually—then export your design as SQL, Prisma, or MongoDB code, powered by AI.

---

## ⚙️ Features

- 🧱 Add tables and fields visually
- 🔗 Define 1:1, 1:N, N:N relationships
- 🎛️ Set field options (PK, unique, required, default)
- 🔄 Import/export schema as JSON
- 🧠 Generate SQL / Prisma / MongoDB code with AI
- 🌗 Dark mode support
- 🧰 Built-in toolbar for canvas controls

---

## 🛠 Tech Stack

- **Next.js 14 (App Router)**
- **React Flow (`@xyflow/react`)**
- **TailwindCSS**
- **Lucide Icons**
- **OpenRouter + DeepSeek Chat AI**
- **TypeScript**

## Install

```sh
npm install
```

```shCreate a .env file
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Usage

```sh
npm run start
```

##📄 Example Output

###MongoDB (Mongoose)
```sh
import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
});

export const User = model("User", UserSchema);
```

###SQL
```sh
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);
```

###Prisma
```sh
model User {
  id    String  @id @default(uuid())
  name  String
  email String  @unique
}
```

##🤝 Contributing

PRs are welcome! Here's how to get started:
- Fork the project
- Create a feature branch: git checkout -b feature/something
- Commit your changes: git commit -m 'Add something'
- Push to your branch: git push origin feature/something
- Open a pull request

## Author

👤 **Abhinandan Pratap Singh Sengar**

* Github: [@AbhinandanSengar](https://github.com/AbhinandanSengar)
* LinkedIn: [@AbhinandanSengar](https://www.linkedin.com/in/abhinandansengar)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
