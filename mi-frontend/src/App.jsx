import { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCog, FaSignOutAlt, FaSearch, FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  // 1. ESTADO DE NAVEGACIÓN (El "Interruptor")
  const [vistaActual, setVistaActual] = useState('notas'); // Puede ser 'notas' o 'usuarios'

  // 2. ESTADOS DE DATOS
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [formData, setFormData] = useState({ usuario_id: '', asignatura_codigo: '', valor: '' });

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    fetch('http://localhost:3000/usuarios').then(res => res.json()).then(data => setUsuarios(data.data || []));
    fetch('http://localhost:3000/asignaturas').then(res => res.json()).then(data => setMaterias(data.data || []));
  };

  const handleSubmitNota = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        alert("✅ Nota registrada con éxito");
        setFormData({...formData, valor: ''});
      } else {
        alert("❌ Error al registrar");
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="d-flex">
      
      {/* --- SIDEBAR --- */}
      <div className="bg-dark text-white sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <h3 className="mb-4 text-center fw-bold text-primary">AdminPanel</h3>
          <hr className="text-secondary" />
          
          <ul className="nav flex-column gap-2">
            {/* Botón Gestión Notas */}
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${vistaActual === 'notas' ? 'active bg-primary text-white' : 'text-white-50'}`}
                onClick={() => setVistaActual('notas')}
              >
                <FaChalkboardTeacher /> Gestión Notas
              </button>
            </li>

            {/* Botón Usuarios */}
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${vistaActual === 'usuarios' ? 'active bg-primary text-white' : 'text-white-50'}`}
                onClick={() => setVistaActual('usuarios')}
              >
                <FaUserGraduate /> Usuarios
              </button>
            </li>
            
            <li className="nav-item">
              <button className="nav-link w-100 text-start text-white-50 d-flex align-items-center gap-2">
                <FaCog /> Configuración
              </button>
            </li>
          </ul>
        </div>
        
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="main-content">
        
        {/* Navbar Superior */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 justify-content-between">
          <span className="navbar-brand mb-0 h1 text-secondary">
            {vistaActual === 'notas' ? 'Registrar Calificaciones' : 'Listado de Usuarios'}
          </span>
          <div className="d-flex align-items-center gap-3">
             <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{width: 40, height: 40}}>
              A
            </div>
          </div>
        </nav>

        <div className="p-5">
          
          {/* VISTA 1: FORMULARIO DE NOTAS */}
          {vistaActual === 'notas' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 border-bottom-0">
                <h5 className="mb-0 text-primary fw-bold">Nueva Nota</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitNota} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Estudiante</label>
                    <select 
                      className="form-select bg-light"
                      value={formData.usuario_id}
                      onChange={e => setFormData({...formData, usuario_id: e.target.value})}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Asignatura</label>
                    <select 
                      className="form-select bg-light"
                      value={formData.asignatura_codigo}
                      onChange={e => setFormData({...formData, asignatura_codigo: e.target.value})}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {materias.map(m => (
                        <option key={m.codigo} value={m.codigo}>{m.nombre_materia}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Calificación</label>
                    <input 
                      type="number" className="form-control bg-light" placeholder="0 - 100"
                      value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12 text-end mt-4">
                    <button type="submit" className="btn btn-primary px-4">Guardar Nota</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VISTA 2: TABLA DE USUARIOS */}
          {vistaActual === 'usuarios' && (
            <div className="card border-0 shadow-sm animate__animated animate__fadeIn">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary fw-bold">Directorio de Usuarios</h5>
                <button className="btn btn-sm btn-outline-primary">
                  <FaPlus /> Nuevo Usuario
                </button>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Cédula</th>
                      <th>Nombre</th>
                      <th>Rol</th> {/* Ahora mostramos el rol también */}
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map((u) => (
                        <tr key={u.id}>
                          <td className="ps-4 fw-bold">#{u.id}</td>
                          <td>{u.cedula}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary" style={{width:32, height:32}}>
                                <FaUserGraduate size={14}/>
                              </div>
                              {u.nombre}
                            </div>
                          </td>
                          <td>
                            {/* Etiqueta de color según el rol */}
                            <span className={`badge ${u.rol === 'docente' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                              {u.rol || 'Estudiante'}
                            </span>
                          </td>
                          <td><span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;