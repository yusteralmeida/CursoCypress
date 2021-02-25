/// <reference types='cypress'/>

describe('Work with basic elements', () => {
    before(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    beforeEach(() => {
        cy.reload()
    })
    it('using xpath', () => {
        cy.xpath("//input[contains(@onclick, 'Francisco')]")
        cy.xpath("//td[contains(., 'Usuario A')]/following-sibling::" +
            "td[contains(., 'Mestrado')]/..//input[@type='text']").type('merda!!!!')
    })
})