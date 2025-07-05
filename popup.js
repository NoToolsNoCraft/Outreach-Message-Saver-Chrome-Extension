document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');
  const saveButton = document.getElementById('saveMessage');
  const messageList = document.getElementById('messageList');

  loadMessages();

  saveButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;

    chrome.storage.local.get(['messages'], (result) => {
      const messages = result.messages || [];
      messages.push(message);
      chrome.storage.local.set({ messages }, () => {
        messageInput.value = '';
        loadMessages();
      });
    });
  });

  function loadMessages() {
  chrome.storage.local.get(['messages'], (result) => {
    const messages = result.messages || [];
    messageList.innerHTML = '';
    messages.forEach((msg, index) => {
      const div = document.createElement('div');
      div.className = 'message-block';
      div.innerHTML = `
        <pre>${msg}</pre>
        <div class="button-row">
          <button class="copy-btn" data-index="${index}">📋</button>
          <button class="delete-btn" data-index="${index}">×</button>
        </div>
        
      `;
      messageList.appendChild(div);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        deleteMessage(index);
      });
    });

    document.querySelectorAll('.copy-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        chrome.storage.local.get(['messages'], (result) => {
          const messages = result.messages || [];
          const textToCopy = messages[index];
          navigator.clipboard.writeText(textToCopy).then(() => {
            button.textContent = "✔";
            setTimeout(() => (button.textContent = "📋"), 1000);
          });
        });
      });
    });
  });
}

  function deleteMessage(index) {
    chrome.storage.local.get(['messages'], (result) => {
      const messages = result.messages || [];
      messages.splice(index, 1);
      chrome.storage.local.set({ messages }, loadMessages);
    });
  }
});

