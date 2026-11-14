import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { Writable } from 'node:stream';
import { App } from './App';

export { staticPaths, unlistedPaths } from './routes';
export { bookingFields, bookingFormNames, contactFields, fileFields, honeypotField } from './content/forms';

export function render(url: string): Promise<{ html: string; head: string }> {
  const helmetContext: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, done) {
        html += chunk.toString();
        done();
      },
    });
    sink.on('finish', () => {
      const h = helmetContext.helmet;
      const head = h
        ? [h.title.toString(), h.priority.toString(), h.meta.toString(), h.link.toString(), h.script.toString()].join('')
        : '';
      resolve({ html, head });
    });
    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
