export class User {

    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) { }

    get token() { return this._token }
    get tokenExpirationDate() { return this._tokenExpirationDate }
}