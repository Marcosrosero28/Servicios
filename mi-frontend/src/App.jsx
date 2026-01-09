import { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCog, FaSignOutAlt, FaPlus, FaSave } from 'react-icons/fa';
import './App.css';

function App() {
  // --- ESTADOS ---
  const [vistaActual, setVistaActual] = useState('notas'); 
  
  // Listas de datos
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [listaNotas, setListaNotas] = useState([]);

  // Formularios
  const [formNota, setFormNota] = useState({ usuario_id: '', asignatura_codigo: '', valor: '' });
  const [formUsuario, setFormUsuario] = useState({ cedula: '', nombre: '', clave: '', rol: 'estudiante' });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    // 1. Cargar Usuarios
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.data || []));

    // 2. Cargar Asignaturas
    fetch('http://localhost:3000/asignaturas')
      .then(res => res.json())
      .then(data => setMaterias(data.data || []));

    // 3. Cargar Todas las Notas (Nueva ruta)
    fetch('http://localhost:3000/notas')
      .then(res => res.json())
      .then(data => setListaNotas(data.data || []));
  };

  // --- LOGICA: GUARDAR NOTA ---
  const handleGuardarNota = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/notas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formNota)
    });
    
    if(response.ok) {
      alert("✅ Nota registrada");
      setFormNota({...formNota, valor: ''}); 
      cargarDatos(); // Recargar tablas automáticamente
    } else {
      alert("❌ Error al registrar nota");
    }
  };

  // --- LOGICA: CREAR USUARIO ---
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formUsuario)
    });

    if(response.ok) {
      alert("✅ Usuario creado correctamente");
      setFormUsuario({ cedula: '', nombre: '', clave: '', rol: 'estudiante' }); // Limpiar form
      cargarDatos(); // Recargar la lista de usuarios
    } else {
      const errorData = await response.json();
      alert("❌ Error: " + (errorData.error || "No se pudo crear"));
    }
  };

  return (
    <div className="d-flex">
      
      {/* SIDEBAR */}
      <div className="bg-dark text-white sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <h3 className="mb-4 text-center fw-bold text-primary">AdminPanel</h3>
          <hr className="text-secondary" />
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${vistaActual === 'notas' ? 'active bg-primary text-white' : 'text-white-50'}`}
                onClick={() => setVistaActual('notas')}
              >
                <FaChalkboardTeacher /> Gestión Notas
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${vistaActual === 'usuarios' ? 'active bg-primary text-white' : 'text-white-50'}`}
                onClick={() => setVistaActual('usuarios')}
              >
                <FaUserGraduate /> Usuarios
              </button>
            </li>
          </ul>
        </div>
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <FaSignOutAlt /> Salir
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <nav className="navbar navbar-light bg-white shadow-sm px-4">
          <span className="navbar-brand mb-0 h1 text-secondary">
            {vistaActual === 'notas' ? 'Control de Calificaciones' : 'Administración de Usuarios'}
          </span>
        </nav>

        <div className="p-4">
          
          {/* ================= VISTA NOTAS ================= */}
          {vistaActual === 'notas' && (
            <div className="row g-4">
              {/* FORMULARIO NOTAS */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white fw-bold text-primary">Registrar Nota</div>
                  <div className="card-body">
                    <form onSubmit={handleGuardarNota}>
                      <div className="mb-3">
                        <label className="form-label">Estudiante</label>
                        <select className="form-select bg-light" required value={formNota.usuario_id} onChange={e => setFormNota({...formNota, usuario_id: e.target.value})}>
                          <option value="">Seleccionar...</option>
                          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Materia</label>
                        <select className="form-select bg-light" required value={formNota.asignatura_codigo} onChange={e => setFormNota({...formNota, asignatura_codigo: e.target.value})}>
                          <option value="">Seleccionar...</option>
                          {materias.map(m => <option key={m.codigo} value={m.codigo}>{m.nombre_materia}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nota (0-100)</label>
                        <input type="number" className="form-control bg-light" required value={formNota.valor} onChange={e => setFormNota({...formNota, valor: e.target.value})} />
                      </div>
                      <button className="btn btn-primary w-100"><FaSave /> Guardar</button>
                    </form>
                  </div>
                </div>
              </div>

              {/* TABLA DE NOTAS */}
              <div className="col-md-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white fw-bold text-secondary">Historial de Calificaciones</div>
                  <div className="card-body p-0">
                    <table className="table table-hover mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Estudiante</th>
                          <th>Materia</th>
                          <th className="text-center">Nota</th>
                          <th className="text-end">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaNotas.map((nota, i) => (
                          <tr key={i}>
                            <td className="fw-bold">{nota.estudiante}</td>
                            <td>{nota.nombre_materia}</td>
                            <td className="text-center">
                              <span className={`badge ${nota.valor >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                {nota.valor}
                              </span>
                            </td>
                            <td className="text-end text-muted small">
                              {new Date(nota.fecha).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VISTA USUARIOS ================= */}
          {vistaActual === 'usuarios' && (
            <div className="row g-4">
              
              {/* FORMULARIO CREAR USUARIO */}
              <div className="col-12">
                <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
                  <h6 className="text-primary fw-bold mb-3"><FaPlus /> Crear Nuevo Usuario</h6>
                  <form onSubmit={handleCrearUsuario} className="row g-2 align-items-end">
                    <div className="col-md-3">
                      <label className="small text-muted">Cédula</label>
                      <input type="text" className="form-control bg-light" required placeholder="Ej: 1312..." 
                        value={formUsuario.cedula} onChange={e => setFormUsuario({...formUsuario, cedula: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small text-muted">Nombre Completo</label>
                      <input type="text" className="form-control bg-light" required placeholder="Ej: Juan Perez" 
                        value={formUsuario.nombre} onChange={e => setFormUsuario({...formUsuario, nombre: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                      <label className="small text-muted">Contraseña</label>
                      <input type="password" className="form-control bg-light" required placeholder="*****" 
                        value={formUsuario.clave} onChange={e => setFormUsuario({...formUsuario, clave: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                      <label className="small text-muted">Rol</label>
                      <select className="form-select bg-light" value={formUsuario.rol} onChange={e => setFormUsuario({...formUsuario, rol: e.target.value})}>
                        <option value="estudiante">Estudiante</option>
                        <option value="docente">Docente</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-success w-100">Crear</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* LISTA DE USUARIOS */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-0">
                    <table className="table table-striped mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Cédula</th>
                          <th>Nombre</th>
                          <th>Rol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map(u => (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td>{u.cedula}</td>
                            <td>{u.nombre}</td>
                            <td>
                              <span className={`badge ${u.rol === 'docente' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                                {u.rol}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;