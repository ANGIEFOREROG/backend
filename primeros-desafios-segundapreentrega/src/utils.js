// Importar las funciones necesarias de los módulos 'url' y 'path'
import { fileURLToPath } from "url";
import path from "path";

// Obtener la ruta del archivo actual (__filename) y el directorio del archivo (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar el directorio del archivo actual (__dirname) para su uso en otros archivos
export default __dirname;