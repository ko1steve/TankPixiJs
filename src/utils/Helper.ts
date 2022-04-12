export class Helper {

	public static randomInt ( start: number = 0, range: number ): number {
		if ( !Number.isInteger( start ) ) {
			console.error( 'Number \'start\' isn\'t the integer' );
			return undefined;
		}
		return Math.floor( Math.random() * range + start );
	}

}