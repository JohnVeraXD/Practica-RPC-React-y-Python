from flask import Flask, request
from flask_cors import CORS
from jsonrpcserver import method, dispatch ,Success, Error
import psycopg2

app = Flask(__name__)
CORS(app)  # Habilita CORS en todas las rutas

# Configura la conexión a la base de datos PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    user="postgres",
    password="12345",
    database="Practica-RPC"
)
#cursor = conn.cursor()

# Se define las operaciones CRUD

# Metodo para crear
@method
def crear_actividad(title, description, encargado):
    try:
        cursor = conn.cursor()
        # Realizar el Ingreso de datos
        cursor.execute("INSERT INTO tareas (titulo, descripcion,encargado) VALUES (%s, %s, %s)", (title, description,encargado))
        # Confirmar la tranzacion de manera permanente
        conn.commit()
        # Retornar un resultado
        return Success("Datos guardados exitosamente")
    except Exception as e:
        return Error(1, f"Error al guardar los datos: {str(e)}")
    finally:
        #Cerrar el cusor
        cursor.close()

# Metodo para listar
@method
def leer_actividades():
    try:
        cursor = conn.cursor()
        # Realizar la consulta SELECT
        cursor.execute("SELECT * FROM tareas")
        # Obtener los resultados
        tasks = cursor.fetchall()
        # Convertir los resultados a un formato JSON
        #print (Success(tasks))
        return Success(tasks)
    except Exception as e:
        return Error(2, f"Error al leer los datos: {str(e)}")
    finally:
        #Cerrar el cusor
        cursor.close()

# Metodo para actualizar
@method
def modificar_actividad(task_id, title, description,encargado):
    try:
        cursor = conn.cursor()
        # Realizar la Modificacion de los datos
        cursor.execute("UPDATE tareas SET titulo = %s, descripcion = %s, encargado = %s WHERE id_tareas = %s", (title, description,encargado, task_id))
        # Confirmar la tranzacion de manera permanente
        conn.commit()
        # Retornar un resultado
        return Success("Datos guardados exitosamente")
    except Exception as e:
        return Error(3, f"Error al modificar los datos: {str(e)}")
    finally:
        #Cerrar el cusor
        cursor.close()

# Metodo para eliminar
@method
def eliminar_actividades(task_id):
    try:
        cursor = conn.cursor()
        # Realizar la Eliminacion de los datos
        cursor.execute("DELETE FROM tareas WHERE id_tareas = %s", (task_id,))
        # Confirmar la tranzacion de manera permanente
        conn.commit()
        # Retornar un resultado
        return Success("Datos eliminados exitosamente")
    except Exception as e:
        return Error(4, f"Error al eliminar los datos: {str(e)}")
    finally:
        #Cerrar el cusor
        cursor.close()

@app.route('/jsonrpc', methods=['POST'])

def handle_request():
    response = dispatch(request.get_data().decode())
    return response, 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(host='localhost', port=4099)
