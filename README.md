# BizTrack Mobile App

Aplicación móvil oficial de BizTrack construida con React Native (Expo).

## Conexión Backend
Esta app está configurada para conectarse al backend en producción:
- **URL**: `https://biztrack-backend-eebz.onrender.com/api`
- **Archivo de Configuración**: `src/constants/api.js`

## Estructura del Proyecto
- `App.js`: Entrada principal y navegación.
- `src/api/`: Cliente HTTP (Axios) con interceptores de seguridad.
- `src/context/`: Gestión de estado global (AuthContext).
- `src/screens/`: Pantallas (Login, Register, Dashboard).
- `src/constants/`: Variables de configuración.

## Instrucciones de Instalación

### 1. Requisitos Previos
- Node.js instalado.
- Celular Android o Emulador.

### 2. Instalar Dependencias
Si acabas de clonar el proyecto, ejecuta:
```bash
npm install
```

### 3. Correr la App en Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npx expo start
```
- Escanea el código QR con la app **Expo Go** en tu Android.
- O presiona `a` para abrir en Emulador Android.

### 4. Generar APK / AAB para Google Play
Para generar el archivo lista para producción:

1. Instalar EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Iniciar sesión en Expo:
   ```bash
   eas login
   ```
3. Configurar el proyecto:
   ```bash
   eas build:configure
   ```
4. Generar la build (Android):
   ```bash
   eas build -p android
   ```
   - Esto generará un archivo `.aab` listo para subir a la Google Play Console.

## Notas Importantes
- La app maneja autenticación persistente.
- Si hay errores de conexión, verifica que el backend en Render esté activo (puede tardar unos segundos en despertar si está dormido).
