<div align="center">

# LA PALABRA

**A Spanish Word Guessing Game**

Un juego de palabras en español · Guess hidden Spanish words, letter by letter

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-C13A1E?style=for-the-badge&logo=github&logoColor=white)](https://harisnae.github.io/lapalabra/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1C1712?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-274C99?style=for-the-badge&logo=github)](https://harisnae.github.io/lapalabra/)

</div>

---

## Live Demo

> ### [Play La Palabra now — no installation required](https://harisnae.github.io/lapalabra/)

The game runs entirely in the browser. No accounts, no downloads, no dependencies to install.
Open the link above and start guessing.

---

## About

**La Palabra** is a hangman-style word guessing game built around frequent Spanish nouns.
A hidden Spanish word is chosen at random, and its letters are hidden behind blank tiles.
Guess letters one at a time — correct letters are stamped onto the board, wrong guesses
cost a try. Reveal the whole word before you run out of tries to extend your score streak.

The visual design imitates an old print shop: warm cream paper, near-black ink, hard
offset shadows, rubber-stamp red accents, and a subtle paper grain texture laid over
everything. Every revealed letter lands with a satisfying "stamp" animation and sound.

---

## Features

- **Five difficulty levels** — words of 5, 6, 7, 8+ (up to 14) letters, plus a random option
- **500+ curated Spanish nouns** with English translations, revealed after each round
- **Full Spanish keyboard support** — on-screen keys include Ñ and the accented vowels Á É Í Ó Ú
- **Physical keyboard input** — type directly on a QWERTY keyboard; accents and Ñ included
- **Score streak system** — winning extends your streak, losing resets it; best streak is saved
- **Persistent preferences** — score, best score, and mute state survive page reloads via localStorage
- **Synthesized sound effects** — key clicks, stamp thumps, win and lose jingles, built on the Web Audio API (no audio files)
- **Fully responsive** — from small phones to desktop, with dynamic tile sizing so every word fits
- **Accessible** — keyboard-navigable, focus-visible outlines, and `prefers-reduced-motion` support
- **Zero dependencies** — plain HTML, CSS, and JavaScript. No frameworks, no build step

---

## How to Play

1. **Choose a word length** on the start screen (5, 6, 7, 8+ letters, or random).
2. A random Spanish word is selected and hidden behind blank tiles.
3. **Guess letters** by clicking the on-screen keyboard or typing on your physical keyboard.
4. Correct letters are revealed on the tiles. Wrong guesses cost one try.
5. **Win** by revealing the whole word before running out of tries. The English meaning is shown after each round.

### Difficulty and Tries

| Word Length | Wrong Guesses Allowed |
|:-----------:|:---------------------:|
| 5 letters   | 3                     |
| 6 letters   | 4                     |
| 7 letters   | 4                     |
| 8+ letters  | 4                     |

### Keyboard Shortcuts

| Key | Action |
|:---|:---|
| `A` – `Z`, `Ñ`, `Á É Í Ó Ú` | Guess a letter (game screen) |
| `5` / `6` / `7` / `8` | Quick-start a word length (start screen) |
| `Enter` | Start the next word after a round ends |

---

## Screenshots

| Start Screen | Game Screen |
|:---:|:---:|
| *Choose your word length* | *Guess letters, avoid mistakes* |

> Screenshots can be added here. Recommended size: 800 x 600 px, saved in a `/screenshots` directory.

---

## Technology

| Layer | Choice |
|:---|:---|
| Markup | Semantic HTML5, single page |
| Styling | Modern CSS — custom properties, `clamp()`, flexbox, grid, container queries, keyframe animations |
| Logic | Vanilla JavaScript (ES6+), no frameworks |
| Audio | Web Audio API — all sounds synthesized at runtime |
| Fonts | [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) and [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (UI) via Google Fonts |
| Hosting | GitHub Pages |

---

## Project Structure

## Run Locally

No build step is required. Either open the file directly or serve it locally:

```bash
# Option 1: clone and open
git clone https://github.com/harisnae/lapalabra.git
cd lapalabra
# then open index.html in your browser

# Option 2: serve with any static server (recommended)
npx serve .
# or
python3 -m http.server 8080

---

## Deployment (GitHub Pages)

This repository is deployed via GitHub Pages:

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**, then choose `main` and `/ (root)`.
4. Save. The site will be available at `https://harisnae.github.io/lapalabra/`.

---

## Customization

The game is designed to be easy to extend:

- **Add words** — edit the `WORDS` object in `script.js`. Each entry is `{ w: 'WORD', m: 'meaning' }`, grouped by word length. Use uppercase precomposed characters (Á, É, Í, Ó, Ú, Ñ).
- **Adjust difficulty** — edit the `TRIES` object in `script.js` to change the number of allowed wrong guesses per length.
- **Change the keyboard layout** — edit the `ROWS` array in `script.js`.
- **Retune the theme** — all colors, fonts, and the tile letter ratio are defined as CSS custom properties in the `:root` block at the top of `style.css`.
- **Mute or re-skin sounds** — the entire sound engine is self-contained in the `Sound` module in `script.js`.

---

## Roadmap

Ideas for future contributions:

- Definitions shown in Spanish as well as English
- Optional hint system (reveal one letter at a cost)
- Daily challenge mode with a shared word of the day
- Statistics page (games played, win rate, guess distribution)
- Additional word pools or regional vocabulary variants

---

## License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
See the [LICENSE](LICENSE) file for the full license text.

---
