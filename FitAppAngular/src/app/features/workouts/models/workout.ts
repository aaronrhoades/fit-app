import { WorkoutExercise } from "./workoutExercise";

export class Workout {
    id: string = "";
    title?: string;
    description?: string;
    imageUrl?: string;
    workoutExercises?: WorkoutExercise[];
}