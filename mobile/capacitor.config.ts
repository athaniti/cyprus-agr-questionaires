import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'gr.dataverse.cypagrapp',
  appName: 'cyprus-agr-mob',
  webDir: 'dist',
  server: {
    url: 'http://192.168.30.19:5173', // Your Mac's IP + Vite dev server port
    cleartext: true
  }
};

export default config;
