# Aplicación de Gestión de Contenidos Multimedia

Este proyecto es una aplicación diseñada para gestionar contenidos multimedia de forma accesible según el tipo de usuario (lector, creador o administrador). La aplicación permite la creación, lectura, actualización y eliminación (CRUD) de categorías y contenidos, controlando permisos según el rol de cada usuario. Fue desarrollada usando el stack MERN (MongoDB, Express, React, Node.js).

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript para el backend.
- **Express**: Framework web que facilita el desarrollo de la API REST.
- **MongoDB**: Base de datos NoSQL para el almacenamiento de datos estructurados en colecciones.
- **Socket.io**: Biblioteca que permite actualizaciones en tiempo real para la sincronización de contenidos en la aplicación.
- **Deno**: Runtime de TypeScript

## Instalación

### Prerrequisitos

- Asegúrate de tener instalado **DENO** en tu máquina.
- Configura las variables de entorno necesarias para la conexión a MongoDB y otras configuraciones de la aplicación revisa en env.example.

### Paso a Paso

1. **Clonar el repositorio**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar dependencias**

   ```bash
   deno install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto y define las variables según el archivo `env.example`.

4. **Iniciar la aplicación**

   ```bash
   deno task dev
   ```

## Endpoints

### Autenticación

- `POST /api/auth/register`: Registra un nuevo usuario (lector o creador).
- `POST /api/auth/login`: Inicia sesión en la aplicación.

### Categorías

- `GET /api/categories`: Obtener todas las categorías disponibles.
- `POST /api/categories/create`: Crear una nueva categoría (solo Admin).

### Temáticas

- `GET /api/topics`: Obtener todas las temáticas existentes.
- `POST /api/topics/create`: Crear una nueva temática (solo Admin).
- **Validación**: No permite duplicar nombres de temática y verifica que cada temática tenga permisos válidos de contenido.

### Contenidos

- `GET /api/content`: Obtener todos los contenidos, ordenados por tipo y tema.
- `POST /api/content/create`: Crear un nuevo contenido (solo para Creador y Admin).
  - **Validación**: Verifica que el contenido coincida con el tipo permitido en su categoría (imágenes, videos o textos).

### Búsqueda

- `GET /api/search`: Permite buscar contenido por nombre o temática.

## Funcionalidad en Tiempo Real

La aplicación utiliza `Socket.io` para actualizar en tiempo real la biblioteca de contenidos. Cada vez que se agrega un nuevo contenido, se emite un evento que actualiza automáticamente la lista de contenidos en todos los clientes conectados.

## Permisos de Usuarios

Los permisos varían según el tipo de usuario:

- **Admin**: CRUD completo en categorías, temáticas y contenidos.
- **Creador**: Crear y leer contenidos, con actualización de sus propios contenidos.
- **Lector**: Solo lectura de contenidos.

### Validaciones de Usuarios

- **Registro**: Validación de alias (username) y correo electrónico para evitar duplicados.
- **Tipo de Usuario**: Un usuario puede registrarse solo como lector o creador, pero no ambos.

## Buenas Prácticas de Código

El código sigue las mejores prácticas, como:

- **Validación de datos**: Validaciones exhaustivas de cada entrada para evitar datos inválidos.
- **Manejo de errores**: Gestión centralizada de errores para responder con mensajes informativos.
- **Modularidad**: Separación de funciones y componentes para mejorar la escalabilidad y el mantenimiento.

## Contribuciones

Las contribuciones son bienvenidas. Para colaborar:

1. Crea un issue para discutir el cambio.
2. Realiza un fork y abre un pull request para revisión.