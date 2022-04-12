import { ISprite, Sprite } from 'src/elements/Sprite';

export class Tank extends Sprite {

	protected config: ITank;

}

export interface ITank extends ISprite {
	moveSpeeds: Array<number>;
}

export enum MoveDirection {
	RIGHT = 0,
	DOWN = 1,
	LEFT = 2,
	UP = 3
}