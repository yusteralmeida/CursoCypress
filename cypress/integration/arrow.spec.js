
it('Nada agora', function () { })

// function soma(a, b) {
// return a + b
// }
const soma = function (a, b) {
    return a + b
}

console.log(soma(1, 4))

it('a function test...', function () {
    console.log('Function', this)
})

it('an arrow test...', () => {
    console.log('Arrow', this)
})