export class DisplayObject extends PIXI.DisplayObject {

	constructor () {
		super();
	}

}

export interface IDisplayObject {
	name: string;
	position?: IPoint;
	anchor?: IPoint;
	angle?: number;
}

export interface IPoint {
	x: number;
	y: number;
}