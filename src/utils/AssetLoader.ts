import * as MiniSignal from 'mini-signals';
import { IAsset } from 'src/config/AssetList';

export class AssetLoader {

	protected loader: PIXI.Loader;
	public onCompleteSignal: MiniSignal = new MiniSignal();

	constructor () {
		this.createLoader();
	}

	protected createLoader (): void {
		this.loader = new PIXI.Loader();
	}

	public loadResource ( list: Array<IAsset> ): void {
		list.forEach( asset => {
			this.loader.add( asset.assetKey, asset.assetUrl );
		} );
		this.loader.onComplete.add( () => {
			this.onCompleteUpload( this.loader.resources );
		} );
		this.loader.load();
	}

	protected onCompleteUpload ( res: PIXI.IResourceDictionary ): void {
		this.onCompleteSignal.dispatch( { res } );
	}
}