from flask import Flask, request, jsonify, render_template
import re
import difflib
from preguntas import preguntas_respuestas


app = Flask(__name__)

# Lista para almacenar los mensajes enviados por el usuario
user_messages = []

# Ruta para cargar la página HTML del chatbot
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para procesar las solicitudes del chatbot
@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    message = data['message'].lower()  # Convertir el mensaje a minúsculas
    response, image_url = respond_to_message(message)  # Llamada a la función que procesa la respuesta

    # Agregar el mensaje del usuario a la lista
    user_messages.append(message)

    return jsonify({'response': response, 'image_url': image_url})

def respond_to_message(message):
    # Expresión regular para eliminar el signo de interrogación al final (si está presente)
    message_cleaned = re.sub(r'[?]+$', '', message)

    # Buscar la respuesta en el diccionario de preguntas_respuestas
    if message_cleaned in preguntas_respuestas:
        return preguntas_respuestas[message_cleaned]['response'], preguntas_respuestas[message_cleaned]['image_url']

    # Agrega aquí más casos específicos si lo deseas
    # ...

    else:
        # Buscar palabras cercanas a la pregunta mal escrita
        corrected_question = difflib.get_close_matches(message_cleaned, list(preguntas_respuestas.keys()), n=1, cutoff=0.6)

        if corrected_question:
            response, image_url = respond_to_message(corrected_question[0])
            return f"Perdón, quisiste decir: \"{corrected_question[0]}\". {response}", image_url
        else:
            return "No comprendo como responder eso. ¿Podrías ser más específico?", None

if __name__ == '__main__':
    app.run()
