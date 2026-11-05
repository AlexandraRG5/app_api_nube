# Backend – App de roles, catálogo y carrito (Node.js + Express + MySQL)

Arquitectura **MVC + POO**:

```
src/
  config/Database.js, dbConfig.js -> conexión a MySQL (local o nube)
  models/       -> M: UserModel, ProductModel, CartModel (todo el SQL vive aquí)
  views/        -> V: UserView, ProductView, CartView (forma del JSON de respuesta)
  controllers/  -> C: AuthController, UserController, ProductController, CartController
  routes/       -> qué URL llama a qué controlador
  middleware/   -> token (JWT) + permisos por rol
sql/schema.sql  -> tablas users, categories, products, carts, cart_items
scripts/        -> setup.js (crea tablas y datos de ejemplo), seedData.js
render.yaml     -> configuración opcional para Render
```

---

## A) Probarlo en tu PC (XAMPP)

1. `npm install`
2. Copia `.env.example` como `.env` (`copy .env.example .env`) y deja la parte **(A)** (si tu XAMPP usa el puerto 3308, pon `DB_PORT=3308`). Cambia `JWT_SECRET`.
3. `npm run setup` (crea la BD, las tablas y los datos de ejemplo)
4. `npm start` → http://localhost:3000/health debe responder `{"status":"ok"}`

---

## B) Subirlo a la nube: Always Data (base de datos) + Render (servidor)

### Paso 1 – Base de datos en Always Data
1. Crea tu cuenta gratis en https://www.alwaysdata.com (plan **Free**). Anota el **nombre de tu cuenta** (en las instrucciones, `TUCUENTA`).
2. En el panel (admin.alwaysdata.com) ve a **Databases → MySQL → Add a database**. Ponle un nombre, por ejemplo `roles`; el panel la guarda con prefijo: `TUCUENTA_roles`.
3. Usuario: puedes usar el usuario por defecto (tu nombre de cuenta, con la contraseña de tu cuenta) o crear uno en **MySQL → Users** con permisos sobre esa base. Es más seguro crear uno propio.
4. Los datos de conexión son:
   - Host: `mysql-TUCUENTA.alwaysdata.net`
   - Puerto: `3306`
   - Base: `TUCUENTA_roles`
   - Usuario y contraseña: los del paso anterior

### Paso 2 – Subir el código a GitHub
Render toma el código desde GitHub (no se puede subir un zip directo).
1. Crea una cuenta en https://github.com y un repositorio nuevo (privado o público).
2. Sube **el contenido de esta carpeta `backend`** de modo que `package.json` quede en la raíz del repositorio (en la web: *Add file → Upload files* y arrastra los archivos y carpetas).
3. **No subas** `node_modules` ni `.env` (el `.gitignore` ya los excluye; si subes arrastrando, simplemente no los incluyas).

### Paso 3 – Servidor en Render
1. Crea cuenta en https://render.com e inicia sesión con GitHub.
2. **New → Web Service** y elige tu repositorio.
3. Configura:
   - **Runtime / Language:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. En **Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `DB_HOST` | `mysql-TUCUENTA.alwaysdata.net` |
| `DB_PORT` | `3306` |
| `DB_USER` | tu usuario de Always Data |
| `DB_PASSWORD` | su contraseña |
| `DB_NAME` | `TUCUENTA_roles` |
| `JWT_SECRET` | un texto largo inventado por ti |
| `AUTO_SETUP` | `true` |
| `NODE_VERSION` | `20` |

5. **Create Web Service.** Espera 2–4 minutos. En los *Logs* debe aparecer "Tablas listas", "Usuarios de ejemplo insertados: 10" y "API lista".
6. Tu API queda en `https://NOMBRE.onrender.com/api`. Pruébala abriendo `https://NOMBRE.onrender.com/health`.

> `AUTO_SETUP=true` crea las tablas y los datos de ejemplo al arrancar, solo si faltan. No borra nada.

### Detalles del plan gratuito de Render
- El servicio **se duerme tras 15 minutos sin uso**; la primera petición después tarda **30–60 segundos** en despertar. La app ya espera hasta 60 s.
- Truco: antes de una demostración abre `https://NOMBRE.onrender.com/health` para despertarlo.

### Si algo falla
| Mensaje en los Logs | Qué revisar |
|---|---|
| `ER_ACCESS_DENIED_ERROR` | Usuario o contraseña de Always Data incorrectos. |
| `ER_DBACCESS_DENIED_ERROR` / `ER_BAD_DB_ERROR` | `DB_NAME` debe ser el nombre completo con prefijo y el usuario debe tener permiso sobre esa base. |
| `ECONNREFUSED` / `ETIMEDOUT` | Revisa `DB_HOST` y `DB_PORT`; confirma en el panel de Always Data que el acceso remoto a MySQL no esté restringido por IP. |

---

## Usuarios de ejemplo
| id | usuario | contraseña | rol |
|----|---------|------------|-----|
| 1 | johnd | m38rmF$ | Administrador |
| 2 | mor_2314 | 83r5^_ | Administrador |
| 3 | kevinryan | kev02937@ | Auditor |
| 4+ | donero, derek, david_r… | ver `scripts/seedData.js` | Cliente |

Regla de roles: **id 1 y 2 = administrador, id 3 = auditor, el resto = cliente.** Las contraseñas se guardan con hash (bcrypt).

## Endpoints
Todos (menos el login) exigen `Authorization: Bearer <token>`.

| Método | URL | Quién | Qué hace |
|--------|-----|-------|----------|
| POST | /api/auth/login | todos | Login → `{ token, user }` |
| GET | /api/users, /api/users/:id | admin, auditor | Mostrar usuarios (incluye `address` anidado con `geolocation`, o `null`) |
| POST | /api/users | admin | Agregar usuario |
| GET | /api/products, /products/:id | autenticado | Mostrar productos / uno por ID |
| GET | /api/products/categories | autenticado | Listar categorías |
| GET | /api/products/category/:nombre | autenticado | Productos de una categoría |
| POST, PUT, DELETE | /api/products, /products/:id | admin | Agregar, editar, borrar producto |
| GET | /api/carts | **auditor, admin** | Historial global de carritos activos (solo lectura). `?all=true` incluye vacíos |
| GET | /api/carts/me | **cliente** | Mi carrito (lo crea vacío si no existe) |
| POST | /api/carts | **cliente** | Agregar `{productId, quantity}`; si ya existe, **suma** la cantidad |
| PUT | /api/carts/:id | **cliente** | Cambiar `{productId, quantity}`; con 0 elimina el artículo |
| DELETE | /api/carts/:id/items/:productId | **cliente** | Quitar un artículo |
| DELETE | /api/carts/:id | **cliente** | Vaciar el carrito |

El carrito es solo para Clientes y se valida en el servidor (el resto recibe 403). Un cliente solo puede ver y modificar **su** carrito.
