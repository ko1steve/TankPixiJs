import { Tween } from '@tweenjs/tween.js';
import { IPixelField, PixelField, ScrollDirection } from 'src/components/game/elements/PixelField';
import { ITank, MoveDirection, Tank } from 'src/components/game/elements/Tank';
import { IGameConfig, IMaterialSettings } from 'src/components/game/GameConfig';
import { View } from 'src/ui/View';
import { Bullet } from 'src/components/game/elements/Bullet';
import { IPoint } from 'src/elements/DisplayObject';
import { AngleDirection } from 'src/config/GeneralInterface';
import { Material } from 'src/components/game/elements/materials/Material';
import { CollisionDirection, CollisionSystem } from 'src/core/CollisionSystem';
import { Helper } from 'src/utils/Helper';
import { Sprite } from 'src/elements/Sprite';

export class GameView extends View {

	protected config: IGameConfig;

	protected field: PixelField;
	protected tank: Tank;
	protected bullets: Array<Bullet>;
	protected materials: Array<Material>;
	protected emptyOnMap: Array<number>;

	protected init ( config?: IGameConfig ): void {
		super.init( config );
		this.initBullets();
		this.initEmptyOnMap();
		this.createField( config.pixelField );
		this.createTank( config.tank );
		this.createMaterials( config.material );
	}

	protected createField ( config: IPixelField ): void {
		this.field = new PixelField( config );
		this.addChild( this.field );
	}

	protected initBullets (): void {
		this.bullets = new Array<Bullet>()
	}

	protected createTank ( config: ITank ): void {
		this.tank = new Tank( config );
		this.addChild( this.tank );
	}

	protected initEmptyOnMap (): void {
		const rowLength: number = this.config.pixelField.pixelMap[ 0 ].length;
		const columnLength: number = this.config.pixelField.pixelMap.length;
		this.emptyOnMap = new Array<number>();
		for ( let i: number = 0; i < rowLength * columnLength; i++ ) {
			this.emptyOnMap.push( i );
		}
	}

	protected createMaterials ( config: IMaterialSettings ): void {
		this.materials = new Array<Material>();
		const rowLength: number = this.config.pixelField.pixelMap[ 0 ].length;
		const pixelSize: number = this.config.pixelField.pixelSize;
		config.sprites.forEach( spriteConfig => {
			const amount: number = config.amountOfMaterial.get( spriteConfig.name );
			for ( let i: number = 0; i < amount; i++ ) {
				if ( this.emptyOnMap.length === 0 ) {
					break;
				}
				const material: Material = new Material( spriteConfig );
				const randomIndex: number = Helper.randomInt( 0, this.emptyOnMap.length );
				const positionIndex: number = this.emptyOnMap[ randomIndex ];
				this.emptyOnMap.splice( randomIndex, 1 );
				const rowIndex: number = Math.floor( positionIndex / rowLength );
				const columnIndex: number = positionIndex % rowLength;
				material.position.set(
					rowIndex * pixelSize + spriteConfig.anchor.x * pixelSize,
					columnIndex * pixelSize + spriteConfig.anchor.y * pixelSize
				);
				this.field.addChild( material );
				this.materials.push( material );
			}
		} );
	}

	public moveTank ( direction: MoveDirection, speed: number ): void {
		const angle: number = this.getTankAngleDirection( direction );
		const scrollDirection: ScrollDirection = this.getFieldScrollDirection( this.tank.direction );
		if ( this.isTankMovable( scrollDirection, speed ) ) {
			this.field.scroll( scrollDirection, speed );
		}
		this.tank.setDirection( angle );
	}

	protected isTankMovable ( direction: ScrollDirection, speed: number ): boolean {
		let isScrollable: boolean = false;
		switch ( direction ) {
			case ScrollDirection.LEFT:
				isScrollable = this.field.position.x + this.field.realWidth > this.tank.position.x + this.tank.width / 2;
				break;
			case ScrollDirection.UP:
				isScrollable = this.field.position.y + this.field.realHeight > this.tank.position.y + this.tank.height / 2;
				break;
			case ScrollDirection.RIGHT:
				isScrollable = this.field.position.x < this.tank.position.x - this.tank.width / 2;
				break;
			case ScrollDirection.DOWN:
				isScrollable = this.field.position.y < this.tank.position.y - this.tank.height / 2;
				break;
		}
		return isScrollable && !this.isTankCollideMaterial( direction, speed );
	}

	protected isTankCollideMaterial ( direction: ScrollDirection, speed: number ): boolean {
		let collosionDirection: CollisionDirection;
		switch ( direction ) {
			case ScrollDirection.UP:
				collosionDirection = CollisionDirection.UP;
				break;
			case ScrollDirection.DOWN:
				collosionDirection = CollisionDirection.DOWN;
				break;
			case ScrollDirection.LEFT:
				collosionDirection = CollisionDirection.LEFT;
				break;
			case ScrollDirection.RIGHT:
				collosionDirection = CollisionDirection.RIGHT;
				break;
		}
		let isCollide: boolean = false;
		for ( let material of this.materials ) {
			if ( CollisionSystem.isCollide( this.tank, material, speed, collosionDirection ) && !material.isVanish ) {
				isCollide = true;
			}
		}
		return isCollide;
	}

	protected getTankAngleDirection ( direction: MoveDirection ): AngleDirection {
		return ( direction * 90 ) % 360;
	}

	protected getFieldScrollDirection ( angle: number ): ScrollDirection {
		switch ( angle ) {
			case AngleDirection.LEFT:
				return ScrollDirection.RIGHT;
			case AngleDirection.UP:
				return ScrollDirection.DOWN;
			case AngleDirection.RIGHT:
				return ScrollDirection.LEFT;
			case AngleDirection.DOWN:
				return ScrollDirection.UP;
		}
	}

	public shoot (): void {
		let bullet: Bullet = new Bullet( this.config.bullet, this.field );
		this.field.addChild( bullet );
		this.bullets.push( bullet );
		const posOffset: IPoint = { x: 0, y: 0 };
		switch ( this.tank.direction ) {
			case AngleDirection.LEFT:
				posOffset.x -= this.tank.width / 2;
				break;
			case AngleDirection.UP:
				posOffset.y -= this.tank.height / 2;
				break;
			case AngleDirection.RIGHT:
				posOffset.x += this.tank.width / 2;
				break;
			case AngleDirection.DOWN:
				posOffset.y += this.tank.height / 2;
				break;
		}
		bullet.position.set(
			this.tank.position.x - this.field.position.x + posOffset.x,
			this.tank.position.y - this.field.position.y + posOffset.y
		)
		bullet.setDirection( this.tank.direction );
		bullet.startFly( 20 );
	}

	public updateFrame (): void {
		for ( let i: number = 0; i < this.bullets.length; i++ ) {
			const bullet: Bullet = this.bullets[ i ];
			if ( bullet.isFly ) {
				bullet.fly();
			}
			let isBoom: boolean = false;
			for ( let i in this.materials ) {
				if ( this.materials[ i ].isVanish ) {
					this.materials.splice( +i, 1 );
					this.field.removeChild( this.materials[ i ] );
					continue;
				}
				if ( CollisionSystem.isCollide( bullet, this.materials[ i ] ) ) {
					this.materials[ i ].reduceHp( bullet.damage );
					isBoom = true;
					break;
				}
			}
			if ( bullet.outOfField() || isBoom ) {
				bullet.stopFly();
				this.boom( bullet );
				this.field.removeChild( bullet );
				this.bullets.splice( i, 1 );
			}
		}
	}

	protected boom ( bullet: Bullet ): void {
		const boomPos: IPoint = this.getBoomPosition( bullet );
		const boom = new Sprite( this.config.boom );
		boom.position.set( boomPos.x, boomPos.y );
		this.field.addChild( boom );
		new Tween( boom )
			.to( { alpha: 0 }, 1000 )
			.onComplete( () => {
				this.field.removeChild( boom );
			} )
			.start();
	}

	protected getBoomPosition ( bullet: Bullet ): IPoint {
		switch ( bullet.direction ) {
			case AngleDirection.UP:
				return { x: bullet.position.x, y: bullet.position.y - bullet.height * bullet.anchor.y };
			case AngleDirection.DOWN:
				return { x: bullet.position.x, y: bullet.position.y + bullet.height * ( 1 - bullet.anchor.y ) };
			case AngleDirection.LEFT:
				return { x: bullet.position.x - bullet.width * bullet.anchor.x, y: bullet.position.y };
			case AngleDirection.RIGHT:
				return { x: bullet.position.x + bullet.width * ( 1 - bullet.anchor.x ), y: bullet.position.y };
		}
	}

}