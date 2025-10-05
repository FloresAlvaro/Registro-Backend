# 🎓 Report Card API - Sistema de Gestión Académica# Report Card Backend API<p align="center">



![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)A comprehensive backend system for managing educational report cards, built with NestJS, Prisma, and PostgreSQL. This API provides endpoints for managing roles, grades, and subjects with full CRUD operations and status filtering.</p>

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)## Features[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456



Un sistema completo de gestión académica desarrollado con NestJS, Prisma y PostgreSQL para manejar usuarios, estudiantes, profesores, calificaciones y relaciones académicas complejas.[circleci-url]: https://circleci.com/gh/nestjs/nest



## 📋 Tabla de Contenidos- **Role Management**: Complete CRUD operations for user roles



- [🎯 Características](#-características)- **Grade Management**: Comprehensive grade level management <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

- [🏗️ Arquitectura](#️-arquitectura)

- [📦 Tecnologías](#-tecnologías)- **Subject Management**: Full subject administration <p align="center">

- [⚡ Inicio Rápido](#-inicio-rápido)

- [🔧 Configuración](#-configuración)- **Status Filtering**: Filter entities by active, inactive, or all statuses<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

- [🗄️ Base de Datos](#️-base-de-datos)

- [🚀 Ejecución](#-ejecución)- **Swagger Documentation**: Interactive API documentation<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

- [📚 API Documentation](#-api-documentation)

- [🧪 Testing](#-testing)- **Database ORM**: Prisma for type-safe database operations<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

- [📁 Estructura del Proyecto](#-estructura-del-proyecto)

- [🔐 Seguridad](#-seguridad)- **Validation**: Built-in request validation with class-validator<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- [🎯 Scripts Disponibles](#-scripts-disponibles)

- [🤝 Contribución](#-contribución)- **TypeScript**: Full TypeScript support for type safety<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>



## 🎯 Características<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>



### ✨ Funcionalidades Principales## Technology Stack<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

- 🏫 **Gestión de Usuarios**: Administradores, profesores y estudiantes

- 📚 **Gestión Académica**: Grados, materias y relaciones curriculares<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

- 📊 **Sistema de Calificaciones**: Registro y seguimiento de evaluaciones

- 🔗 **Relaciones Complejas**: Estudiante-Profesor-Materia con períodos académicos- **Framework**: NestJS <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

- 🛡️ **Validaciones Avanzadas**: Triggers de base de datos para integridad

- 📈 **Auditoría Completa**: Registro de cambios y soft delete- **Database**: PostgreSQL <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>



### 🏛️ Módulos del Sistema- **ORM**: Prisma</p>

- **Users**: Gestión de usuarios y autenticación

- **Academic**: Grados, materias y registros académicos  - **Documentation**: Swagger/OpenAPI <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- **Relationships**: Relaciones entre entidades académicas

- **Shared**: Servicios compartidos y utilidades- **Validation**: class-validator & class-transformer [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



## 🏗️ Arquitectura- **Code Quality**: ESLint & Prettier



```## Description

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐

│   Controllers   │    │    Services     │    │   Repositories  │## API Endpoints

│   (REST API)    │───▶│  (Business)     │───▶│   (Prisma)      │

└─────────────────┘    └─────────────────┘    └─────────────────┘[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

         │                       │                       │

         ▼                       ▼                       ▼### Roles (`/roles`)

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐

│   DTOs/Guards   │    │   Interceptors  │    │   PostgreSQL    │- `GET /roles` - Get all roles with optional status filtering## Project setup

│  (Validation)   │    │   (Logging)     │    │   (Database)    │  - Query parameter: `status` (active | inactive | all)

└─────────────────┘    └─────────────────┘    └─────────────────┘

```- `GET /roles/:id` - Get role by ID```bash



## 📦 Tecnologías- `POST /roles` - Create new role$ npm install



### 🎯 Backend Stack- `PATCH /roles/:id` - Update role```

- **[NestJS](https://nestjs.com/)** `^11.0.1` - Framework de Node.js escalable

- **[TypeScript](https://www.typescriptlang.org/)** `^5.7.3` - Lenguaje tipado- `DELETE /roles/:id` - Delete role

- **[Prisma](https://www.prisma.io/)** `^6.16.2` - ORM de próxima generación

- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos relacional- `PATCH /roles/:id/toggle-status` - Toggle role status## Compile and run the project



### 🛠️ Herramientas de Desarrollo### Grades (`/grades`)```bash

- **[Swagger/OpenAPI](https://swagger.io/)** - Documentación de API

- **[Class Validator](https://github.com/typestack/class-validator)** - Validación de DTOs- `GET /grades` - Get all grades with optional status filtering# development

- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Linting y formateo  - Query parameter: `status` (active | inactive | all)$ npm run start

- **[Jest](https://jestjs.io/)** - Testing framework

- `GET /grades/:id` - Get grade by ID

### 📊 Validación y Documentación

- **[Joi](https://joi.dev/)** - Validación de configuración- `POST /grades` - Create new grade# watch mode

- **[Class Transformer](https://github.com/typestack/class-transformer)** - Transformación de objetos

- `PATCH /grades/:id` - Update grade$ npm run start:dev

## ⚡ Inicio Rápido

- `DELETE /grades/:id` - Delete grade

### 📋 Prerrequisitos

- `PATCH /grades/:id/toggle-status` - Toggle grade status# production mode

```bash

# Node.js (versión 18+ recomendada)$ npm run start:prod

node --version  # v18.0.0+

### Subjects (`/subjects`)```

# PostgreSQL (versión 13+ recomendada)

psql --version  # PostgreSQL 13+- `GET /subjects` - Get all subjects with optional status filtering

  - Query parameter: `status` (active | inactive | all)## Run tests

# Git

git --version- `GET /subjects/:id` - Get subject by ID

```

- `POST /subjects` - Create new subject```bash

### 🚀 Instalación

- `PATCH /subjects/:id` - Update subject# unit tests

1. **Clonar el repositorio**

```bash- `DELETE /subjects/:id` - Delete subject$ npm run test

git clone https://github.com/FloresAlvaro/Registro-Backend.git

cd backend-report-card- `PATCH /subjects/:id/toggle-status` - Toggle subject status

```

# e2e tests

2. **Instalar dependencias**

```bash## Database Schema$ npm run test:e2e

npm install

```The application uses the following PostgreSQL tables:# test coverage



3. **Configurar variables de entorno**$ npm run test:cov

```bash

# Copiar el archivo de ejemplo`sql`

cp .env.example .env

CREATE TABLE "Role"(

# Editar las variables necesarias

# DATABASE_URL="postgresql://admin:password@localhost:5432/DBService?schema=public"    "roleId" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,## Deployment

```

    "roleName" VARCHAR(255) NOT NULL,

4. **Configurar la base de datos**

```bash    "roleStatus" BOOLEAN NOT NULL DEFAULT trueWhen you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

# Generar cliente de Prisma

npx prisma generate);



# Ejecutar migracionesIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

npx prisma migrate dev --name "initial-migration"

CREATE TABLE "Grade"(

# Cargar datos de prueba (opcional)

prisma\scripts\load-sample-data.bat  # Windows    "gradeId" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,```bash

# o

./prisma/scripts/load-sample-data.sh  # Linux/Mac    "gradeLevel" VARCHAR(255) NOT NULL,$ npm install -g @nestjs/mau



# Instalar triggers de validación    "gradeDescription" VARCHAR(255) NOT NULL,$ mau deploy

prisma\scripts\install-triggers.bat  # Windows

# o     "gradeStatus" BOOLEAN NOT NULL DEFAULT true```

./prisma/scripts/install-triggers.sh  # Linux/Mac

```);



5. **Iniciar el servidor**With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

```bash

# DesarrolloCREATE TABLE "Subject"(

npm run start:dev

    "subjectID" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,## Resources

# Producción

npm run build    "subjectName" VARCHAR(255) NOT NULL,

npm run start:prod

```    "subjectDescription" VARCHAR(255) NOT NULL,Check out a few resources that may come in handy when working with NestJS:



## 🔧 Configuración    "subjectStatus" BOOLEAN NOT NULL DEFAULT true



### 📄 Variables de Entorno);- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.



Crear archivo `.env` en la raíz del proyecto:````- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).



```bash- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

# Base de datos

DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd?schema=public"## Setup Instructions- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.



# Servidor (opcional)- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

PORT=3000

NODE_ENV=development### Prerequisites- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).



# Logging (opcional)- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

LOG_LEVEL=debug

```- Node.js (v16 or higher)- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



### ⚙️ Configuración de PostgreSQL- PostgreSQL database



```sql- npm or yarn## Support

-- Crear base de datos

CREATE DATABASE DBService;



-- Crear usuario (opcional)### InstallationNest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

CREATE USER admin WITH PASSWORD 'password';

GRANT ALL PRIVILEGES ON DATABASE DBService TO admin;

```

1. **Clone the repository**## Stay in touch

### 🐳 Docker (Opcional)

   ```bash

```yaml

# docker-compose.yml   git clone <repository-url>- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

version: '3.8'

services:   cd backend-report-card- Website - [https://nestjs.com](https://nestjs.com/)

  postgres:

    image: postgres:15   ```- Twitter - [@nestframework](https://twitter.com/nestframework)

    environment:

      POSTGRES_DB: DBService

      POSTGRES_USER: admin

      POSTGRES_PASSWORD: password2. **Install dependencies**## License

    ports:

      - "5432:5432"   ```bash

    volumes:

      - postgres_data:/var/lib/postgresql/data   npm installNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



volumes:````

  postgres_data:

```3. **Environment Configuration**



## 🗄️ Base de Datos   Create a `.env` file in the root directory:



### 📊 Esquema Principal   ```env

   DATABASE_URL="postgresql://username:password@localhost:5432/report_card_db?schema=public"

```   PORT=3000

┌─────────────┐    ┌─────────────┐    ┌─────────────┐   ```

│    User     │    │   Student   │    │   Teacher   │

│             │───▶│             │    │             │4. **Database Setup**

│ - userId    │    │ - studentId │    │ - teacherId │

│ - email     │    │ - gradeId   │    │ - license   │   Generate Prisma client:

│ - roleId    │    └─────────────┘    │ - hours     │

└─────────────┘           │           └─────────────┘   ```bash

       │                  │                   │   npx prisma generate

       ▼                  ▼                   ▼   ```

┌─────────────┐    ┌─────────────┐    ┌─────────────┐

│    Role     │    │    Grade    │    │   Subject   │   Run database migrations:

│             │    │             │    │             │

│ - roleId    │    │ - gradeId   │    │ - subjectId │   ```bash

│ - roleName  │    │ - level     │    │ - name      │   npx prisma db push

└─────────────┘    └─────────────┘    └─────────────┘   ```

```

### Running the Application

### 🔗 Relaciones Complejas

```bash

```# Development mode

StudentTeacherSubject (Tabla Pivot)npm run start:dev

├── studentId   (FK → Student)

├── teacherId   (FK → Teacher)  # Production mode

├── subjectId   (FK → Subject)npm run start:prod

├── gradeId     (FK → Grade)

└── academicPeriod (String)# Build the application

```npm run build

```

### 🛡️ Triggers de Base de Datos

The API will be available at `http://localhost:3000`

- ✅ **Actualización automática** de timestamps

- ✅ **Auditoría completa** de cambios de usuario### API Documentation

- ✅ **Validación de calificaciones** (0-20 sistema peruano)

- ✅ **Soft delete** para usuariosOnce the application is running, you can access the interactive Swagger documentation at:

- ✅ **Validación de CI** y email

- ✅ **Prevención de duplicados** en asignaciones```

- ✅ **Integridad referencial** avanzadahttp://localhost:3000/api

```

## 🚀 Ejecución

### Code Quality

### 🔥 Modo Desarrollo

```bash

```bash# Format code

# Servidor con auto-reloadnpm run format

npm run start:dev

# Lint code

# Con debuggingnpm run lint

npm run start:debug

```# Run tests

npm run test

### 🏭 Modo Producción```



```bash## Data Transfer Objects (DTOs)

# Compilar TypeScript

npm run build### CreateRoleDto



# Ejecutar aplicación compilada```typescript

npm run start:prod{

```  roleName: string;      // Required, 1-255 characters

  roleStatus?: boolean;  // Optional, defaults to true

### 🌐 URLs del Sistema}

```

| Servicio | URL | Descripción |

|----------|-----|-------------|### CreateGradeDto

| **API** | `http://localhost:3000` | Servidor principal |

| **Swagger** | `http://localhost:3000/api` | Documentación interactiva |```typescript

| **Prisma Studio** | `http://localhost:5555` | Administrador de BD |{

  gradeLevel: string;       // Required, 1-255 characters

## 📚 API Documentation  gradeDescription: string; // Required, 1-255 characters

  gradeStatus?: boolean;    // Optional, defaults to true

### 🎯 Endpoints Principales}

```

#### 👥 Users

```### CreateSubjectDto

GET    /users          # Listar usuarios

POST   /users          # Crear usuario```typescript

GET    /users/:id      # Obtener usuario{

PUT    /users/:id      # Actualizar usuario  subjectName: string;        // Required, 1-255 characters

DELETE /users/:id      # Eliminar usuario (soft delete)  subjectDescription: string; // Required, 1-255 characters

```  subjectStatus?: boolean;    // Optional, defaults to true

}

#### 🎓 Students```

```

GET    /students       # Listar estudiantes## Response Examples

POST   /students       # Crear estudiante

GET    /students/:id   # Obtener estudiante### Get All Roles (with status filter)

PUT    /students/:id   # Actualizar estudiante

``````bash

GET /roles?status=active

#### 👩‍🏫 Teachers```

```

GET    /teachers       # Listar profesoresResponse:

POST   /teachers       # Crear profesor

GET    /teachers/:id   # Obtener profesor```json

PUT    /teachers/:id   # Actualizar profesor[

```  {

    "roleId": 1,

#### 📊 Grade Records    "roleName": "Administrator",

```    "roleStatus": true

GET    /grade-records                    # Listar calificaciones  },

POST   /grade-records                   # Crear calificación  {

GET    /grade-records/student/:id       # Calificaciones por estudiante    "roleId": 2,

GET    /grade-records/subject/:id       # Calificaciones por materia    "roleName": "Teacher",

```    "roleStatus": true

  }

### 📋 Ejemplos de Request/Response]

```

#### Crear Usuario

```json### Create Role

POST /users

{```bash

  "userFirstName": "Juan",POST /roles

  "userFirstLastName": "Pérez",Content-Type: application/json

  "userEmail": "juan.perez@colegio.edu.pe",

  "userCI": 12345678,{

  "userPassword": "password123",  "roleName": "Student",

  "userDateOfBirth": "2010-05-15",  "roleStatus": true

  "userRoleId": 3}

}```

```

Response:

#### Crear Calificación

```json```json

POST /grade-records{

{  "roleId": 3,

  "studentId": 1,  "roleName": "Student",

  "subjectId": 1,  "roleStatus": true

  "gradeId": 3,}

  "score": 18.5,```

  "maxScore": 20.0,

  "gradeType": "Examen",## Error Handling

  "academicPeriod": "2024-I",

  "comments": "Excelente trabajo"The API returns appropriate HTTP status codes and error messages:

}

```- `200` - Success

- `201` - Created

## 🧪 Testing- `400` - Bad Request (validation errors)

- `404` - Not Found

### 🎯 Ejecutar Tests- `500` - Internal Server Error



```bashError response format:

# Tests unitarios

npm run test```json

{

# Tests con coverage  "statusCode": 400,

npm run test:cov  "message": ["roleName should not be empty"],

  "error": "Bad Request"

# Tests en modo watch}

npm run test:watch```



# Tests e2e## License

npm run test:e2e

This project is licensed under the MIT License.

# Tests con debugging
npm run test:debug
```

### 📊 Coverage
```bash
# Generar reporte de coverage
npm run test:cov

# Abrir reporte en navegador
open coverage/lcov-report/index.html
```

## 📁 Estructura del Proyecto

```
backend-report-card/
├── 📁 src/
│   ├── 📁 modules/              # Módulos de negocio
│   │   ├── 📁 users/           # Gestión de usuarios
│   │   │   ├── users/          # CRUD usuarios
│   │   │   ├── students/       # CRUD estudiantes
│   │   │   ├── teachers/       # CRUD profesores
│   │   │   └── roles/          # CRUD roles
│   │   ├── 📁 academic/        # Módulo académico
│   │   │   ├── grades/         # CRUD grados
│   │   │   ├── subjects/       # CRUD materias
│   │   │   └── grade-records/  # CRUD calificaciones
│   │   └── 📁 relationships/   # Relaciones complejas
│   │       ├── teacher-grades/
│   │       ├── teacher-subjects/
│   │       └── student-teacher-subjects/
│   ├── 📁 shared/              # Servicios compartidos
│   │   ├── base/              # Servicios base
│   │   ├── decorators/        # Decoradores custom
│   │   ├── dto/               # DTOs base
│   │   ├── filters/           # Filtros de excepción
│   │   ├── interceptors/      # Interceptores
│   │   └── services/          # Servicios utilitarios
│   ├── 📁 prisma/             # Configuración de Prisma
│   ├── 📁 config/             # Configuración de la app
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Punto de entrada
├── 📁 prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── 📁 migrations/         # Migraciones generadas
│   ├── 📁 sql/               # Scripts SQL custom
│   │   ├── triggers.sql       # Triggers de validación
│   │   └── sample-data.sql    # Datos de prueba
│   └── 📁 scripts/           # Scripts de utilidad
│       ├── install-triggers.bat
│       ├── install-triggers.sh
│       ├── load-sample-data.bat
│       └── load-sample-data.sh
├── 📄 .env                   # Variables de entorno
├── 📄 package.json          # Dependencias del proyecto
├── 📄 tsconfig.json         # Configuración TypeScript
├── 📄 nest-cli.json         # Configuración NestJS CLI
└── 📄 README.md             # Este archivo
```

## 🔐 Seguridad

### ✅ Validaciones Implementadas
- **DTOs con Class Validator**: Validación de entrada
- **Whitelist**: Solo propiedades definidas
- **Transform**: Conversión automática de tipos
- **ForbidNonWhitelisted**: Rechaza propiedades no permitidas

### 🛡️ Triggers de Base de Datos
- **Validación de CI**: 7-9 dígitos
- **Validación de Email**: Formato RFC válido
- **Calificaciones**: Rango 0-20 (sistema peruano)
- **Integridad Referencial**: Verificación de FKs
- **Auditoría**: Log automático de cambios

## 🎯 Scripts Disponibles

### 📦 NPM Scripts
```json
{
  "build": "nest build",                    // Compilar para producción
  "start": "nest start",                    // Iniciar aplicación
  "start:dev": "nest start --watch",       // Desarrollo con auto-reload
  "start:debug": "nest start --debug --watch", // Desarrollo con debugging
  "start:prod": "node dist/main",          // Producción
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix", // Linting
  "format": "prettier --write \"src/**/*.ts\"", // Formateo
  "test": "jest",                          // Tests unitarios
  "test:watch": "jest --watch",            // Tests en modo watch
  "test:cov": "jest --coverage",           // Tests con coverage
  "test:e2e": "jest --config ./test/jest-e2e.json" // Tests e2e
}
```

### 🗄️ Database Scripts
```bash
# Prisma
npx prisma generate          # Generar cliente
npx prisma migrate dev       # Crear y aplicar migración
npx prisma migrate deploy    # Aplicar migraciones (prod)
npx prisma studio           # Abrir Prisma Studio
npx prisma db seed          # Ejecutar seeders

# Custom Scripts (Windows)
prisma\scripts\install-triggers.bat     # Instalar triggers
prisma\scripts\load-sample-data.bat     # Cargar datos de prueba

# Custom Scripts (Linux/Mac)  
./prisma/scripts/install-triggers.sh    # Instalar triggers
./prisma/scripts/load-sample-data.sh    # Cargar datos de prueba
```

## 🤝 Contribución

### 🔄 Flujo de Trabajo

1. **Fork del repositorio**
2. **Crear rama de feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit con mensaje descriptivo**
   ```bash
   git commit -m "feat: agregar validación de usuario"
   ```
4. **Push a la rama**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Crear Pull Request**

### 📏 Estándares de Código

- **ESLint + Prettier** para formateo consistente
- **Conventional Commits** para mensajes de commit
- **TypeScript strict mode** habilitado
- **Tests unitarios** requeridos para nuevas features

### 🎯 Convenciones de Naming

```typescript
// Archivos
kebab-case.service.ts
kebab-case.controller.ts
kebab-case.dto.ts

// Clases
PascalCase
export class UserService {}

// Métodos y variables
camelCase
async findUserById(id: number) {}

// Constantes
UPPER_SNAKE_CASE
const DATABASE_URL = process.env.DATABASE_URL;
```

## 📞 Soporte

### 🐛 Reportar Issues
- **GitHub Issues**: [Crear issue](https://github.com/FloresAlvaro/Registro-Backend/issues)
- **Descripción detallada** del problema
- **Pasos para reproducir** el error
- **Environment info** (OS, Node version, etc.)

### 📧 Contacto
- **GitHub**: [@FloresAlvaro](https://github.com/FloresAlvaro)
- **Repository**: [Registro-Backend](https://github.com/FloresAlvaro/Registro-Backend)

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🏆 Reconocimientos

- **NestJS Team** por el increíble framework
- **Prisma Team** por el ORM de nueva generación
- **PostgreSQL** por la robusta base de datos
- **Swagger** por la excelente documentación de APIs

---

**¡Gracias por usar Report Card API! 🎓✨**

*Desarrollado con ❤️ para la educación*