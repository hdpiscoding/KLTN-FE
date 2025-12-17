# Chat Hooks

Custom React hooks để quản lý chatbot với 3 contexts: General, Insight, và Prediction.

## Hooks

### `useChatContext()`

Quản lý context của chatbot (general, insight, prediction).

**Returns:**
- `currentContext`: Context hiện tại
- `contextMetadata`: Metadata của context (propertyId hoặc predictionId)
- `switchToGeneral()`: Chuyển sang general chat
- `switchToInsight(propertyId)`: Chuyển sang property insight chat
- `switchToPrediction(predictionId)`: Chuyển sang prediction chat
- `switchContext(context, metadata)`: Chuyển sang context tùy chọn

**Example:**
```typescript
const { switchToInsight, currentContext } = useChatContext();

// Switch to property insight
switchToInsight(123);
```

---

### `useLoadChatHistory()`

Load lịch sử chat từ API cho context hiện tại.

**Returns:**
- `loadHistory(context?, metadata?)`: Function để load history
- `isLoading`: Loading state
- `error`: Error nếu có

**Example:**
```typescript
const { loadHistory, isLoading } = useLoadChatHistory();

// Load history for current context
await loadHistory();

// Load history for specific context
await loadHistory("insight", { propertyId: 123 });
```

---

### `useSendMessage()`

Gửi message với streaming support cho context hiện tại.

**Returns:**
- `sendMessage(message, context?, metadata?)`: Function để gửi message
- `isSending`: Sending state
- `error`: Error nếu có

**Example:**
```typescript
const { sendMessage, isSending } = useSendMessage();

// Send to current context
await sendMessage("Cho tôi biết về bất động sản này");

// Send to specific context
await sendMessage("Giá nhà này như thế nào?", "insight", { propertyId: 123 });
```

---

## Usage trong Component

```typescript
import { useChatContext, useLoadChatHistory, useSendMessage } from "@/hooks/chat";
import { useChatStore } from "@/store/chatStore";

function ChatComponent() {
  const messages = useChatStore((state) => state.getCurrentMessages());
  const isTyping = useChatStore((state) => state.isTyping);
  
  const { currentContext, switchToInsight } = useChatContext();
  const { loadHistory, isLoading } = useLoadChatHistory();
  const { sendMessage, isSending } = useSendMessage();

  useEffect(() => {
    // Load history when component mounts
    loadHistory();
  }, []);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleSwitchToProperty = (propertyId: number) => {
    switchToInsight(propertyId);
    loadHistory("insight", { propertyId });
  };

  // ... render UI
}
```

## Architecture

```
┌─────────────────┐
│   Components    │
│  (Chat UI)      │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌──────────────┐
│  Custom Hooks   │    │  Chat Store  │
│  - Context      │◄───┤  (State)     │
│  - History      │    └──────────────┘
│  - Send Message │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Services      │
│  (API Calls)    │
└─────────────────┘
```

## Context Types

| Context      | Metadata Required | API Endpoint                |
|--------------|-------------------|-----------------------------|
| `general`    | None              | `/chat/general/stream`      |
| `insight`    | `propertyId`      | `/insight/chat/stream`      |
| `prediction` | `predictionId`    | `/prediction/.../stream`    |

