import { ASSETS_PATH } from '@core/ui.constants';

export enum ScriptName {
  HOTJAR, GTM
}

export interface Script {
  name: ScriptName;
  src: string;
}

export const ScriptStore: Script[] = [
  { name: ScriptName.HOTJAR, src: `${ASSETS_PATH}/scripts/hotjar.js`},
  { name: ScriptName.GTM, src: `${ASSETS_PATH}/scripts/gtm.js`}
];
