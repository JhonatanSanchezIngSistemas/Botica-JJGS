# 🛡️ Gestión de Calidad de Código (ESLint)

Este proyecto utiliza **ESLint** para garantizar la consistencia, prevenir errores y mantener un estándar de código profesional en el Frontend.

## 🚀 Configuración
La configuración se encuentra en `botica-frontend/.eslintrc.json`.

## 📏 Reglas Principales Aplicadas
1. **`no-unused-vars`**: Alerta si se declaran variables que no se usan (limpieza de código).
2. **`no-console`**: Alerta si se dejan `console.log` en producción (seguridad/limpieza).
3. **`eqeqeq`**: Obliga a usar `===` en lugar de `==` para comparaciones estrictas (previene bugs lógicos).
4. **`semi`**: Obliga el uso de punto y coma al final de las sentencias.

## 🧪 Cómo ejecutar el análisis
```bash
cd botica-frontend
npm run lint
# O automáticamente al compilar con npm start
```

## 🎯 Beneficios
- **Prevención de errores:** Detecta bugs potenciales antes de la ejecución
- **Consistencia:** Todo el equipo escribe código con el mismo estilo
- **Mantenibilidad:** Código más limpio y fácil de entender
- **Profesionalismo:** Cumple con estándares de la industria

## 📊 Integración con CI/CD
ESLint se ejecuta automáticamente en cada commit gracias a GitHub Actions, asegurando que ningún código de baja calidad llegue a producción.
