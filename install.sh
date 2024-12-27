#!/bin/bash

# Salir si ocurre un error
set -e

echo "Iniciando instalación..."

# Navegar al backend y ejecutar npm install y npm start
echo "Instalando dependencias y corriendo el servidor backend..."
cd backend
npm install
npm start &

# Regresar al directorio principal
cd ..

# Navegar al frontend y ejecutar npm install y npm start
echo "Instalando dependencias y corriendo el servidor frontend..."
cd frontend
npm install
npm start &

echo "Instalación y servidores en ejecución."