export class Booking {

    constructor(
        public id: string,
        public name: string,
        public userId: string,
        public dateISONoTime: string,
        public placeId: string,
        public reservedSeats: [],
    ) { }
}

export class BookingViewDTO {

    constructor(
        public id: string,
        public name: string,
        public dateISONoTime: string,
        public placeId: string,
        public placeTitle: string,
        public placeImage: string,
        public reservedSeats: [],
        public nrOfReservedSeats: number,
    ) { }
}
