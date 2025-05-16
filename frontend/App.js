import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({ nombre: '', apellido: '', edad: '', direccion: '', email: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:8000/clientes/', form);
    alert("Cliente agregado!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} />
      <input name="edad" placeholder="Edad" type="number" onChange={handleChange} />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default App;