# Feature: AI Pixel-Art Mood Companion

## 1. Overview
A 2D pixel-art character that lives on the dashboard. It reacts visually to the user's mood and provides supportive, AI-generated commentary via OpenRouter (GPT-OSS-20B).

## 2. Visual Interaction Logic
- **Idle State**: Subtle vertical scaling (squash and stretch) using `react-native-reanimated`.
- **Mood Input**: When a user selects a mood in the `MoodTracker`, the `CompanionStore` updates the `currentSprite` texture.
- **Reaction Map**:
    - **Happy/Excited**: Sprite performs a small jump (`withSpring`) and displays a "sparkle" particle effect.
    - **Sad/Tired**: Sprite texture changes to "droopy" eyes; color saturation is lowered by 10%.
    - **Anxious/Stressed**: Sprite displays a subtle jitter/shake animation.

## 3. AI Speech Bubble Logic
- **Trigger**: New mood entry or manual "poke" (tap) on the sprite.
- **Provider**: OpenRouter API.
- **Model**: `gpt-oss-20b` or equivalent lightweight model.
- **System Prompt**: 
    > "You are [CompanionName], a tiny, pixel-art companion for a couple. You are warm, encouraging, and use short sentences. Address the user's mood: {{mood}}. Use 1-2 cute emojis. Max 20 words."
- **UI Component**: A custom SVG or Skia-drawn rounded speech bubble that scales up from the sprite's position using `layout={Layout.Springify()}`.

## 4. Technical Implementation (Ignite Service)
- **Store**: `CompanionStore.ts` (MobX-State-Tree).
- **State**: `currentMessage: string`, `isThinking: boolean`, `moodState: 'idle' | 'happy' | 'sad' | 'anxious'`.
- **Service**: `api/companion-api.ts` handles the POST request to `https://openrouter.ai/api/v1/chat/completions`.

## 5. Micro-Interactions
- **Poking**: Tapping the sprite triggers a "blinking" animation and a new randomized short greeting.
- **Feeding/Petting**: Small secondary interactions that increment a "closeness" variable in the `RelationshipStore`.

## 6. Styling Constraints
- **Font**: Use `PressStart2P-Regular` for the text inside the bubble.
- **Bubble Style**: 2px dark charcoal border, white background, no blur on shadow.