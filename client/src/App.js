import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'; 
import Axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [aniosTrabajo, setAniosTrabajo] = useState('');
  const [empleadosList, setEmpleados] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  //const [tarjetasVisibles, setTarjetasVisibles] = useState([]);
  const [editar, setEditar] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Listar empleados
  const getEmpleados = () => {
    Axios.get('http://localhost:3001/empleados').then((response) => {
      setEmpleados(response.data);
      setMostrarTabla(true);
      //setTarjetasVisibles(response.data.map(() => true));
    });
  };
  
  // Configurar formulario para editar
  const handleEditar = (empleado) => {
    setNombre(empleado.nombres);
    setEdad(empleado.edad);
    setPais(empleado.pais);
    setCargo(empleado.ocupacion);
    setAniosTrabajo(empleado.anios);
    setCurrentId(empleado.id);
    setEditar(true);
  };

  // Actualizar empleado
  const updateEmpleado = () => {
    Axios.put('http://localhost:3001/update', {
      id: currentId,
      nombre,
      edad,
      pais,
      ocupacion: cargo,
      anios: aniosTrabajo
    }).then(() => {
      Swal.fire({
        title: "Actualización exitosa",
        html: "<p>El empleado <strong>"+ nombre + " </strong> ha sido actualizado exitosamente.</p>",
        icon: "success",
        draggable: true,
        timer: 2000
      });
      resetForm();
      getEmpleados();
    });
  };

 // eliminar registro

  const deleteEmpleado = (id) => {
    Axios.delete(`http://localhost:3001/empleados/${id}`).
    then(() => {
      getEmpleados();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertirlo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, elimnarlo!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Eliminado",
            text: "Tú registro ha sido eliminado.",
            icon: "success"
          });
        }
      });
      resetForm();
      
    });
  };
  // Agregar empleado
  const addEmpleado = () => {
    Axios.post('http://localhost:3001/create', {
      nombre,
      edad,
      pais,
      ocupacion: cargo,
      anios: aniosTrabajo
    }).then(() => {
      Swal.fire({
        title: "Empleado Registrado",
        html: "<p>El empleado <strong>"+ nombre + " </strong> ha sido registrado exitosamente.</p>",
        icon: "success",
        draggable: true,
        timer: 2000
      });
      resetForm();
    });
  };

  const resetForm = () => {
    setNombre('');
    setEdad('');
    setPais('');
    setCargo('');
    setAniosTrabajo('');
    setEditar(false);
    setCurrentId(null);
  };

  const cerrarTabla = () => setMostrarTabla(false);
  // const cerrarTarjeta = (index) => {
  //   const nuevas = [...tarjetasVisibles];
  //   nuevas[index] = false;
  //   setTarjetasVisibles(nuevas);
  // };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white fw-bold fs-5">
          Gestión de Empleados
        </div>
        <div className="card-body">
          <h5 className="card-title text-secondary mb-3 text-center"> Registro</h5>
          <p className="card-text text-muted">Agrega nuevos empleados y visualiza el listado completo.</p>

          {/* Formulario */}
          <form className="row g-4 p-4 bg-light rounded-4 shadow-sm mt-4 mx-2 border">
            <div className="col-12">
              <label htmlFor="nombre" className="form-label fw-semibold">Nombre Completo</label>
              <input
                id="nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Nombre Completo"
                autoComplete="name"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="edad" className="form-label fw-semibold">Edad</label>
              <input
                id="edad"
                value={edad}
                onChange={e => setEdad(e.target.value)}
                type="number"
                className="form-control"
                placeholder="Años"
                min="0"
                autoComplete="off"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="pais" className="form-label fw-semibold">País</label>
              <input
                id="pais"
                value={pais}
                onChange={e => setPais(e.target.value)}
                type="text"
                className="form-control"
                placeholder="País"
                autoComplete="country-name"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="cargo" className="form-label fw-semibold">Cargo</label>
              <input
                id="cargo"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Cargo u Ocupación"
                autoComplete="organization-title"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="anios" className="form-label fw-semibold">Años de Trabajo</label>
              <input
                id="anios"
                value={aniosTrabajo}
                onChange={e => setAniosTrabajo(e.target.value)}
                type="number"
                className="form-control"
                placeholder="Años de trabajo"
                min="0"
                autoComplete="off"
                required
              />
            </div>

            <div className="col-12 text-center mt-3">
              {editar ? (
                <>
                  <button type="button" className="btn btn-primary me-2 px-4" onClick={updateEmpleado}>
                    Actualizar
                  </button>
                  <button type="button" className="btn btn-secondary px-4" onClick={resetForm}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary me-2 px-4" onClick={addEmpleado}>
                    Registrar
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={getEmpleados}>
                    Listar Empleados
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Tabla */}
          {mostrarTabla && (
            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-primary">📑 Listado de Empleados</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={cerrarTabla}>
                  Cerrar Tabla
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle shadow-sm">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>País</th>
                      <th>Cargo</th>
                      <th>Años</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleadosList.map((val, idx) => (
                      <tr key={idx} className="text-center">
                        <td>{idx + 1}</td>
                        <td>{val.nombres}</td>
                        <td>{val.edad}</td>
                        <td>{val.pais}</td>
                        <td>{val.ocupacion}</td>
                        <td>{val.anios}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-info text-white"
                              onClick={() => handleEditar(val)}
                            >
                              Editar
                            </button>
                            <button type="button" 
                              className="btn btn-danger"
                              onClick={() => deleteEmpleado(val.id)}
                              
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer text-muted text-end fst-italic">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );

}

export default App;
