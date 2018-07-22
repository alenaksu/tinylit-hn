/// <reference path='./index.d.ts'/>

requestAnimationFrame(() => {
    Promise.all([
        import('./atoms/Router'),
        import('./atoms/Feed'),
        import('./atoms/NotFound'),
    ]).then((...args) => {
        console.log(...args);
    })
});
