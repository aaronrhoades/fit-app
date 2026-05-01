import { toObservable } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, fromEvent, pipe, startWith, switchMap, tap } from 'rxjs';

export const WakeLockStore = signalStore(
    { providedIn: 'root' },
    withState({ isWakeLockActive: false, errors: [] as string[] }),
    withMethods((store) => {
        let sentinel: WakeLockSentinel | null = null;

        // Logic to actually talk to the Browser API
        const manageLock = async (isActive: boolean) => {
            // Safety check for SSR or older browsers
            if (!('wakeLock' in navigator)) return;

            const isVisible = document.visibilityState === 'visible';
            if (!document.hasFocus() && !isVisible) return;

            if (isActive && isVisible && !sentinel) {
                // Give the browser 100ms to "settle" after coming back from background
                await new Promise(resolve => setTimeout(resolve, 100));

                try {
                    sentinel = await navigator.wakeLock.request('screen');
                    // If the system releases the lock, let our store know
                    sentinel.onrelease = () => {
                        sentinel = null;
                    };
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        patchState(store, { errors: [err.message, 'Failed to acquire wake lock'] });
                    } else {
                        patchState(store, { errors: ['Failed to acquire wake lock'] });
                    }
                }
            } else if ((!isActive || !isVisible) && sentinel) {
                await sentinel.release();
                sentinel = null;
            }
        };

        return {
            // Method for components to call
            setWakeLock: (value: boolean) => patchState(store, { isWakeLockActive: value }),

            // Reactive Effect: Watches state OR visibility changes
            syncLock: rxMethod<void>(
                pipe(
                    switchMap(() =>
                        combineLatest([
                            toObservable(store.isWakeLockActive),
                            fromEvent(document, 'visibilitychange').pipe(startWith(null))
                        ])
                    ),
                    tap(([isActive]) => manageLock(isActive))
                )
            ),
        };
    }),
    withHooks({
        onInit(store) {
            // Start the "watchdog" immediately
            store.syncLock();
        },
    })
);