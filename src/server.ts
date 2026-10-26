import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';

createApp().listen(config.port, () => {
  logger.info(`Bus booking API listening on http://localhost:${config.port}`);
});
