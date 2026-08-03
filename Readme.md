# 🍳 Recipe Vault API

A small Express + Mongoose project built to practice **every core Mongoose fundamental**:

- Connecting Express to MongoDB
- Schemas & Models
- Data types (String, Number, Boolean, Array, ObjectId, etc.)
- Required fields
- Default values
- Custom validation (built-in + custom validator functions)
- Full CRUD
- Query operators, sorting, and pagination
- Centralized error handling

## Project structure

```
recipe-vault-api/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── Recipe.js           # Schema + Model + validation
├── routes/
│   └── recipeRoutes.js     # CRUD endpoints
├── middleware/
│   └── errorHandler.js     # Centralized error handling
├── server.js                # App entry point
├── package.json
└── .env.example
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env file and set your Mongo connection string:

   ```bash
   cp .env.example .env
   ```

3. Make sure MongoDB is running locally (or use a MongoDB Atlas URI in `.env`).

4. Start the server:
   ```bash
   npm run dev   # with nodemon
   # or
   npm start
   ```

Server runs at `http://localhost:5050` by default.

## API Endpoints

| Method | Endpoint           | Description                         |
| ------ | ------------------ | ----------------------------------- |
| POST   | `/api/recipes`     | Create a new recipe                 |
| GET    | `/api/recipes`     | List recipes (filter/sort/paginate) |
| GET    | `/api/recipes/:id` | Get a single recipe                 |
| PATCH  | `/api/recipes/:id` | Update a recipe                     |
| DELETE | `/api/recipes/:id` | Delete a recipe                     |

## Example requests

### Create a recipe

```bash
curl -X POST http://localhost:5050/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Margherita Pizza",
    "cuisine": "italian",
    "difficulty": "easy",
    "prepTimeMinutes": 25,
    "servings": 2,
    "ingredients": ["dough", "tomato sauce", "mozzarella", "basil"],
    "steps": ["Preheat oven", "Assemble pizza", "Bake 12 minutes"],
    "isVegetarian": true,
    "tags": ["cheesy", "quick"]
  }'
```

### List with filtering, sorting, pagination

```bash
# Italian recipes, ready in <= 30 minutes, sorted by rating (desc), page 1, 5 per page
curl "http://localhost:5050/api/recipes?cuisine=italian&maxTime=30&sort=-rating&page=1&limit=5"
```

### Get one

```bash
curl http://localhost:5050/api/recipes/<id>
```

### Update

```bash
curl -X PATCH http://localhost:5050/api/recipes/<id> \
  -H "Content-Type: application/json" \
  -d '{ "rating": 4.5 }'
```

### Delete

```bash
curl -X DELETE http://localhost:5050/api/recipes/<id>
```

## What triggers validation errors (worth testing manually)

- Omit `title` or `prepTimeMinutes` → `ValidationError` (required field)
- Send `ingredients: []` → custom validator error (must have at least 1)
- Send `cuisine: "klingon"` → enum validation error
- Send `tags: ["Spicy Food!"]` → custom regex validator error (uppercase/space not allowed)
- Send an invalid `:id` (not a valid ObjectId) → `CastError` → 400 response
- All of the above are caught by `middleware/errorHandler.js` and returned as clean JSON, not a stack trace.
