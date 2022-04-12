import { Controller } from 'src/ui/Controller';
import { UIView } from 'src/components/ui/UIView';
import { IUIConfig, UIConfig } from 'src/components/ui/UIConfig';

export class UIController extends Controller {

	protected config: IUIConfig;
	protected view: UIView;

	protected init (): void {
		this.config = new UIConfig();
		this.view = new UIView( this.config );
	}
}