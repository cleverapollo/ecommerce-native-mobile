import { Injectable } from '@angular/core';
import { Script, ScriptName, ScriptStore } from '@core/data/script-store';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { DefaultPlatformService } from './platform.service';

export enum ScriptLoadingStatus {
  LOADED, ALREADY_LOADED, ERROR
}

export interface ScriptLoadingResult {
  script: ScriptName, status: ScriptLoadingStatus
}

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: { [name: number]: { src: string, loaded: boolean}  } = {};

  constructor(private platform: DefaultPlatformService) {
    if (this.platform.isWeb && environment.backendType == BackendConfigType.prod) {
      this.initScripts();
    }
  }

  private initScripts() {
    ScriptStore.forEach((script: Script) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: ScriptName[]): Promise<ScriptLoadingResult[]> {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: ScriptName): Promise<ScriptLoadingResult> {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, status: ScriptLoadingStatus.ALREADY_LOADED });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, status: ScriptLoadingStatus.LOADED });
        };
        script.onerror = (error: any) => resolve({ script: name, status: ScriptLoadingStatus.ERROR });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
