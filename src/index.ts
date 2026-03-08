import app from '@/app';
import { config } from '@/config/index';

app.listen(config.port, () => {
  console.info(`Server is running on port ${config.port}`);
});
