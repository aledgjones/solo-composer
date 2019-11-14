export function Timer(label: string) {
    let start = performance.now();
    return {
        stop: () => {
            const now = performance.now();
            const time = now - start;
            let color = 'red';
            if (time < 1000 / 30) {
                color = 'orange';
            }
            if (time < 1000 / 60) {
                color = 'green';
            }
            console.log(`${label} %c${time}`, `color: ${color}`);
        }
    }
}