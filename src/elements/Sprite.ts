import { AngleDirection } from "src/config/GeneralInterface";
import { IDisplayObject } from "src/elements/DisplayObject";
import { TSMap } from "typescript-map";

export class Sprite extends PIXI.Sprite {

	protected config: ISprite;

	protected _direction: number = 0;
	public get direction (): number {
		return this._direction;
	}

	constructor ( config: ISprite ) {
		super();
		this.init( config );
	}

	protected init ( config: ISprite ) {
		this.config = config;
		this.name = config.name;
		this.updateAttribute( config );
	}

	public updateAttribute ( config: ISprite ): void {
		if ( config.position ) {
			this.position.set( config.position.x, config.position.y );
		}
		if ( config.anchor ) {
			this.anchor.set( config.anchor.x, config.anchor.y );
		}
		if ( config.assetName ) {
			this.texture = PIXI.utils.TextureCache[ config.assetName ];
		}
	}

	public setDirection ( value: number ): void {
		this._direction = value;
		if ( this.config.assetNameMap && this.config.assetNameMap.size() > 0 ) {
			this.texture = PIXI.utils.TextureCache[ this.config.assetNameMap.get( value ) ];
		}
	}

}

export interface ISprite extends IDisplayObject {
	assetName?: string;
	assetNameMap?: TSMap<AngleDirection, string>;
}