import { Layout } from './components/layout/Layout';
import { PageRoutes } from './components/layout/PageRoutes';
import { MotionProvider } from './lib/motion';

export function App() {
  return (
    <MotionProvider>
      <Layout>
        <PageRoutes />
      </Layout>
    </MotionProvider>
  );
}
