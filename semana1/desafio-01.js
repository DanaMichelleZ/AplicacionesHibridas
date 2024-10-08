// Parte 1
function task1(callback) {
    setTimeout(() => {
        console.log('Task 1 completeada');
        callback();
    }, 1000);
}

function task2(callback) {
    setTimeout(() => {
        console.log('Task 2 completeada');
        callback();
    }, 2000);
}

function task3(callback) {
    setTimeout(() => {
        console.log('Task 3 completeada');
        callback();
    }, 3000);
}

function mainCallback() {
    task1(() => {
        task2(() => {
            task3(() => {
                console.log('Todas las task completadas con callbacks');
            });
        });
    });
}

mainCallback();

// Parte 2
function task1Promise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Task 1 completeada');
            resolve();
        }, 1000);
    });
}

function task2Promise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Task 2 completeada');
            resolve();
        }, 2000);
    });
}

function task3Promise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Task 3 completeada');
            resolve();
        }, 3000);
    });
}

function mainPromise() {
    Promise.all([task1Promise(), task2Promise(), task3Promise()])
        .then(() => {
            console.log('Todas las task completadas con promesas');
        })
        .catch((error) => {
            console.error('Error, no funca', error);
        });
}

// mainPromise();

// Parte 3
async function mainAsync() {
    try {
        await task1Promise();
        await task2Promise();
        await task3Promise();
        console.log('Todas las task completadas con async/await');
    } catch (error) {
        console.error('Error, no funca', error);
    }
}

// mainAsync(); 
