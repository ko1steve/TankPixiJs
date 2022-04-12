import { Singleton } from 'typescript-ioc';

@Singleton
export class Viewport {

	public width: number = 0;

	public height: number = 0;
}