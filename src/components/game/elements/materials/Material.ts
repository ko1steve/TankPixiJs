import { Tween } from '@tweenjs/tween.js';
import { ISprite, Sprite } from 'src/elements/Sprite';


export class Material extends Sprite {

	protected config: IMaterial;
	protected maxHp: number;
	protected hp: number;

	protected _isVanish: boolean = false;

	public get isVanish (): boolean {
		return this._isVanish;
	}

	protected init ( config: IMaterial ) {
		super.init( config );
		this.maxHp = this.config.hp;
		this.hp = this.config.hp;
	}

	public reduceHp ( value: number ): void {
		this.hp -= value;
		if ( this.hp <= 0 ) {
			this.die();
		}
	}

	protected die (): void {
		this.texture = PIXI.utils.TextureCache[ this.config.dieAssetName ];
		new Tween( this )
			.to( { alpha: 0 }, 1000 )
			.onComplete( () => {
				this._isVanish = true;
			} )
			.start();
	}

}

export interface IMaterial extends ISprite {
	hp: number;
	dieAssetName: string;
}