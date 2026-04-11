import { Exercise } from "@features/exercise/exercise";

export class WorkoutExercise
{
    repetitions: number | null = null;
    lengthSeconds: number | null = null;
    preCounterSeconds: number = 5;
    exerciseId: string = "";
    exercise: Exercise = null!;
    order: number = 0;
}