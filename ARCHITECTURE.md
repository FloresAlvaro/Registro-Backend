# 📁 Arquitectura Optimizada por Dominio

## 🎯 **Nueva Estructura del Proyecto**

```
src/
├── app.module.ts           # Módulo principal de la aplicación
├── main.ts                 # Punto de entrada de la aplicación
├── config/                 # 🆕 Configuraciones centralizadas
│   ├── app.config.ts       # Configuración de la aplicación
│   └── validation.config.ts # Esquemas de validación
├── shared/                 # 🔄 Componentes compartidos (antes common/)
│   ├── index.ts            # Barrel export para imports simplificados
│   ├── base/               # Clases base abstractas
│   ├── decorators/         # 🆕 Decorators personalizados
│   ├── dto/                # DTOs base (pagination, search, filters)
│   ├── filters/            # Exception filters globales
│   ├── interceptors/       # Interceptors de respuesta y logging
│   ├── interfaces/         # Interfaces compartidas
│   └── utils/              # Utilidades comunes (DateUtils, QueryUtils, etc.)
├── modules/                # 🆕 Módulos organizados por dominio
│   ├── academic/           # 🆕 Dominio académico
│   │   ├── index.ts        # Barrel export del dominio
│   │   ├── grades/         # Gestión de grados/niveles
│   │   ├── subjects/       # Gestión de materias
│   │   ├── grade-subjects/ # Relación grados-materias
│   │   └── grade-records/  # Registros de calificaciones
│   ├── users/              # 🆕 Dominio de usuarios
│   │   ├── index.ts        # Barrel export del dominio
│   │   ├── roles/          # Gestión de roles
│   │   ├── users/          # Usuarios base
│   │   ├── students/       # Estudiantes
│   │   └── teachers/       # Profesores
│   └── relationships/      # 🆕 Dominio de relaciones
│       ├── index.ts        # Barrel export del dominio
│       ├── student-teacher-subjects/ # Asignaciones estudiante-profesor-materia
│       ├── teacher-grades/ # Relación profesores-grados
│       └── teacher-subjects/ # Relación profesores-materias
└── prisma/                 # Configuración de Prisma ORM
    ├── prisma.module.ts
    └── prisma.service.ts
```

## 🚀 **Beneficios de la Nueva Arquitectura**

### 1. **Separación por Dominios**

- **Academic**: Todo lo relacionado con el sistema académico
- **Users**: Gestión de usuarios y roles
- **Relationships**: Relaciones complejas entre entidades

### 2. **Componentes Compartidos Optimizados**

- **shared/**: Elementos reutilizables en toda la aplicación
- **config/**: Configuraciones centralizadas y tipadas
- **decorators/**: Decorators personalizados para funcionalidad común

### 3. **Barrel Exports**

- Imports simplificados: `from '../../../shared'` → `from '@shared'`
- Mejor organización de exports por dominio
- Menor acoplamiento entre módulos

## 📦 **Imports Optimizados**

### Antes:

```typescript
import { BaseService } from '../../../common/base/base.service';
import { DateUtils } from '../../../common/utils/common.utils';
import { PaginationDto } from '../../../common/dto/base.dto';
```

### Después:

```typescript
import { BaseService, DateUtils, PaginationDto } from '../../../shared';
// O con path mapping:
import { BaseService, DateUtils, PaginationDto } from '@shared';
```

## 🎯 **Domain-Driven Design (DDD)**

### **Academic Domain**

- **Responsabilidad**: Gestión del sistema académico
- **Entidades**: Grades, Subjects, GradeRecords, GradeSubjects
- **Casos de uso**: Crear calificaciones, asignar materias a grados

### **Users Domain**

- **Responsabilidad**: Gestión de usuarios y autenticación
- **Entidades**: Users, Students, Teachers, Roles
- **Casos de uso**: Registro, autenticación, gestión de perfiles

### **Relationships Domain**

- **Responsabilidad**: Relaciones complejas entre dominios
- **Entidades**: StudentTeacherSubjects, TeacherGrades, TeacherSubjects
- **Casos de uso**: Asignaciones, horarios, evaluaciones

## 🔧 **Configuración Mejorada**

### **app.config.ts**

```typescript
export const appConfig = () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
  },
  database: {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE || 'postgresql',
  },
});
```

## 🎨 **Decorators Personalizados**

```typescript
// Extraer usuario actual
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}

// Paginación automática
@Get('users')
getUsers(@PaginationParams() pagination: { page: number, limit: number }) {
  return this.usersService.findAll(pagination);
}
```

## 📈 **Escalabilidad**

### **Agregar Nuevos Dominios**

1. Crear carpeta en `modules/`
2. Implementar módulos usando `shared/` components
3. Agregar barrel export (`index.ts`)
4. Importar en `app.module.ts`

### **Agregar Funcionalidad Compartida**

1. Crear en `shared/`
2. Exportar en `shared/index.ts`
3. Usar en cualquier módulo

## 🚦 **Path Mapping (Recomendado)**

Agregar en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@config/*": ["src/config/*"],
      "@modules/*": ["src/modules/*"],
      "@academic/*": ["src/modules/academic/*"],
      "@users/*": ["src/modules/users/*"],
      "@relationships/*": ["src/modules/relationships/*"]
    }
  }
}
```

## 🎯 **Próximos Pasos**

1. **Configurar path mapping** para imports más limpios
2. **Implementar autenticación** en el dominio Users
3. **Agregar tests** organizados por dominio
4. **Documentación API** por dominio
5. **CI/CD** con estructura modular

Esta arquitectura está diseñada para **escalar eficientemente** y **mantener código limpio** siguiendo los principios de **Domain-Driven Design** y **Clean Architecture**.
