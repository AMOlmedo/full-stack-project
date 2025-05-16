# Proyecto Fullstack con Docker: React + FastAPI + MySQL

Este proyecto consiste en una aplicación completa dividida en tres servicios independientes, desplegados con Docker y orquestados con `docker-compose`. Los servicios son:

* **Frontend:** Aplicación ReactJS
* **Backend:** API en Python con FastAPI
* **Base de datos:** MySQL

---

## Estructura del proyecto

```
project/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── Dockerfile
└── docker-compose.yml
```

---

## 1. Backend (FastAPI)

### Dependencias (`requirements.txt`):

```
fastapi
uvicorn
sqlalchemy
mysql-connector-python
python-dotenv
```

### Archivo `main.py`

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database

app = FastAPI()

@app.post("/clientes/")
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(database.get_db)):
    db_cliente = models.Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente
```

### Dockerfile del backend

```Dockerfile 
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

---

## 2. Frontend (React)

### Formulario de Usuario en React (Ejemplo `App.js`)

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({ nombre: '', apellido: '', edad: '', direccion: '', email: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:8000/clientes/', form);
    alert("Cliente agregado!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} />
      <input name="edad" placeholder="Edad" type="number" onChange={handleChange} />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default App;
```

### Dockerfile del frontend

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---

## 3. Base de Datos (MySQL)

Se usa la imagen oficial de MySQL 8.0 con variables de entorno para el usuario root y la base de datos:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: mipass.123$
  MYSQL_DATABASE: usuarios
```

---

## 4. Docker Compose

Archivo `docker-compose.yml` para levantar todo el stack:

```yaml
version: '3.9'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: mipass.123$ 
      MYSQL_DATABASE: usuarios
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: usuarios
      DB_USER: root
      DB_PASS: 12345

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    stdin_open: true
    tty: true
    depends_on:
      - backend

volumes:
  db_data:
```

---

## 5. Cómo levantar el entorno

Desde la raíz del proyecto:

```bash
docker compose up --build
```

* El frontend quedará accesible en `http://localhost:3000`
* El backend (FastAPI) en `http://localhost:8000`
* MySQL estará corriendo en el contenedor `db`

---

##  Tips adicionales

* Agregar un `.gitignore` para evitar subir carpetas como `node_modules` o `venv`
* Crear respaldos del volumen si necesitás conservar los datos de MySQL
* Verificar siempre las conexiones entre servicios usando el nombre del servicio en el compose (por ej. `db` en vez de `localhost`)

---

