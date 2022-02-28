import { OpenDays } from './openDays.model';

export class Place {

    constructor(
        public id: string,
        public title: string,
        public description: string,
        public schedule: string,
        public imageUrl: string,
        public openDays: OpenDays,
        public defaultTableSize: number,
        public availableGridRows: number,
        public availableGridCols: number,
        public availableSeats: [],
    ) { }
}
