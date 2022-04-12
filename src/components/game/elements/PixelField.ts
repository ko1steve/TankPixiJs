
import { Inject } from 'typescript-ioc';
import { Viewport } from 'src/core/Viewport';
import { IDisplayObject, IPoint } from 'src/elements/DisplayObject';
import { Sprite } from 'src/elements/Sprite';
import { View } from 'src/ui/View';

export class PixelField extends View {

	@Inject
	protected viewport: Viewport;

	protected config: IPixelField;

	protected tiles: Array<Sprite>;

	protected startPoint: IPoint;
	protected endPoint: IPoint;

	constructor ( config: IPixelField ) {
		super( config );
	}

	public get realWidth (): number {
		return this.config.pixelSize * this.config.pixelMap[ 0 ].length;
	}

	public get realHeight (): number {
		return this.config.pixelSize * this.config.pixelMap.length;
	}

	protected init ( config: IPixelField ): void {
		super.init( config );
		this.createTiles( config );
	}

	protected createTiles ( config: IPixelField ): void {
		this.tiles = new Array<Sprite>();
		this.startPoint = {
			x: - config.pixelSize * 2,
			y: - config.pixelSize * 2
		};
		this.endPoint = {
			x: Math.ceil( this.viewport.width / config.pixelSize ) * config.pixelSize,
			y: Math.ceil( this.viewport.height / config.pixelSize ) * config.pixelSize
		};
		this.config.pixelMap.forEach( ( rows, i ) => {
			rows.forEach( ( texture, j ) => {
				const tile = new Sprite( { name: 'tile' } );
				tile.texture = PIXI.utils.TextureCache[ texture ];
				tile.position.set( this.config.pixelSize * i, this.config.pixelSize * j );
				this.addChild( tile );
				this.tiles.push( tile );
			} );
		} )
		this.position.set(
			this.viewport.width / 2 - this.config.playerInitPosition.x,
			this.viewport.height / 2 - this.config.playerInitPosition.y
		);
	}

	public scroll ( direction: ScrollDirection, speed: number ): void {
		switch ( direction ) {
			case ScrollDirection.UP:
				this.position.y -= speed;
				break;
			case ScrollDirection.DOWN:
				this.position.y += speed;
				break;
			case ScrollDirection.LEFT:
				this.position.x -= speed;
				break;
			case ScrollDirection.RIGHT:
				this.position.x += speed;
				break;
		}
		this.updateTileVisible();
	}

	protected updateTileVisible (): void {
		this.tiles.forEach( tile => {
			tile.renderable = !this.isExceedBorder( tile );
		} )
	}

	protected isExceedBorder ( tile: Sprite ): boolean {
		return tile.getGlobalPosition().x <= this.startPoint.x
			|| tile.getGlobalPosition().x >= this.endPoint.x
			|| tile.getGlobalPosition().y <= this.startPoint.y
			|| tile.getGlobalPosition().y >= this.endPoint.y;
	}
}

export interface IPixelField extends IDisplayObject {
	playerInitPosition: IPoint;
	tiles: Array<string>;
	pixelSize: number;
	pixelMap: Array<Array<string>>;
}

export enum ScrollDirection {
	UP,
	DOWN,
	LEFT,
	RIGHT
}