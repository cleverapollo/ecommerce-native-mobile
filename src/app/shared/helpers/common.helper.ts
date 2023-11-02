// Immediately Invoked Function Expression
export const iife = (func: Promise<void>): void => {
    (async () => {
        await func;
    })();
}
