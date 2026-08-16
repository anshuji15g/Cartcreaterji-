/**
 * Cartcreaterji — Frontend Logic & Direct API Connector
 * Made by Ayushman
 */

// Production Backend Engine URL
const BACKEND_ENDPOINT = "https://cartcreaterji-backend.onrender.com";

const mediaInput = document.getElementById("mediaInput");
const fileLabel = document.getElementById("fileLabel");
const progressContainer = document.getElementById("progressContainer");
const progressFill = document.getElementById("progressFill");
const statusText = document.getElementById("statusText");
const chatHistory = document.getElementById("chatHistory");
const userQuery = document.getElementById("userQuery");

let selectedMediaFile = null;

// Media selection handler
mediaInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedMediaFile = file;
        fileLabel.innerText = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
        fileLabel.style.color = "#00f2fe";
        appendMessage("bot", `Media "${file.name}" loaded into Cartcreaterji buffer. Tap an action chip or submit a query to process with Whisper & Llama.`);
    }
});

function triggerQuickAction(promptText) {
    userQuery.value = promptText;
    submitAnalysis();
}

async function submitAnalysis() {
    const prompt = userQuery.value.trim();
    if (!selectedMediaFile && !prompt) {
        alert("Please choose a video/audio file or type a prompt first.");
        return;
    }

    const currentPrompt = prompt || "Analyze this media file for high retention, viral hooks, and SEO optimization.";
    appendMessage("user", currentPrompt);
    userQuery.value = "";

    progressContainer.classList.remove("hidden");
    progressFill.style.width = "20%";
    statusText.innerText = "Transcribing audio via Whisper Large...";

    appendMessage("bot", "⏳ Cartcreaterji neural core scanning audio...");

    const formData = new FormData();
    if (selectedMediaFile) {
        formData.append("mediaFile", selectedMediaFile);
    }
    formData.append("userPrompt", currentPrompt);

    try {
        progressFill.style.width = "60%";
        statusText.innerText = "Running viral pattern and retention analytics...";

        const response = await fetch(BACKEND_ENDPOINT, {
            method: "POST",
            body: formData
        });

        progressFill.style.width = "90%";
        const data = await response.json();

        // Remove loading state
        chatHistory.removeChild(chatHistory.lastChild);
        progressFill.style.width = "100%";
        statusText.innerText = "Analysis Complete ✅";

        setTimeout(() => {
            progressContainer.classList.add("hidden");
            progressFill.style.width = "0%";
        }, 1500);

        if (data.success) {
            let output = "";
            if (data.transcript) {
                output += `📝 **SPOKEN TRANSCRIPTION:**\n"${data.transcript}"\n\n`;
            }
            output += `⚡ **CARTCREATERJI VIRAL ROADMAP:**\n${data.analysis}`;
            appendMessage("bot", output);
        } else {
            appendMessage("bot", `⚠️ Error: ${data.error || "Failed to analyze."}`);
        }
    } catch (err) {
        if (chatHistory.lastChild) {
            chatHistory.removeChild(chatHistory.lastChild);
        }
        progressContainer.classList.add("hidden");
        appendMessage("bot", "❌ Server offline or connecting. Ensure backend is deployed on Render.");
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${sender}-msg`;

    const author = document.createElement("div");
    author.className = "msg-author";
    author.innerText = sender === "bot" ? "Cartcreaterji Core" : "Creator";

    const content = document.createElement("div");
    content.className = "msg-content";
    content.innerText = text;

    msgDiv.appendChild(author);
    msgDiv.appendChild(content);
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearTerminal() {
    chatHistory.innerHTML = `
        <div class="msg bot-msg">
            <div class="msg-author">Cartcreaterji Core</div>
            <div class="msg-content">Terminal reset. Ready for new input.</div>
        </div>
    `;
}
