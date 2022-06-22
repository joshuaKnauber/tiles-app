#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, UserAttentionType, Window, WindowEvent, Manager};

use std::thread;

extern crate hidapi;

use std::process::Command;
use std::time::Duration;

#[derive(Clone, serde::Serialize)]
struct Payload {
  status: bool,
}

#[tauri::command]
fn simulate_key(volume: String, ahk_path: String, script_path: String) {
  println!("volume {}", volume);
  Command::new(ahk_path)
    .arg(script_path)
    .arg(volume)
    .output()
    .expect("failed to execute process");
}

fn show_window(window:Window) {
  //window.unminimize().expect("error when unminimizing");
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
        thread::sleep(Duration::from_millis(1000));
      },
      Err(error) => {
        println!("Problem opening the file: {:?}", error);
        window.emit("connection-change", Payload { status: false }).unwrap();
        thread::spawn(move || {
          find_device(window);
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
        window.emit("connection-change", Payload { status: true }).unwrap();
        let vid = device.vendor_id();
        let pid = device.product_id();
        thread::spawn(move || {
          track_device_input(window, vid, pid);
        });
        return
      }
    }
    thread::sleep(Duration::from_millis(1000));
  }
}

fn main() {
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
    .invoke_handler(tauri::generate_handler![simulate_key])
    .run(context)
    .expect("error while running tauri application");
}