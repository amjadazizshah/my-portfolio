# Amjad’s Demo Agent

An English **voice receptionist demonstration**, built for sales conversations with boutique hotels, salons and home-service businesses. The existing chat receptionist is also available.

## Run

Serve `dist/` with any static HTTP server. No dependency installation, API key, or build is required. Example: `python3 -m http.server 8080 --directory dist`.

Run meaningful logic checks with `npm test` (Node 20+). There are 38 checks covering booking validation, three complete voice sample flows, spoken date/time/contact parsing, confirmation requirements, interruption handling, tenant service separation, and CSV escaping. Browser testing covers request capture, inbox review, business separation, and the sample conversation. The test browser has no usable speech voice, so actual audible playback and microphone transcription could not be verified in that environment.

## Working behavior

- Three independent fictional business profiles, conversations and inboxes.
- Deterministic English replies grounded in the selected profile; unknown questions offer a staff handoff.
- Booking requests with contact, date, time, room capacity and basic example schedule checks.
- Staff review with pending, confirmed, resolved and cancelled states.
- Editable business information, browser-local persistence and CSV exports with formula escaping.
- Voice-first screen with animated speaking/listening states, call timer, spoken replies, microphone input where supported, optional automatic listening, replay, mute, and end controls.
- A recorded MP3 sample call for each original business, with native play/pause/seek controls, a synchronized transcript and a pending request saved once on completion. Both roles use the same synthetic example voice. Sample dates are shown on screen instead of spoken as fixed calendar dates.
- Spoken booking dialogue collects service, guest count, dates, time, name, and example contact one question at a time. Explicit confirmation is required before saving.
- Quick replies and typed caller input provide a fallback when microphone recognition is unavailable; WhatsApp-style chat preview remains available.

## Demonstration boundaries

This uses guided local dialogue logic, not a language model. No paid voice API key is required. It is not connected to telephony, WhatsApp, a calendar, or payments. No telephone calls or external business messages are sent, and no real appointments are created. Confirmation changes only a local demo record. Data stays in the current browser and is not shared between visitors or devices. Demo schedules, locations, and prices are fictional; example service prices use USD. The app is a sales prototype, not a production tenant-authentication or booking platform.

Browser speech recognition is optional and not supported in every browser. It may send microphone audio to the browser vendor's online speech-recognition service. The app does not record or retain audio. Microphone access starts only after the visitor uses the microphone control or enables automatic listening. Spoken transcripts are saved in browser-local storage. Use example information. Speech synthesis uses available English browser voices; the interface reports missing or failed audio support and keeps the typed/sample conversation usable. End, business changes, navigation, page hiding, and reload stop microphone capture and speech playback. The recorded MP3 sample and speaker test are served with this app. No live speech model is downloaded to the visitor’s device.

Speech API reference: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API and https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition.

Live generative AI requires a provider decision and authorized credential setup. Production phone and WhatsApp need their own providers, account connections, inbound handling, and appropriate booking integrations. Keep business settings and guest data isolated server-side before any production rollout.

All page strings render through text content or HTML escaping. No production secrets or real client data are included.

## Render deployment

This export is stored in `amjads-demo-agent/` on the `amjads-demo-agent` GitHub branch. Render static publishing uses `amjads-demo-agent/dist`, with `node --test amjads-demo-agent/tests/*.test.js` as the build check. Set `SKIP_INSTALL_DEPS=true` because this app has no external dependencies. It needs no secrets or server.

The Render URL is a public demonstration; staff controls apply only to browser-local example data. No actual bookings or live communications are created.

## Browser audio recovery

The first speech request starts synchronously from a tap. Native synthesis is resumed if paused; idle synthesis is not repeatedly cancelled. A visible “Enable / test sound” control and a “Tap to hear reply” retry support browsers that block speech. Recorded sample calls keep native audio controls visible if the initial play request is blocked; the visitor can press Play directly. A separate recorded speaker test checks media playback without native speech synthesis. Live browser speech retains its tap-to-retry recovery. Speech never starting is detected separately from a long utterance. Audio playback still depends on device/browser voices and output settings. The remote test browser is not an iPhone, so real iOS audio output must be verified on-device.

## Recorded audio assets

The MP3 files were generated offline using Piper and the en_US-ljspeech-medium model. No paid voice API or runtime voice credentials are used. Voice model card: https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD . Training dataset: https://keithito.com/LJ-Speech-Dataset/ (public domain). The model is used only during asset generation and is not shipped.

To regenerate, install the optional development tool `piper-tts` and FFmpeg, download that model plus its adjacent `.onnx.json` configuration, and run `python scripts/generate-audio.py /path/to/model.onnx`. The output includes three MP3 recordings, a speaker test and timestamp metadata. Existing recordings require no build dependencies.

Real iPhone playback still needs on-device confirmation. The recorded sample is separate from live microphone conversations, which still depend on the browser’s speech APIs. Customized business names or services require a new recording; the UI directs visitors to restore the original sample or use live voice.
