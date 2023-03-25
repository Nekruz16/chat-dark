const chatHistory = document.querySelector('.chat-history');
const userInput = document.getElementById('user-input');

function addMessageToChat(message, sender) {
  const newMessage = document.createElement('div');
  newMessage.classList.add('chat-message');
  newMessage.classList.add(sender + '-message');

  const avatarUrl = sender === 'user' ? '1.jpg' : '2.jpg';
  const senderName = sender === 'user' ? 'Пользователь' : 'Dark';
  const avatarHtml = `<img class="avatar" src="${avatarUrl}" alt="${sender}">`;
  const messageHtml = `<p>${message}</p>`;
  const nameHtml = `<span class="${sender}-name">${senderName}</span>`;
  newMessage.innerHTML = `${avatarHtml}${messageHtml}`;

  chatHistory.appendChild(newMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight; // автоматическая прокрутка
  return newMessage;
}


function addTypingMessageToChat(sender) {
  const newMessage = document.createElement('div');
  newMessage.classList.add('chat-message');
  newMessage.classList.add(sender + '-message');

  const avatarUrl = sender === 'user' ? '1.jpg' : '2.jpg';
  const senderName = sender === 'user' ? 'Пользователь' : 'Dark';
  const avatarHtml = `<img class="avatar" src="${avatarUrl}" alt="${sender}">`;
  const messageHtml = '<p><strong>Обрабатываю...</strong> </p>';

  newMessage.innerHTML = `${avatarHtml}${messageHtml}`;

  chatHistory.appendChild(newMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight; // автоматическая прокрутка
  return newMessage;
}

function clearChat() {
  chatHistory.innerHTML = '';
}

document.querySelector('.delete button').addEventListener('click', clearChat);

function sendMessage(event) {
  event.preventDefault();
  const message = userInput.value.trim();
  if (message === '') {
    return;
  }
  const maxTokens = 4000;
  if (message.length > maxTokens) {
    addMessageToChat('Ваше сообщение превышает количество символов! Напишите вопрос покороче!', 'bot');
    userInput.value = '';
    return;
  }
  addMessageToChat(message, 'user');
  userInput.value = '';
  const typingMessage = addTypingMessageToChat('bot');
  getResponseFromChatGPT(message, typingMessage);
}

function getResponseFromChatGPT(message, typingMessage) {
  const openaiApiKey = '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';
  const endpointUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + openaiApiKey
  };

  const prompt = message.endsWith('=') ? message : message + '=';
  const requestBody = {
    prompt: prompt,
    max_tokens: 4000,
    temperature: 0.5
  };

  fetch(endpointUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(data => {
    const responseText = data.choices[0].text.trim();
    typingMessage.innerHTML = `<img class="avatar" src="2.jpg" alt="bot"><p><strong></strong> </p>`;
    const responseMessage = typingMessage.querySelector('p');
    addTypingEffect(responseMessage, responseText, 50);
  })
  .catch(error => {
    console.error(error);
    typingMessage.innerHTML = `<img class="avatar" src="2.jpg" alt="bot"><p><strong></strong> Ошибка при генерации ответа! Возможно ваше сообщение слишком длинное!
    Если ошибка всё ещё не исправилась, то напишите создателю нажав на кнопки VK либо TG</p>`;
  });
}



function addTypingEffect(element, text, speed) {
    let i = 0;
    const typeInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(typeInterval);
        }
    }, speed);
}

document.querySelector('.chat-input').addEventListener('submit', sendMessage);
