import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the built site work from any free host or sub-folder
export default defineConfig({ base: './', plugins: [react()] });
