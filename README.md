# TP 10 - Consultas de Reservas con MongoDB

Repositorio correspondiente al Trabajo Práctico 10. Extiende el proyecto anterior agregando capacidades de filtrado, ordenamiento, paginación y proyección de campos al listado de la API mediante MongoDB y Mongoose, conservando intacto el CRUD completo, las vistas HTML y la ruta de estado.

## 1. Instalación y Configuración

1. Clonar el repositorio y posicionarse en la carpeta del proyecto.
2. Copiar el archivo de ejemplo para crear tu propio entorno privado:
   ```bash
   cp .env.example .env

```

3. Configurar en el archivo `.env` la URI de conexión a MongoDB Atlas apuntando a la base de datos `reservas_salas_u10`.
4. Instalar las dependencias de forma limpia utilizando el archivo de bloqueo:
```bash
npm ci

```



## 2. Ejecución y Verificaciones

Antes de iniciar la aplicación, se ejecutaron las validaciones obligatorias de linter y conexión:

```bash
# Verificar código y formato
npm run check

# Comprobar la conexión con la base de datos
node --env-file=.env scripts/comprobar-conexion.js

# Iniciar la aplicación en modo desarrollo
node --env-file=.env src/index.js

```

La aplicación estará disponible en `http://localhost:3000`.

## 3. Variables de Entorno (`.env.example`)

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/reservas_salas_u10?retryWrites=true&w=majority
PORT=3000

```

## 4. Contrato Final de la API

### `GET /api/reservas`

Permite listar las reservas aplicando filtros opcionales de consulta.

* **Parámetros permitidos en la Query String (`req.query`)**:
* `sala` (Texto): Filtra por coincidencia exacta (luego de aplicar `trim`).
* `orden` (Texto): Define el criterio de ordenamiento. Opciones válidas: `estudiante` (predeterminado), `personas-asc`, `personas-desc` (con desempate por `_id` ascendente).
* `pagina` (Número entero): Número de página a visualizar (rango permitido de 1 a 1000, valor por defecto 1).
* `limite` (Número entero): Cantidad de elementos por página (rango permitido de 1 a 20, valor por defecto 2).


* **Respuesta Exitosa de Paginación (`200 OK`)**:
Devuelve un objeto JSON con la siguiente estructura:
```json
{
  "datos": [
    {
      "id": "...",
      "estudiante": "Nombre Ejemplo",
      "email": "correo@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-10-28",
      "turno": "Mañana",
      "personas": 2,
      "estado": "pendiente"
    }
  ],
  "pagina": 1,
  "limite": 2,
  "total": 6,
  "paginas": 3
}

```



## 5. Solicitudes Reproducibles en Postman

Para probar el correcto funcionamiento, se pueden configurar las siguientes solicitudes en Postman:

1. **Listado general (Predeterminado)**:
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/reservas`
* **Params:** Sin parámetros activos (devuelve página 1, límite 2).


2. **Filtro por sala y ordenamiento ascendente**:
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/reservas`
* **Params:**
* `sala` = `Sala Norte`
* `orden` = `personas-asc`
* `pagina` = `1`
* `limite` = `2`




3. **Consulta de Estado Global**:
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/reservas/estado`
* **Respuesta esperada:** `{"total": 7}`



```

```