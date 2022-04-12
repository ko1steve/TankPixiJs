import { Tween } from '@tweenjs/tween.js';
import { PixelField } from 'src/components/game/elements/PixelField';
import { AngleDirection } from 'src/config/GeneralInterface';
import { IPoint } from 'src/elements/DisplayObject';
import { ISprite, Sprite } from 'src/elements/Sprite';

export class Bullet extends Sprite {

	protected config: IBullet;
	protected field: PixelField;

	protected _isFly: boolean = false;

	public get isFly (): boolean {
		return this._isFly;
	}

	protected _damage: number;
	public get damage (): number {
		return this._damage;
	}

	protected _speed: number = 10;

	public get speed (): number {
		return this._speed;
	}

	constructor ( config: IBullet, field: PixelField ) {
		super( config );
		this.init( config, field );
	}

	protected init ( config: IBullet, field?: PixelField ) {
		super.init( config );
		this._damage = config.damage;
		this.field = field;
	}

	public startFly ( speed: number ): void {
		this._speed = speed;
		this._isFly = true;
	}

	public stopFly (): void {
		this._isFly = false;
		this.visible = false;
	}

	public fly (): void {
		if ( !this.isFly ) {
			return;
		}
		switch ( this.direction ) {
			case AngleDirection.LEFT:
				this.x -= this.speed;
				break;
			case AngleDirection.UP:
				this.y -= this.speed;
				break;
			case AngleDirection.RIGHT:
				this.x += this.speed;
				break;
			case AngleDirection.DOWN:
				this.y += this.speed;
				break;
		}
		if ( this.outOfField() ) {
			this._isFly = false;
			this.visible = false;
		}
	}

	public outOfField (): boolean {
		return this.getGlobalPosition().x - this.anchor.x * this.width < this.field.getGlobalPosition().x
			|| this.getGlobalPosition().x + ( 1 - this.anchor.x ) * this.width > this.field.getGlobalPosition().x + this.field.realWidth
			|| this.getGlobalPosition().y - this.anchor.y * this.height < this.field.getGlobalPosition().y
			|| this.getGlobalPosition().y + ( 1 - this.anchor.y ) * this.height > this.field.getGlobalPosition().y + this.field.realHeight;
	}

}

export interface IBullet extends ISprite {
	damage: number;
}