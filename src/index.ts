import { Application,
         Container,
         Texture,
         Sprite } from 'pixi.js';
import key_manager from './managers/key_manager';

const app = new Application( {
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1
} );

document.body.appendChild( app.view );

const container = new Container();

app.stage.addChild( container );

const texture = Texture.from( './assets/bunny.png' );

const bunny = new Sprite( texture );
bunny.anchor.set( 0.5 );
container.addChild( bunny );

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

const PLAYER_SPEED = 1;

const on_key_up = ( key: KeyboardEvent ) => {
    key_manager.pop_key( key.key );
}

const on_key_down = ( key: KeyboardEvent ) => {
    key_manager.add_key( key.key );
}

app.ticker.add( delta => {
    key_manager.forEach( key => {
        switch( key )
        {
            case 'ArrowRight':
                bunny.x += PLAYER_SPEED*delta;
                break;
            case 'ArrowLeft':
                bunny.x -= PLAYER_SPEED*delta;
                break;
            case 'ArrowDown':
                bunny.y += PLAYER_SPEED*delta;
                break;
            case 'ArrowUp':
                bunny.y -= PLAYER_SPEED*delta;
                break;
        }
    } );
} );

window.addEventListener( 'keydown', on_key_down );
window.addEventListener( 'keyup', on_key_up );
