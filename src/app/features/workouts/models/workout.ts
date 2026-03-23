import { Exercise } from "@features/exercise/exercise";
export class Workout {
    id: string = "";
    title?: string;
    description?: string;
    exercises?: Exercise[];
}

