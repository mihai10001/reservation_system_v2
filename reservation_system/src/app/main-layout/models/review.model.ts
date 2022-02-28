export class Review {

    constructor(
        public id: string,
        public placeId: string,
        public title: string,
        public description: string,
        public rating: number,
    ) { }
}