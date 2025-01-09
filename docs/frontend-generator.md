
<!-- NOTE: NOT IMPLEMENTED -->
# Workflow: Generating a Frontend from the CRUD Generator Output

This document outlines the process of dynamically generating a frontend application using the outputs from the CRUD generator service. The workflow integrates the backend metadata to create a structured and functional frontend.

---

## Overview

The frontend generation leverages:
1. **Metadata from the CRUD Generator**: Includes API endpoints, object types, and attributes.
2. **Templating Engine**: Dynamically generates React/Vue components, pages, and routes.
3. **Directory Structure**: Organizes the generated frontend files into a standard project layout.

---

## Workflow Steps

### 1. Analyze Backend Output
- Extract the following from the `src/output/model_<modelId>` directory:
  - **API Endpoints**:
    - Example: `/api/user` (CRUD routes).
  - **Object Types and Fields**:
    - Example: `User` with fields `name: STRING`, `email: STRING`, `age: INTEGER`.

### 2. Set Up a Frontend Generator
- Use a templating engine such as **EJS** or **Handlebars** to define templates for:
  - **Components**: Forms, tables, and detail views.
  - **Pages**: Listing and detail pages.
  - **Routes**: Dynamic routing for the frontend.

---

## Frontend Generator Workflow

1. **Initialize the Frontend Project**:
   - Use tools like `create-react-app` or `Vue CLI` to scaffold the project.
   ```bash
   npx create-react-app frontend
   ```

2. **Generate Components**:
   - Dynamically create components for each object type:
     - **Form Components**: Handle `POST` and `PUT` requests.
     - **Table Components**: Display data from `GET` requests.

3. **Integrate API Endpoints**:
   - Use libraries like `Axios` for API communication.
   - Map backend endpoints to frontend actions.

4. **Create Dynamic Routing**:
   - Generate a router configuration (e.g., `AppRouter.js`) to handle dynamic routes for each object type.

---

## Example Generated Files

### **Components**
#### Form Component (`UserForm.js`):
```jsx
import React from "react";

const UserForm = ({ onSubmit, initialValues = {} }) => (
    <form onSubmit={onSubmit}>
        <label>Name:</label>
        <input name="name" defaultValue={initialValues.name || ""} required />
        <label>Email:</label>
        <input name="email" type="email" defaultValue={initialValues.email || ""} required />
        <label>Age:</label>
        <input name="age" type="number" defaultValue={initialValues.age || ""} />
        <button type="submit">Submit</button>
    </form>
);

export default UserForm;
```

#### Table Component (`UserTable.js`):
```jsx
import React from "react";

const UserTable = ({ users, onDelete }) => (
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>
                        <button onClick={() => onDelete(user.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default UserTable;
```

---

### **Dynamic Routing**
Router (`AppRouter.js`):
```jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

const AppRouter = () => (
    <Router>
        <Switch>
            <Route path="/users" component={UserTable} />
            <Route path="/user/new" component={UserForm} />
        </Switch>
    </Router>
);

export default AppRouter;
```

---

## Future Enhancements

1. **Custom Styling**:
   - Use libraries like Material-UI or TailwindCSS for better design.

2. **Frontend Generator Service**:
   - Create a dedicated service to automate frontend generation.
   - Input: `modelId`.
   - Output: A fully functional React/Vue project.

3. **UI Preview**:
   - Integrate a UI to preview and test generated components.

---

## Conclusion

This workflow outlines a scalable approach to automating frontend generation using the CRUD generator's metadata. By combining templating engines, API integration, and dynamic routing, you can rapidly create functional frontend applications tailored to the backend structure.
