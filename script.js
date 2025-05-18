const OPENAI_API_KEY = "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";
const ELEVENLABS_API_KEY = "sk_46c892dc8e68d5de9d654dc1fd97645d8a20999708eb210d";
const VOICE_ID = "LysucvtFmzi1NVAE0rKp"; // dari ElevenLabs

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const aiResponse = await getAIResponse(message);
  addMessage("AI", aiResponse);

  const audioURL = await getVoice(aiResponse);
  playAudio(audioURL);
}

function addMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

async function getAIResponse(userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

async function getVoice(text) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75
      }
    })
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

