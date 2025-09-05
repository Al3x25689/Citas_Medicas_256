import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaUserCircle, FaCalendarAlt, FaClock, FaTrashAlt, FaMoon, FaSun } from "react-icons/fa";

function App() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [citas, setCitas] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");

  const agregarCita = async (e) => {
    e.preventDefault();
    if (!nombre || !fecha || !hora) {
      showToast("Completa todos los campos");
      return;
    }
    try {
      await addDoc(collection(db, "citas"), { nombre, fecha, hora });
      setNombre(""); setFecha(""); setHora("");
      obtenerCitas();
      showToast("Cita agregada ✅");
    } catch (error) {
      console.error("Error agregando cita:", error);
      showToast("Error al agregar cita ❌");
    }
  };

  const obtenerCitas = async () => {
    const querySnapshot = await getDocs(collection(db, "citas"));
    const citasArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      removing: false
    }));
    setCitas(citasArray);
  };

  const eliminarCita = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta cita?")) return;
    try {
      setCitas((prev) => prev.map(c => c.id === id ? {...c, removing: true} : c));
      setTimeout(async () => {
        await deleteDoc(doc(db, "citas", id));
        obtenerCitas();
        showToast("Cita eliminada 🗑️");
      }, 300);
    } catch (error) {
      console.error("Error eliminando cita:", error);
      showToast("Error al eliminar cita ❌");
    }
  };

  useEffect(() => { obtenerCitas(); }, []);

  const getColorByHour = (hora) => {
    const h = parseInt(hora.split(":")[0]);
    if (h < 12) return "bg-blue-100 text-blue-800 shadow-blue-300";
    if (h < 18) return "bg-green-100 text-green-800 shadow-green-300";
    return "bg-gray-100 text-gray-800 shadow-gray-300";
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-green-50 dark:bg-gray-900`}>
      <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarAlt /> Citas Médicas
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white text-xl"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto p-6 w-full">
        <form
          onSubmit={agregarCita}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-wrap gap-4 justify-center mb-10"
        >
          <input
            type="text"
            placeholder="Nombre del paciente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-700 dark:text-white"
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-700 dark:text-white"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition transform hover:-translate-y-1"
          >
            Agendar cita
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">📋 Lista de Citas</h2>
        {citas.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay citas registradas</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className={`p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 ${getColorByHour(cita.hora)} ${cita.removing ? "animate-fadeOut" : "animate-fadeIn"}`}
              >
                <p className="text-lg font-bold flex items-center gap-2">
                  <FaUserCircle /> {cita.nombre}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <FaCalendarAlt /> {cita.fecha}
                </p>
                <p className="flex items-center gap-2 mb-2">
                  <FaClock /> {cita.hora}
                </p>
                <button
                  onClick={() => eliminarCita(cita.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold"
                >
                  <FaTrashAlt /> Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-blue-600 dark:bg-gray-800 text-white p-4 mt-auto shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          © 2025 | Hecho por Al3x256
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
