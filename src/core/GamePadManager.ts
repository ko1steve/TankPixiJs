import { Singleton } from 'typescript-ioc';
import * as MiniSignal from 'mini-signals';

@Singleton
export class GamePadManager {

	protected static readonly SENSE_INTENSITY_STRONG: number = 0.9
	protected static readonly SENSE_INTENSITY_WEAK: number = 0.3

	public onButtonUpdateSignal: MiniSignal;
	public onAxesUpdateSignal: MiniSignal;

	protected buttonsState: Array<boolean>;
	protected axesState: Array<number>;

	constructor () {
		this.initButtonsState();
		this.initSignals();
	}

	protected initButtonsState (): void {
		this.buttonsState = new Array<boolean>( 16 );
		for ( let i: number = 0; i < this.buttonsState.length; i++ ) {
			this.buttonsState[ i ] = false;
		}
		this.axesState = new Array<number>( 4 );
		for ( let i: number = 0; i < this.axesState.length; i++ ) {
			this.axesState[ i ] = 0;
		}
	}

	protected initSignals (): void {
		this.onButtonUpdateSignal = new MiniSignal()
		this.onAxesUpdateSignal = new MiniSignal()
	}

	public updateGamePad ( gamepad: Gamepad ): void {
		this.updateButton( gamepad );
		this.updateAxes( gamepad );
	}

	protected updateButton ( gamepad: Gamepad ): void {
		const buttons: Array<IGamePadButtonState> = new Array<IGamePadButtonState>();
		const buttonKeys = Object.values( GamePadButtonKey );
		this.buttonsState.forEach( ( state, i ) => {
			buttons.push( {
				key: buttonKeys[ i ],
				isPress: gamepad.buttons[ i ].pressed,
				isTouch: gamepad.buttons[ i ].pressed && !state
			} )
			this.buttonsState[ i ] = gamepad.buttons[ i ].pressed;
		} );
		const data: IGamePadButtonEventData = { buttons };
		this.onButtonUpdateSignal.dispatch( data );
	}

	protected updateAxes ( gamepad: Gamepad ): void {
		const axes: Array<IGamePadAxesState> = new Array<IGamePadAxesState>();
		const axesKeys = Object.values( GamePadAxesKey );
		this.axesState.forEach( ( intensity, i ) => {
			if ( this.isAxesStrongInput( gamepad.axes[ i ] ) ) {
				axes.push( {
					key: axesKeys[ i ],
					isPositive: gamepad.axes[ i ] > 0,
					intensity: GamePadAxesIntensity.STRONG,
					isTouch: intensity < GamePadManager.SENSE_INTENSITY_WEAK && intensity > -GamePadManager.SENSE_INTENSITY_WEAK
				} )
			} else if ( this.isAxesWeakInput( gamepad.axes[ i ] ) ) {
				axes.push( {
					key: axesKeys[ i ],
					isPositive: gamepad.axes[ i ] > 0,
					intensity: GamePadAxesIntensity.WEAK,
					isTouch: intensity < GamePadManager.SENSE_INTENSITY_WEAK && intensity > -GamePadManager.SENSE_INTENSITY_WEAK
				} )
			}
			this.axesState[ i ] = gamepad.axes[ i ];
		} );
		if ( axes.length === 0 ) {
			return;
		}
		const data: IGamePadAxesEventData = { axes };
		this.onAxesUpdateSignal.dispatch( data );
	}

	protected isAxesStrongInput ( intensity: number ): boolean {
		return intensity >= GamePadManager.SENSE_INTENSITY_STRONG || intensity <= -GamePadManager.SENSE_INTENSITY_STRONG;
	}

	protected isAxesWeakInput ( intensity: number ): boolean {
		return intensity >= GamePadManager.SENSE_INTENSITY_WEAK || intensity <= -GamePadManager.SENSE_INTENSITY_WEAK;
	}
}

export interface IGamePadButtonEventData {
	buttons: Array<IGamePadButtonState>;
}

export interface IGamePadAxesEventData {
	axes: Array<IGamePadAxesState>;
}

export interface IGamePadButtonState {
	key: string;
	isPress: boolean;
	isTouch: boolean;
}

export interface IGamePadAxesState {
	key: string;
	isPositive: boolean;
	intensity: string;
	isTouch: boolean;
}

export enum GamePadButtonKey {
	PAD_A = 'PAD_A',
	PAD_B = 'PAD_B',
	PAD_X = 'PAD_X',
	PAD_Y = 'PAD_Y',
	PAD_LB = 'PAD_LB',
	PAD_RB = 'PAD_RB',
	PAD_LT = 'PAD_LT',
	PAD_RT = 'PAD_RT',
	PAD_BACK = 'PAD_BACK',
	PAD_START = 'PAD_START',
	PAD_LS = 'PAD_LS',
	PAD_RS = 'PAD_RS',
	PAD_UP = 'PAD_UP',
	PAD_DOWN = 'PAD_DOWN',
	PAD_LEFT = 'PAD_LEFT',
	PAD_RIGHT = 'PAD_RIGHT',
	PAD_HOME = 'PAD_HOME'
}

export enum GamePadAxesKey {
	AXES_LX = 'AXES_LX',
	AXES_LY = 'AXES_LY',
	AXES_RX = 'AXES_RX',
	AXES_RY = 'AXES_RY'
}

export enum GamePadAxesIntensity {
	STRONG = 'STRONG',
	WEAK = 'WEAK',
}