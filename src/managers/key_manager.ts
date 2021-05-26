export default {
    _keys: Array<string>(),

    add_key( key: string ) {
        switch( key )
        {
            case 'ArrowRight':
            case 'ArrowLeft':
            case 'ArrowDown':
            case 'ArrowUp':
                if( this._keys.indexOf( key ) === -1 )
                {
                    this._keys.push( key );
                }
                break;
        }
    },
    pop_key( key: string ) {
        this._keys = this._keys.filter( val => val != key );
    },
    forEach( cb: ( key: string ) => void ) {
        this._keys.forEach( cb );
    }
}