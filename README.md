# Tiles App

Created with Tauri and React. This app receives input data from an Arduino Micro via HID. This data is used to run macros, for example after a button has been pressed.

Windows only right now, because Autohotkey is required to run macros.

## Available Scripts

In the project directory, you can run:

### `npm run tauri dev`

Runs the app in the development mode. Requires [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites) to be installed.

### `npm run tauri build`

Builds the installer to `src-tauri/target/release/bundle/msi` (Windows)