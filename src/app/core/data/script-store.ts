export enum ScriptName {
  HOTJAR, GTM
}

export interface Script {
  name: ScriptName;
  src: string;
}

export const ScriptStore: Script[] = [
  { name: ScriptName.HOTJAR, src: 'assets/scripts/hotjar.js'},
  { name: ScriptName.GTM, src: 'assets/scripts/gtm.js'}
];
