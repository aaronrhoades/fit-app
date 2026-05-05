import { computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, fromEvent, pipe, startWith, switchMap, tap } from 'rxjs';

export const WakeLockStore = signalStore(
    { providedIn: 'root' },
    withState({ wakeLockReasons: {} as Record<string, boolean>, errors: [] as string[] }),
    withComputed(({ wakeLockReasons }) => ({
        isWakeLockActive: computed(() => Object.values(wakeLockReasons()).some(Boolean))
    })),
    withMethods((store) => {
        let sentinel: WakeLockSentinel | null = null;
        let isNativeLockActive = false;

        // Logic to actually talk to the Browser API or Native API
        const manageLock = async (isActive: boolean) => {
            const isVisible = document.visibilityState === 'visible';
            if (!document.hasFocus() && !isVisible) return;

            if (Capacitor.isNativePlatform()) {
                // Use Capacitor KeepAwake plugin for native
                if (isActive && isVisible && !isNativeLockActive) {
                    try {
                        await KeepAwake.keepAwake();
                        isNativeLockActive = true;
                    } catch (err: unknown) {
                        if (err instanceof Error) {
                            patchState(store, { errors: [err.message, 'Failed to acquire native wake lock'] });
                        } else {
                            patchState(store, { errors: ['Failed to acquire native wake lock'] });
                        }
                    }
                } else if ((!isActive || !isVisible) && isNativeLockActive) {
                    try {
                        await KeepAwake.allowSleep();
                        isNativeLockActive = false;
                    } catch (err: unknown) {
                        if (err instanceof Error) {
                            patchState(store, { errors: [err.message, 'Failed to release native wake lock'] });
                        } else {
                            patchState(store, { errors: ['Failed to release native wake lock'] });
                        }
                    }
                }
            } else {
                // Use browser WakeLock API for PWA/web
                if (!('wakeLock' in navigator)) return;

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
            }
        };

        return {
            // Method for components to call
            setWakeLock: (reason: string, active: boolean) => patchState(store, { wakeLockReasons: { ...store.wakeLockReasons(), [reason]: active } }),

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