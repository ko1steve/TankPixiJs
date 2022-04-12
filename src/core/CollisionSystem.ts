import { Sprite } from 'src/elements/Sprite';


export class CollisionSystem {

	public static isCollide ( objectA: Sprite, objectB: Sprite, offset?: number, direction?: CollisionDirection ): boolean {
		if ( !direction ) {
			return this.isCollideUp( objectA, objectB, offset )
				|| this.isCollideDown( objectA, objectB, offset )
				|| this.isCollideLeft( objectA, objectB, offset )
				|| this.isCollideRight( objectA, objectB, offset )
		}
		switch ( direction ) {
			case CollisionDirection.UP:
				return this.isCollideUp( objectA, objectB, offset );
			case CollisionDirection.DOWN:
				return this.isCollideDown( objectA, objectB, offset )
			case CollisionDirection.LEFT:
				return this.isCollideLeft( objectA, objectB, offset )
			case CollisionDirection.RIGHT:
				return this.isCollideRight( objectA, objectB, offset )
		}
	}

	protected static isCollideUp ( objectA: Sprite, objectB: Sprite, offset: number = 0 ): boolean {
		const isHit: boolean = objectA.getGlobalPosition().y + ( 1 - objectA.anchor.y ) * objectA.height + offset >= objectB.getGlobalPosition().y - objectB.anchor.y * objectB.height
			&& objectA.getGlobalPosition().y <= objectB.getGlobalPosition().y
			&& ( objectA.getGlobalPosition().x + ( 1 - objectA.anchor.x ) * objectA.width >= objectB.getGlobalPosition().x - objectB.anchor.x * objectB.width && objectA.getGlobalPosition().x - objectA.anchor.x * objectA.width <= objectB.getGlobalPosition().x + ( 1 - objectB.anchor.x ) * objectB.width )
		return isHit;
	}

	protected static isCollideDown ( objectA: Sprite, objectB: Sprite, offset: number = 0 ): boolean {
		const isHit: boolean = objectA.getGlobalPosition().y - objectA.anchor.y * objectA.height - offset <= objectB.getGlobalPosition().y + ( 1 - objectB.anchor.y ) * objectB.height
			&& objectA.getGlobalPosition().y >= objectB.getGlobalPosition().y
			&& ( objectA.getGlobalPosition().x + ( 1 - objectA.anchor.x ) * objectA.width >= objectB.getGlobalPosition().x - objectB.anchor.x * objectB.width && objectA.getGlobalPosition().x - objectA.anchor.x * objectA.width <= objectB.getGlobalPosition().x + ( 1 - objectB.anchor.x ) * objectB.width )
		return isHit;
	}

	protected static isCollideLeft ( objectA: Sprite, objectB: Sprite, offset: number = 0 ): boolean {
		const isHit: boolean = objectA.getGlobalPosition().x + ( 1 - objectA.anchor.x ) * objectA.width + offset >= objectB.getGlobalPosition().x - objectB.anchor.x * objectB.width
			&& objectA.getGlobalPosition().x <= objectB.getGlobalPosition().x
			&& ( objectA.getGlobalPosition().y + ( 1 - objectA.anchor.y ) * objectA.height >= objectB.getGlobalPosition().y - objectB.anchor.y * objectB.height && objectA.getGlobalPosition().y - objectA.anchor.y * objectA.height <= objectB.getGlobalPosition().y + ( 1 - objectB.anchor.y ) * objectB.height )
		return isHit;
	}

	protected static isCollideRight ( objectA: Sprite, objectB: Sprite, offset: number = 0 ): boolean {
		const isHit: boolean = objectA.getGlobalPosition().x - objectA.anchor.x * objectA.width - offset <= objectB.getGlobalPosition().x + ( 1 - objectB.anchor.x ) * objectB.width
			&& objectA.getGlobalPosition().x >= objectB.getGlobalPosition().x
			&& ( objectA.getGlobalPosition().y + ( 1 - objectA.anchor.y ) * objectA.height >= objectB.getGlobalPosition().y - objectB.anchor.y * objectB.height && objectA.getGlobalPosition().y - objectA.anchor.y * objectA.height <= objectB.getGlobalPosition().y + ( 1 - objectB.anchor.y ) * objectB.height )
		return isHit;
	}

}

export enum CollisionDirection {
	UP = 'UP',
	DOWN = 'DOWN',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT'
}