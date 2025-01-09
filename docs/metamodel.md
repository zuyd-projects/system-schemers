# Metamodel Explanation

## Overview

The metamodel represents the conceptual structure for managing and organizing entities in the system, such as **Object Types**, **Attributes**, **Fact Types**, **Predicators**, and **Models**. These entities correspond to tables in a database, and the service provides a flexible, generic CRUD API to interact with them.

The metamodel service is designed with scalability and modularity in mind, allowing easy additions of new entities and features.

---

## Entities and Relationships

### 1. **Model**
- Represents a high-level group or context for other entities.
- **Attributes:**
  - `id`: Primary Key
  - `name`: Name of the model.
  - `description`: Description of the model.
  - `version`: Version of the model.

### 2. **ObjectType**
- Represents a class or object type in the domain.
- **Attributes:**
  - `id`: Primary Key
  - `name`: Name of the object type.
  - `description`: Description of the object type.
  - `modelId`: Foreign Key referencing the `Model`.

### 3. **Attribute**
- Represents the properties or fields of an `ObjectType`.
- **Attributes:**
  - `id`: Primary Key
  - `name`: Name of the attribute.
  - `datatype`: Data type of the attribute (e.g., `string`, `integer`).
  - `objectTypeId`: Foreign Key referencing the `ObjectType`.

### 4. **FactType**
- Represents relationships or facts between object types.
- **Attributes:**
  - `id`: Primary Key
  - `name`: Name of the fact type.
  - `description`: Description of the fact type.
  - `concId`: Concept ID (e.g., `FactType`).
  - `cnstId`: Constraint ID (e.g., `Association`).
  - `predicatorSetType`: Type of predicator set (e.g., `Binary`).

### 5. **Predicator**
- Defines the specifics of relationships in a `FactType`.
- **Attributes:**
  - `id`: Primary Key
  - `name`: Name of the predicator.
  - `factTypeId`: Foreign Key referencing the `FactType`.
  - `objectTypeId`: Foreign Key referencing the `ObjectType`.
  - `multiplicity`: Cardinality of the relationship (e.g., `one or more`).
  - `verb`: Descriptive verb for the relationship.

---

## API Routes

The service provides a **generic CRUD API** that dynamically handles different entities using a single route structure.

### Generic CRUD Routes

| Method | Endpoint               | Description                                |
|--------|------------------------|--------------------------------------------|
| POST   | `/:entity`             | Creates a new record for the specified entity. |
| GET    | `/:entity`             | Retrieves all records of the specified entity. |
| GET    | `/:entity/:id`         | Retrieves a single record by ID.           |
| PUT    | `/:entity/:id`         | Updates a specific record by ID.           |
| DELETE | `/:entity/:id`         | Deletes a specific record by ID.           |

### Example
- **Creating an `ObjectType`:**
  ```bash
  curl -X POST http://localhost:5005/api/objectType   -H "Content-Type: application/json"   -d '{
      "name": "Order",
      "description": "Represents an order",
      "modelId": 1
  }'
  ```

- **Response:**
  ```json
  {
      "id": 1,
      "name": "Order",
      "description": "Represents an order",
      "modelId": 1,
      "createdAt": "2025-01-09T15:30:00.000Z",
      "updatedAt": "2025-01-09T15:30:00.000Z"
  }
  ```

---

## Database Structure

The metamodel uses Sequelize ORM to define and interact with the database. Below are the Sequelize models corresponding to each entity:

### 1. **Model**
```javascript
const Model = sequelize.define('Model', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    version: { type: DataTypes.INTEGER }
});
```

### 2. **ObjectType**
```javascript
const ObjectType = sequelize.define('ObjectType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    modelId: { type: DataTypes.INTEGER, allowNull: true }
});
```

### 3. **Attribute**
```javascript
const Attribute = sequelize.define('Attribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    datatype: { type: DataTypes.STRING },
    objectTypeId: { type: DataTypes.INTEGER, allowNull: true }
});
```

### 4. **FactType**
```javascript
const FactType = sequelize.define('FactType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    concId: { type: DataTypes.STRING },
    cnstId: { type: DataTypes.STRING },
    predicatorSetType: { type: DataTypes.STRING }
});
```

### 5. **Predicator**
```javascript
const Predicator = sequelize.define('Predicator', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    factTypeId: { type: DataTypes.INTEGER },
    objectTypeId: { type: DataTypes.INTEGER },
    multiplicity: { type: DataTypes.STRING },
    verb: { type: DataTypes.STRING }
});
```

---

## Consumer Integration

The consumer interacts with the Metamodel Service by sending HTTP requests to the CRUD API. For example:

- **Create Model:** The consumer first creates a model using `/model`.
- **Create ObjectType:** The consumer adds object types under the model using `/objectType`.
- **Add Attributes and Relationships:** The consumer links attributes and relationships to the object types using `/attribute` and `/factType`.

### Example Workflow
1. Create a Model.
2. Add Object Types.
3. Add Attributes and Relationships.

---

## Extensibility

The metamodel is designed to be extensible:
- **Adding New Entities:** Extend the `entityMap` and define a new Sequelize model.
- **Custom Validation or Business Logic:** Add custom routes or middleware.

---

## Conclusion

The metamodel provides a structured way to manage and relate entities in a flexible and scalable manner. It uses a generic CRUD API and Sequelize ORM to simplify database interactions, making it easy to add new entities or modify existing ones as the system evolves.

## Contributors
- **Noa Heutz** - Architect and Developer
- **Maikel Heijen** - Architect and Developer