import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const REACT_APP_OTEL_ENABLED = process.env.REACT_APP_OTEL_ENABLED === 'true';

export const initializeOpenTelemetry = () => {
  if (!REACT_APP_OTEL_ENABLED) {
    console.log('OpenTelemetry is disabled.');
    return;
  }

  const provider = new WebTracerProvider();

  // Configure span processor to send spans to the console
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Register the provider to be used by instrumentation libraries
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new XMLHttpRequestInstrumentation(),
      new FetchInstrumentation(),
    ],
  });

  console.log('OpenTelemetry initialized with ConsoleSpanExporter.');
};
