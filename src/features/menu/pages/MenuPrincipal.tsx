'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuPrincipal() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // el que guardaste al loguear
    if (!token) {
      setError("No hay token, volvé a iniciar sesión");
      return;
    }

    axios.get("http://localhost:8080/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(err => {
      console.error(err);
      setError("Error al cargar datos: " + (err.response?.status || err.message));
    });
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        Cargando menú...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bienvenido {user.nombre}</h1>
      <nav className="grid gap-4">
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow">Gestión de Clientes</button>
        <button className="p-4 bg-green-500 text-white rounded-lg shadow">Gestión de Embarcaciones</button>
        <button className="p-4 bg-purple-500 text-white rounded-lg shadow">Turnos</button>
        <button className="p-4 bg-orange-500 text-white rounded-lg shadow">Cuotas</button>
        <button className="p-4 bg-gray-600 text-white rounded-lg shadow">Cerrar Sesión</button>
      </nav>
    </div>
  );
}
