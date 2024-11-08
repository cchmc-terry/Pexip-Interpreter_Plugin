import { registerPlugin, ChecklistElement } from "@pexip/plugin-api";
import { roomDirectory } from "./rooms"; 

// Use https://fontawesome.com/search SVG path for icons
const directoryIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z" fill="rgb(43, 64, 84)"/></svg>';

const directoryHoverIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z" fill="white"/></svg>';

const customDirectoryIcon = {
  main: directoryIcon,
  hover: directoryHoverIcon,
};

const pluginName = "interpreter";

const plugin = await registerPlugin({
  id: pluginName,
  version: 0,
});

// Show toast notification when connected
//plugin.events.connected.add(() => {
//  plugin.ui.showToast({ message: `${pluginName} connected`, isInterrupt: true, timeout: 3000 });
//});

// Add the Room Directory button to the toolbar
const Button = await plugin.ui.addButton({
  position: "toolbar",
  icon: { custom: customDirectoryIcon },
  tooltip: "Interpreter",
  roles: ["chair"],
}).catch(console.warn);

// Handle button click to show endpoint selection
Button?.onClick.add(async () => {
  const endpointForm = await plugin.ui.addForm({
    title: "Interpreter",
    description: "Select a language to call.",
    form: {
      elements: {
        directoryList: {
          name: "Language for Interpretation",
          type: "select",
          options: roomDirectory.videoRooms.map((room) => ({
            id: room.id,
            label: room.label,
          })),
        },
      },
      submitBtnTitle: "Invite",
      closeBtnTitle: "Cancel",
    },
  });

  // Handle endpoint selection and initiate a call
  endpointForm.onInput.add(async (formInput) => {
    endpointForm.remove();

    const selectedEndpointId = formInput.directoryList;
    const selectedRoom = roomDirectory.videoRooms.find((room) => room.id === selectedEndpointId);

    if (selectedRoom) {
      await plugin.conference.dialOut({
        role: "GUEST",
        destination: selectedEndpointId,
        protocol: "auto",
      });

      plugin.ui.showToast({
        message: `📞 Calling ${selectedRoom.label}`,
        isInterrupt: true,
        timeout: 5000,
      });
    }
  });

  // Close the form when the Cancel button is pressed
  endpointForm.onClose.add(() => {
    plugin.ui.showToast({ message: "Call canceled", timeout: 2000 });
  });
});
