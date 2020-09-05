import React,{useEffect, useState} from 'react';
import {firebase} from './firebase';


function App() {

  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState(''); // state para el formulario
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState('');


  useEffect( () => {
    const obtenerDatos = async () => {
      // Llamamos a Firebase
      try {
        const db = firebase.firestore(); //Nustra bbdd
        const data = await db.collection('tareas').get(); // Obtenemos las tareas
        
        // Agregamos las tareas a nuestro array
        const arrayData = data.docs.map(doc => ({ id : doc.id, ...doc.data() }));
        //console.log(arrayData);
        setTareas(arrayData); // Seteamos nuestro estado tareas

      } catch (error) {
        console.error(error.message);
      }
    }
    
    obtenerDatos();

  }, []);


  const agregarTarea = async(e) => {
    e.preventDefault();
    
    if (!tarea.trim()) {
      console.log('elemento vacío');
      return;
    }

    try {
      const db = firebase.firestore();
      
      const nuevaTarea = {
        name : tarea,
        fecha : Date.now()
      };

      const data = await db.collection('tareas').add(nuevaTarea);
      /**
       * ...tareas : Mantenemos los datos del arreglo
       * ...nuevaTarea : mantenemos los datos del objeto nuevaTarea y agregamos
       * el id, que se obtiene desde Firebase
       */
      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ]);

      setTarea('');

    } catch (error) {
      console.error(error);
    }

    console.log(tarea);
  }

  const eliminarTarea = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('tareas').doc(id).delete(); // Eliminamos una tarea
      
      const arrayFiltrado = tareas.filter(item => item.id !== id);

      setTareas(arrayFiltrado);
    
    } catch (error) {
      console.error(error);
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name); // para que salga el nombre de la tarea en el formulario
    setId(item.id);
  }

  const editarTarea = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.error('campo vacío');
      return;
    }

    try {
      const db = firebase.firestore();
      // actualizamos la tarea en firebase
      await db.collection('tareas').doc(id).update({
        name : tarea
      })

      const arrayEditado = tareas.map( item => (
        item.id === id ? {id : item.id, fecha : item.fecha, name : tarea} : item
      ))
      
      // Actualizamdo estados
      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea('');
      setId('');

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(item => (
                <li className="list-group-item" key={item.id}>
                  {item.name}

                  <button
                    className="btn btn-danger btn-sm float-right"
                    onClick={() => eliminarTarea(item.id)}
                  >
                    
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick={ () => activarEdicion(item) }
                  >
                    
                    Editar
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h3>
          <form onSubmit= { modoEdicion ?  editarTarea : agregarTarea } >
            <input 
              className="form-control mb-2"
              onChange={ e => setTarea(e.target.value) }
              placeholder="Ingrese tarea"
              type='text'
              value={tarea}
            />
            <button 
              className={
                modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
              }
              type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form> 
        </div>
      </div>

    </div>
  );
}

export default App;
