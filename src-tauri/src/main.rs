#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, UserAttentionType, Window, WindowEvent, Manager, State};

use std::process::Command;
use std::time::Duration;
use std::sync::{Arc, Mutex};
use std::thread;

use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};

extern crate hidapi;


#[derive(Default)]
struct AppState(Arc<Mutex<bool>>);

#[derive(Clone, serde::Serialize)]
struct PayloadStatus {
  status: bool,
}

#[derive(Clone, serde::Serialize)]
struct PayloadData {
  data: u8,
}

#[tauri::command]
fn simulate_key(volume: u8, ahk_path: &str, script_path: &str) -> String {
  println!("volume {}", volume);
  let result = Command::new(ahk_path)
    .arg(script_path)
    .arg(volume.to_string())
    .output();

  match result {
    Ok(res) => {
      println!("Ran ahk command");
    },
    Err(error) => {
      println!("Problem running ahk command: {:?}", error);
      return String::from(error.to_string());
    },
  };
  
  return String::from("");
}

#[tauri::command]
fn update_ahk_path(path: String) {
  println!("path {}", path);
  //let db = PickleDb::new("settings.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json);
  //db.set("ahk-path", &path).unwrap();
}

#[tauri::command]
fn get_device_status(device_status: State<'_, AppState>) -> bool {
  let val = device_status.0.lock().unwrap();
  return *val
}

fn show_window(window:Window) {
  window.show().expect("error when showing window");
  window.set_focus().expect("error when setting focus");
  window.request_user_attention(Some(UserAttentionType::Informational)).expect("error when requesting attention");
}

fn track_device_input(window: Window, vid:u16, pid:u16) {
  thread::sleep(Duration::from_millis(1000)); // sleep to wait for hid api to go away
  let api = hidapi::HidApi::new().unwrap();
  let device = api.open(vid, pid).unwrap();
  let mut buf = [0u8; 64];
  loop {
    println!("tracking tile");
    match device.read(&mut buf[..]) {
      Ok(res) => {
        println!("Read: {:?}", &buf[..res]);
        window.emit("received-data", PayloadData { data: buf[..res][0] }).unwrap();
        thread::sleep(Duration::from_millis(1000));
      },
      Err(error) => {
        println!("Problem opening the file: {:?}", error);
        window.emit("connection-change", PayloadStatus { status: false }).unwrap();
        let state: State<'_, AppState> = window.state();
        let mut val = state.0.lock().unwrap();
        *val = false;
        let cloned_window = window.clone();
        thread::spawn(move || {
          find_device(cloned_window);
        });
        return
      },
    };
  }
}

fn find_device(window: Window) {
  thread::sleep(Duration::from_millis(1000)); // sleep to wait for hid api to go away
  let mut api = hidapi::HidApi::new().unwrap();
  loop {
    println!("looking for tile");
    api.refresh_devices().unwrap();
    for device in api.device_list() {
      if device.product_string() == Some("Tile Core") {
        println!("found tile");
        window.emit("connection-change", PayloadStatus { status: true }).unwrap();
        let state: State<'_, AppState> = window.state();
        let mut val = state.0.lock().unwrap();
        *val = true;
        let vid = device.vendor_id();
        let pid = device.product_id();
        let cloned_window = window.clone();
        thread::spawn(move || {
          track_device_input(cloned_window, vid, pid);
        });
        return
      }
    }
    thread::sleep(Duration::from_millis(1000));
  }
}

fn main() {
  // create db
  //let db = PickleDb::new("settings.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json);
  // if db.exists("ahk-path") {
  //   let path = db.get::<String>("ahk-path").unwrap();
  //   println!("The ahk path is: {}", path);
  // }

  // create system tray menu
  let open = CustomMenuItem::new("open".to_string(), "Open");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let tray_menu = SystemTrayMenu::new()
    .add_item(open)
    .add_item(quit); 

  // create system tray
  let system_tray = SystemTray::new()
    .with_menu(tray_menu);
  
  // build
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .manage(AppState(Default::default()))
    .setup(|app| {
      let handle = app.handle();
      let main_window = app.get_window("main").unwrap();

      // look for devices and track inputs
      let cloned_window = main_window.clone();
      thread::spawn(move || {
        find_device(cloned_window);
      });
      
      // hide window instead of closing
      main_window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
          api.prevent_close();
          
          for (window_name, window) in handle.windows() {
            if window_name == "main" {
              window.minimize().expect("failed to minimize main window");
              window.hide().expect("failed to close main window");
              continue;
            }
          }
        }
      });
      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      // show window on system tray left click
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        show_window(app.get_window("main").unwrap());
      }
      // handle system tray menu items
      SystemTrayEvent::MenuItemClick { id, .. } => {
        match id.as_str() {
          "open" => {
            show_window(app.get_window("main").unwrap());
          }
          "quit" => {
            std::process::exit(0);
          }
          _ => {}
        }
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![simulate_key, update_ahk_path, get_device_status])
    .run(context)
    .expect("error while running tauri application");
}