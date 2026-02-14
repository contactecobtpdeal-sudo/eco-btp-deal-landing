import React, { useState, useRef, useEffect, FormEvent } from "react";
import "./ChatBot.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface LeadInfo {
  name: string;
  email: string;
}

const QUICK_SUGGESTIONS = [
  "Quels matériaux avez-vous en stock ?",
  "Comment fonctionne la livraison ?",
  "Quels sont vos tarifs ?",
  "Comment vendre mes matériaux ?",
  "Quelles garanties proposez-vous ?",
];

const STORAGE_KEY_MESSAGES = "ecobtp-chat-messages";
const STORAGE_KEY_LEAD = "ecobtp-chat-lead";

const SupportChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lead, setLead] = useState<LeadInfo | null>(null);
  const [leadForm, setLeadForm] = useState<LeadInfo>({ name: "", email: "" });
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      const savedLead = localStorage.getItem(STORAGE_KEY_LEAD);
      if (savedLead) {
        setLead(JSON.parse(savedLead));
        setShowLeadForm(false);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      } catch {
        // Ignore storage errors
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !showLeadForm) {
      inputRef.current?.focus();
    }
  }, [isOpen, showLeadForm]);

  // Init audio for notification
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZWTi4J3bGRdV1liboKRm6GcloqAdW1mYV5fZnKBj5mgnZeLgXZsZGBdXmVygo+aoZ2Wi4F1bGRgXV5lcYKPmqGdlouBdWxkYF1eZXKCj5qhnZaLgXVsZGBdXmVygo+aoZ2Wi4F1bGNgXV5lcoKPmqGdlouBdWxkYF1eZXKCj5qhnZaLgXVsZGBdXmVygg=="
    );
    audioRef.current.volume = 0.3;
  }, []);

  function playNotification() {
    audioRef.current?.play().catch(() => {});
  }

  function handleLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.email.trim()) return;

    const newLead: LeadInfo = {
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
    };
    setLead(newLead);
    setShowLeadForm(false);
    try {
      localStorage.setItem(STORAGE_KEY_LEAD, JSON.stringify(newLead));
    } catch {
      // Ignore
    }

    // Welcome message
    const welcome: Message = {
      role: "assistant",
      content: `Bonjour ${newLead.name} ! Je suis l'assistant Eco-BTP Deal. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos matériaux de réemploi, la livraison, les tarifs, ou tout autre sujet lié à notre marketplace.`,
      timestamp: Date.now(),
    };
    setMessages([welcome]);

    // Notify lead to backend
    notifyLead(newLead, [welcome]);
  }

  function notifyLead(leadInfo: LeadInfo, msgs: Message[]) {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: leadInfo.name,
        email: leadInfo.email,
        messages: msgs.map((m) => ({ role: m.role, content: m.content })),
      }),
    }).catch(() => {});
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          lead: lead,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Pas de flux de réponse");

      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }

      playNotification();
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }

      // Send conversation update to backend
      if (lead) {
        const latestMessages = [...updatedMessages, { role: "assistant" as const, content: assistantContent, timestamp: Date.now() }];
        notifyLead(lead, latestMessages);
      }
    } catch {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    sendMessage(suggestion);
  }

  function toggleChat() {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }

  function clearHistory() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {
      // Ignore
    }
  }

  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage(`📎 Fichier joint : ${file.name}`);
    }
    // Reset pour permettre de re-sélectionner le même fichier
    e.target.value = "";
  }

  return (
    <div className="ecobtp-chatbot">
      {/* Floating button */}
      <button
        className="ecobtp-chatbot__toggle"
        onClick={toggleChat}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {unreadCount > 0 && !isOpen && (
          <span className="ecobtp-chatbot__badge">{unreadCount}</span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="ecobtp-chatbot__window">
          {/* Header */}
          <div className="ecobtp-chatbot__header">
            <div className="ecobtp-chatbot__header-info">
              <div className="ecobtp-chatbot__avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="ecobtp-chatbot__title">Eco-BTP Deal</h3>
                <span className="ecobtp-chatbot__status">
                  <span className="ecobtp-chatbot__status-dot" />
                  En ligne
                </span>
              </div>
            </div>
            <div className="ecobtp-chatbot__header-actions">
              {messages.length > 0 && (
                <button
                  className="ecobtp-chatbot__header-btn"
                  onClick={clearHistory}
                  title="Effacer l'historique"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
              <button
                className="ecobtp-chatbot__header-btn"
                onClick={toggleChat}
                title="Fermer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lead form */}
          {showLeadForm ? (
            <div className="ecobtp-chatbot__lead-form">
              <div className="ecobtp-chatbot__lead-intro">
                <h4>Bienvenue sur Eco-BTP Deal !</h4>
                <p>
                  Votre marketplace de réemploi de matériaux BTP. Renseignez vos
                  coordonnées pour démarrer la conversation.
                </p>
              </div>
              <form onSubmit={handleLeadSubmit}>
                <div className="ecobtp-chatbot__field">
                  <label htmlFor="ecobtp-name">Nom complet</label>
                  <input
                    id="ecobtp-name"
                    type="text"
                    placeholder="Votre nom"
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="ecobtp-chatbot__field">
                  <label htmlFor="ecobtp-email">Email professionnel</label>
                  <input
                    id="ecobtp-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <button type="submit" className="ecobtp-chatbot__lead-btn">
                  Démarrer la conversation
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="ecobtp-chatbot__messages">
                {messages.length === 0 && (
                  <div className="ecobtp-chatbot__empty">
                    <p>Posez-nous vos questions sur le réemploi de matériaux BTP !</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`ecobtp-chatbot__message ecobtp-chatbot__message--${msg.role}`}
                  >
                    <div className="ecobtp-chatbot__bubble">
                      <p>{msg.content}</p>
                      <span className="ecobtp-chatbot__time">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="ecobtp-chatbot__message ecobtp-chatbot__message--assistant">
                    <div className="ecobtp-chatbot__bubble ecobtp-chatbot__typing">
                      <span className="ecobtp-chatbot__dot" />
                      <span className="ecobtp-chatbot__dot" />
                      <span className="ecobtp-chatbot__dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 1 && (
                <div className="ecobtp-chatbot__suggestions">
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="ecobtp-chatbot__suggestion"
                      onClick={() => handleSuggestionClick(s)}
                      disabled={isTyping}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="ecobtp-chatbot__actions">
                <a
                  href="mailto:contact.eco.btp.deal@gmail.com"
                  className="ecobtp-chatbot__action ecobtp-chatbot__action--email"
                  title="Email"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>

              {/* Input */}
              <form className="ecobtp-chatbot__input-area" onSubmit={handleSubmit}>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="ecobtp-chatbot__file-hidden"
                  onChange={handleFileSelected}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                />
                <button type="button" className="ecobtp-chatbot__attach-btn" title="Joindre un fichier ou une photo" onClick={handleFileClick}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <textarea
                  ref={inputRef}
                  className="ecobtp-chatbot__input"
                  placeholder="Écrivez votre message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="ecobtp-chatbot__send"
                  disabled={!input.trim() || isTyping}
                  title="Envoyer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportChatbot;
