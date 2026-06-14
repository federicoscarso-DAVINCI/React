import { createContext, useContext, useState } from 'react';
import mascotasData from '../data/mascotas.json';
import turnosData from '../data/turnos.json';
import usersData from '../data/users.json';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [mascotas, setMascotas] = useState(mascotasData);
  const [turnos, setTurnos] = useState(turnosData);
  const [usuarios, setUsuarios] = useState(usersData);

  function addMascota(mascota) {
    const nueva = { ...mascota, id: Date.now() };
    setMascotas(prev => [...prev, nueva]);
    return nueva;
  }

  function updateMascota(id, data) {
    setMascotas(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  }

  function deleteMascota(id) {
    setMascotas(prev => prev.filter(m => m.id !== id));
    setTurnos(prev => prev.filter(t => t.mascotaId !== id));
  }

  function addTurno(turno) {
    const nuevo = { ...turno, id: Date.now() };
    setTurnos(prev => [...prev, nuevo]);
    return nuevo;
  }

  function updateTurno(id, data) {
    setTurnos(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }

  function deleteTurno(id) {
    setTurnos(prev => prev.filter(t => t.id !== id));
  }

  function addUsuario(usuario) {
    const nuevo = { ...usuario, id: Date.now() };
    setUsuarios(prev => [...prev, nuevo]);
    return nuevo;
  }

  function updateUsuario(id, data) {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  }

  function deleteUsuario(id) {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }

  return (
    <DataContext.Provider value={{
      mascotas, turnos, usuarios,
      addMascota, updateMascota, deleteMascota,
      addTurno, updateTurno, deleteTurno,
      addUsuario, updateUsuario, deleteUsuario,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
