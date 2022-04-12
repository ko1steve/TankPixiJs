import { IConfig } from 'src/ui/Config';

export class View extends PIXI.Container {

	protected config: IConfig;

	constructor ( config?: IConfig ) {
		super();
		this.init( config );
	}

	protected init ( config?: IConfig ): void {
		this.config = config;
	}

}