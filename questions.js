// Define your OpenAI API credentials
const apiKeyOpenAI = 'sk-proj-QelNLGxE9v4SalYoMQACT3BlbkFJPezf9KiLBPUIpoJ6fhZQ';
const endpointOpenAI = 'https://api.openai.com/v1/chat/completions';

const responseArray = [];

// Function to call the OpenAI API
async function callOpenAI(messages) {
  try {
    console.log('Sending request to OpenAI...');
    const response = await axios.post(endpointOpenAI, {
      messages: messages,
      model: 'gpt-3.5-turbo'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyOpenAI}`
      }
    });

    console.log('Received response from OpenAI:', response.data);
    const completion = response.data.choices[0].message.content;
    return completion;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    return 'Error occurred. Please try again.';
  }
}

// Function to append message to the chat container
function appendMessage(message, className) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('li');
  messageElement.classList.add(className);
  messageElement.innerHTML = `<p>${message}</p>`;
  messagesContainer.appendChild(messageElement);
}

// Function to handle sending a message
async function sendMessage() {
  const userInput = document.getElementById('user-input');
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    const messages = [
      { role: 'system', content: 'You are User' },
      { role: 'user', content: userMessage }
    ];

    showLoader();

    const completion = await callOpenAI(messages);
    responseArray.push(completion);

    fetchSearchResults();

    hideLoader();

    appendMessage(completion, 'assistant-message');
  }
}

// Function to hide the loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Function to show the loader
function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

// Function to handle regenerating a response
async function regenerateResponse() {
  const userInput = document.getElementById('user-input');
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    const messages = [
      { role: 'system', content: 'You are User' },
      { role: 'user', content: userMessage }
    ];

    showLoader();

    const completion = await callOpenAI(messages);
    responseArray.push(completion);

    removeListContent();
    responseArray.reverse().forEach(response => appendMessage(response, 'assistant-message'));

    hideLoader();
  }
}

// Function to remove all messages from the chat container
function removeListContent() {
  const messages = document.getElementById('messages');
  while (messages.firstChild) {
    messages.removeChild(messages.firstChild);
  }
}

// Define your Google Search API key
const apiKeyGoogleSearch = 'AIzaSyA9Yy7laNKil6tJf4qIrGl4OtyhlPOjKb8';

// Function to fetch search results from Google Custom Search API
function fetchSearchResults() {
  const searchQuery = document.getElementById('user-input').value;
  const encodedQuery = encodeURIComponent(searchQuery);
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKeyGoogleSearch}&cx=10be43d4bbf0a499e&q=${encodedQuery}`;

  const container = document.getElementById('content-container');

  fetch(url)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = '';

      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const resultElement = document.createElement('div');
          resultElement.classList.add('search-result');

          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', item.link);
          linkElement.setAttribute('target', '_blank');
          linkElement.textContent = item.title;
          resultElement.appendChild(linkElement);

          const snippetElement = document.createElement('p');
          snippetElement.textContent = item.snippet;
          resultElement.appendChild(snippetElement);

          if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
            const imageElement = document.createElement('img');
            imageElement.classList.add('search-image');
            imageElement.setAttribute('src', item.pagemap.cse_image[0].src);
            imageElement.style.maxWidth = '150px';
            imageElement.style.maxHeight = '100px';
            imageElement.style.float = 'inline-block';
            imageElement.style.cursor = 'pointer';

            imageElement.addEventListener('click', () => {
              window.open(item.link, '_blank');
            });

            resultElement.appendChild(imageElement);
          }

          container.appendChild(resultElement);
        });
      } else {
        container.innerHTML = 'No search results found.';
      }
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
    });
}

// Event listener to toggle the scroll to top button visibility
window.addEventListener('scroll', toggleScrollToTopButton);

function toggleScrollToTopButton() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

// Function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
