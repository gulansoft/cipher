// Lista para almacenar los mensajes enviados por el usuario
const userMessages = [];

function appendUserMessage(message) {
    const chatContainer = document.getElementById('chat-container');
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerText = message;
    chatContainer.appendChild(userMessage);

    // Agregar el mensaje del usuario a la lista
    userMessages.push(message);
}

function appendBotMessage(message, imageUrl) {
    const chatContainer = document.getElementById('chat-container');
    const botMessage = document.createElement('div');
    botMessage.classList.add('bot-message');
    botMessage.innerText = message;

    if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = 'Imagen del Producto';
        image.width = 160; // Ancho deseado (260 píxeles)
        image.height = 250; // Alto deseado (450 píxeles)
        botMessage.appendChild(image);
    }

    chatContainer.appendChild(botMessage);
}

function sendMessage() {
    const userMessage = document.getElementById('user-input').value;
    appendUserMessage(userMessage);

    // Realizar la solicitud POST al servidor para obtener la respuesta del chatbot
    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.response;
        const imageUrl = data.image_url;
        appendBotMessage(botResponse, imageUrl);
    })
    .catch(error => {
        console.error('Error al enviar la solicitud:', error);
    });

    document.getElementById('user-input').value = '';
}

function refreshChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';

    // Limpiar la lista de mensajes enviados
    userMessages.length = 0;

    // Enviar un mensaje de bienvenida nuevamente
    appendBotMessage("¡Hola! Soy Cipher, tu asistente de agricultura. ¿En qué puedo ayudarte hoy?", null);
}
