/// <reference path='./index.d.ts'/>

requestAnimationFrame(() => {
    Promise.all([
        import('./atoms/Router'),
        import('./atoms/Feed')
    ]).then((...args) => {
        console.log(...args);
    })
});
