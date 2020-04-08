export async function wait(duration = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}