import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";
import { PromptService } from "./PromptService";
import useClipboard from "react-use-clipboard";

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [responseText, setResponseText] = useState("");

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const handleSendQuery = async () => {
    const response = await PromptService(transcript);
    if (response.success) {
      setResponseText(response.message);
      setTextToCopy(response.message);
      // Use speech synthesis to read out the response
      const utterance = new SpeechSynthesisUtterance(response.message);
      speechSynthesis.speak(utterance);
    } else {
      setResponseText(response.message);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="container">
      <h2>AI Voice Agent for Car Dealers</h2>
      <div className="main-content">
        <p>Transcript: {transcript}</p>
        <p>Response: {responseText}</p>
      </div>
      <div className="btn-style">
        <button onClick={setCopied}>
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </button>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={SpeechRecognition.stopListening}>
          Stop Listening
        </button>
        <button onClick={handleSendQuery}>Send Query</button>
      </div>
    </div>
  );
};

export default App;
