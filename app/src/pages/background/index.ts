import {setupContentScriptHMR} from '../../foundation/ContentScript';

if (import.meta.env.DEV) {
  setupContentScriptHMR();
}
