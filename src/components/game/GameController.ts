import { Inject } from 'typescript-ioc';
import { GameView } from 'src/components/game/GameView';
import { IKeyboardDownEventData, IKeyboardPressEventData, KeyboardButton, KeyboardManager } from 'src/core/KeyboardManager';
import { Controller } from 'src/ui/Controller';
import { GameConfig, IGameConfig } from 'src/components/game/GameConfig';
import { MoveDirection } from 'src/components/game/elements/Tank';
import { GamePadAxesIntensity, GamePadAxesKey, GamePadButtonKey, GamePadManager, IGamePadAxesEventData, IGamePadButtonEventData } from 'src/core/GamePadManager';

export class GameController extends Controller {

	@Inject
	protected keyboardManager: KeyboardManager;

	@Inject
	protected gamePadManager: GamePadManager;

	protected config: IGameConfig;
	protected view: GameView;

	protected init (): void {
		this.config = new GameConfig();
		this.view = new GameView( this.config );
		this.addListeners();
	}

	protected addListeners (): void {
		this.keyboardManager.onKeyDownSignal.add( this.onKeyDown, this );
		this.keyboardManager.onKeyPressSignal.add( this.onKeyPress, this );
		this.keyboardManager.onKeyUpSignal.add( this.onKeyUp, this );
		this.gamePadManager.onButtonUpdateSignal.add( this.onGamePadButtonUpdate, this );
		this.gamePadManager.onAxesUpdateSignal.add( this.onGamePadAxesUpdate, this );
	}

	protected onKeyDown ( data: IKeyboardDownEventData ): void {
		switch ( data.code ) {
			case KeyboardButton.SPACE:
				this.view.shoot();
				break;
		}
	}

	protected onKeyUp ( data: IKeyboardDownEventData ): void {
		//
	}

	protected onKeyPress ( data: IKeyboardPressEventData ): void {
		for ( let i: number = 0; i < data.buttons.length; i++ ) {
			const code: string = data.buttons[ i ].code;
			if ( code === KeyboardButton.ARROW_UP ) {
				this.view.moveTank( MoveDirection.UP, this.config.tank.moveSpeeds[ 1 ] );
				break;
			} else if ( code === KeyboardButton.ARROW_DOWN ) {
				this.view.moveTank( MoveDirection.DOWN, this.config.tank.moveSpeeds[ 1 ] );
				break;
			} else if ( code === KeyboardButton.ARROW_LEFT ) {
				this.view.moveTank( MoveDirection.LEFT, this.config.tank.moveSpeeds[ 1 ] );
				break;
			} else if ( code === KeyboardButton.ARROW_RIGHT ) {
				this.view.moveTank( MoveDirection.RIGHT, this.config.tank.moveSpeeds[ 1 ] );
				break;
			}
		}
	}

	protected onGamePadButtonUpdate ( data: IGamePadButtonEventData ): void {
		data.buttons.forEach( button => {
			switch ( button.key ) {
				case GamePadButtonKey.PAD_UP:
					if ( button.isPress ) {
						this.view.moveTank( MoveDirection.UP, this.config.tank.moveSpeeds[ 1 ] );
					}
					break;
				case GamePadButtonKey.PAD_DOWN:
					if ( button.isPress ) {
						this.view.moveTank( MoveDirection.DOWN, this.config.tank.moveSpeeds[ 1 ] );
					}
					break;
				case GamePadButtonKey.PAD_LEFT:
					if ( button.isPress ) {
						this.view.moveTank( MoveDirection.LEFT, this.config.tank.moveSpeeds[ 1 ] );
					}
					break;
				case GamePadButtonKey.PAD_RIGHT:
					if ( button.isPress ) {
						this.view.moveTank( MoveDirection.RIGHT, this.config.tank.moveSpeeds[ 1 ] );
					}
					break;
				case GamePadButtonKey.PAD_A:
					if ( button.isTouch ) {
						this.view.shoot();
					}
					break;
			}
		} );
	}

	protected onGamePadAxesUpdate ( data: IGamePadAxesEventData ): void {
		let speedIndex: number;
		let speed: number;
		data.axes.forEach( axes => {
			switch ( axes.key ) {
				case GamePadAxesKey.AXES_LX:
					speedIndex = axes.intensity === GamePadAxesIntensity.WEAK ? 0 : 1;
					speed = this.config.tank.moveSpeeds[ speedIndex ];
					if ( axes.isPositive ) {
						this.view.moveTank( MoveDirection.RIGHT, speed );
					} else {
						this.view.moveTank( MoveDirection.LEFT, speed );
					}
					break;
				case GamePadAxesKey.AXES_LY:
					speedIndex = axes.intensity === GamePadAxesIntensity.WEAK ? 0 : 1;
					speed = this.config.tank.moveSpeeds[ speedIndex ];
					if ( axes.isPositive ) {
						this.view.moveTank( MoveDirection.UP, speed );
					} else {
						this.view.moveTank( MoveDirection.DOWN, speed );
					}
					break;
			}
		} );
	}

	public updateFrame (): void {
		this.view.updateFrame();
	}
}