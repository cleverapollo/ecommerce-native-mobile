export enum ScriptName {
  HOTJAR
}

export interface Script {
  name: ScriptName;
  src: string;
}

export const ScriptStore: Script[] = [
  { name: ScriptName.HOTJAR, src: 'assets/scripts/hotjar.js'}
];
