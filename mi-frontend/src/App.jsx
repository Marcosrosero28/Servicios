import { useState, useEffect } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario_id: '',
    asignatura_codigo: '',
    valor: ''
  });

  // Cargar listas al iniciar
  useEffect(() => {
    // 1. Cargar Usuarios
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.data || []));

    // 2. Cargar Asignaturas
    fetch('http://localhost:3000/asignaturas')
      .then(res => res.json())
      .then(data => setMaterias(data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/notas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if(response.ok) {
      alert("Nota registrada con éxito");
      setFormData({...formData, valor: ''}); // Limpiar nota
    } else {
      alert("Error al registrar");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestión Académica</h1>
      
      <div className="card p-4 shadow-sm">
        <h3>Registrar Calificación</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Estudiante:</label>
            <select 
              className="form-select"
              value={formData.usuario_id}
              onChange={e => setFormData({...formData, usuario_id: e.target.value})}
              required
            >
              <option value="">Seleccione...</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                   {u.nombre} - ({u.cedula})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Materia:</label>
            <select 
              className="form-select"
              value={formData.asignatura_codigo}
              onChange={e => setFormData({...formData, asignatura_codigo: e.target.value})}
              required
            >
              <option value="">Seleccione...</option>
              {materias.map(m => (
                <option key={m.codigo} value={m.codigo}>
                  {m.nombre_materia}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Nota:</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0 - 100"
              value={formData.valor}
              onChange={e => setFormData({...formData, valor: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Guardar Nota</button>
        </form>
      </div>
    </div>
  );
}

export default App;