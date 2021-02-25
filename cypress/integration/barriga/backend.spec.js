///<reference types = "cypress"/>

describe('Work with alert', () => {
    let token

    before(() => {

        cy.getToken('yusteralmeida@gmail.com', '99063943')
            .then(tkn => {
                token = tkn
            })

    })

    beforeEach(() => {
        // Reseta a aplicação
        cy.resetRest(token)
    })

    it('Should create an account', () => {

        cy.request({
            url: '/contas',
            method: 'POST',
            // headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta via rest'
            }

        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })

    })

    it('Should update an account', () => {

        cy.getContaByName(token, 'Conta para alterar')
            .then(contaId => {
                // console.log(res)
                cy.request({
                    url: `/contas/${contaId}`,
                    method: 'PUT', // Para alterar
                    // headers: { Authorization: `JWT ${token}` },
                    body: {
                        nome: 'Conta yuster'
                    }
                }).as('response')

            })

        cy.get('@response').its('status').should('be.equal', 200)

    })

    it('Should not create an account with same name', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            // headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta mesmo nome'
            },
            // Para dizer que estamos esperando uma falha. Isso é pq o status code pode ser 400 ou 500
            failOnStatusCode: false

        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body).to.have.property('error')
            expect(res.body.error).to.have.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Should create a transaction', () => {
        cy.getContaByName(token, 'Conta para movimentacoes')
            .then(contaId => {

                cy.request({
                    method: 'POST',
                    url: '/transacoes',
                    // headers: { Authorization: `JWT ${token}` },
                    body: {
                        conta_id: contaId,
                        data_pagamento: Cypress.moment().add({ days: 1 }).format('DD/MM/YYYY'),//  data com um dia a mais
                        data_transacao: Cypress.moment().format('DD/MM/YYYY'),// data atual em javascript
                        descricao: "descricao",
                        envolvido: "ninguem",
                        status: true,
                        tipo: "REC",
                        valor: "10000"
                    },

                }).as('response')
            })

        cy.get('@response').its('status').should('be.to.equal', 201)
        cy.get('@response').its('body.id').should('exist')


    })

    it.skip('Should get balance', () => {
        cy.request({
            url: '/saldo',
            method: 'GET',
            // headers: { Authorization: `JWT ${token}` },

        }).then(res => {
            let saldoConta = null

            res.body.forEach(c => {
                // console.log(c)
                if (c.conta === 'Conta para saldo') {
                    saldoConta = c.saldo
                }
            })

            expect(saldoConta).to.be.equal("534.00")
        })

        // Buscar movimentação 
        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}` },
            qs: { descricao: "Movimentacao 1, calculo saldo" }

        }).then(res => {
            // Verificar alteração no valor 
            cy.request({
                method: 'PUT',
                url: `/transacoes/:${res.body[0].id}`,
                // headers: { Authorization: `JWT ${token}` },
                body: {
                    status: true,
                    data_transacao: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id

                }

            }).its('status').should('be.equal', 200)

        })

        cy.request({
            url: '/saldo',
            method: 'GET',
            // headers: { Authorization: `JWT ${token}` },

        }).then(res => {
            let saldoConta = null

            res.body.forEach(c => {
                // console.log(c)
                if (c.conta === 'Conta para saldo') {
                    saldoConta = c.saldo
                }
            })

            expect(saldoConta).to.be.equal("4034.00")
        })

    })

    it('Should remove transaction', () => {
        // Buscar movimentação 
        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}` },
            qs: { descricao: "Movimentacao para exclusao" }

        }).then(res => {
            // Deletar movimentação
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'DELETE',
                // headers: { Authorization: `JWT ${token}` },
            }).its('status').should('be.equal', 204)

        })
    })
})