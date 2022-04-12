export class MainConfig implements IMainConfig {
	public title: string = 'Pixi Js';
	public width = 1280;
	public height = 720;
	public backgroundColor = 0x000000;
	public view = document.querySelector( '#scene' );
}


export interface IMainConfig {
	title: string;
	width: number;
	height: number;
	backgroundColor: number;
	view: any;
}