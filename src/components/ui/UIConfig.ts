import { IConfig } from 'src/ui/Config';

export class UIConfig implements IUIConfig {

	public name: string = 'UIController';

}

export interface IUIConfig extends IConfig {

}