import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

interface Props {
  mode: string;
}

export default ({ mode }: Props) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    define: {
      __APP_ENV__: env.APP_ENV
    },
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT)
    }
  });
};
