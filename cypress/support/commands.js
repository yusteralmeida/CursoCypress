// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Obrigatório
import loc from "./locators"

// Comandos do cypress. 

// Testes Funcionais
Cypress.Commands.add('login', (user, password) => {
    cy.visit("https://barrigareact.wcaquino.me/")
    cy.get(loc.LOGIN.USER).type(user)
    cy.get(loc.LOGIN.PASSWORD).type(password)
    cy.get(loc.LOGIN.BTN_LOGIN).click()
    cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('clickAlert', (locator, message) => {

    cy.get(locator).click()
    cy.on('window:alert', msg => {
        expect(msg).to.be.equal(message)
    })

})

Cypress.Commands.add('resetApp', () => {
    cy.get(loc.MENU.SETTIGNS).click()
    cy.get(loc.MENU.RESET).click()
})

// Testes Backend
Cypress.Commands.add('getToken', (user, password) => {
    // Pegar o token
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            senha: password,
            redirecionar: false
        }
    })
        .its('body.token')
        .should('not.be.empty')
        .then(token => {
            Cypress.env('token', token)
            return token
        })
})
// Reseta a aplicação
Cypress.Commands.add('resetRest', (token) => {
    cy.request({
        method: 'GET',
        url: '/reset',
        headers: { Authorization: `JWT ${token}` }
    }).its('status').should('be.equal', 200)
})

Cypress.Commands.add('getContaByName', (token, name) => {

    cy.request({
        method: 'GET',
        url: '/contas',
        headers: { Authorization: `JWT ${token}` },
        // Coloca o valor de nome, que é "Conta para alterar", na baseUrl 
        qs: {
            nome: name
        }

    }).then(res => {
        return res.body[0].id
    })

})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if (options.length === 1) {
        if (Cypress.env('token')) {
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }
    return originalFn(...options)
})

