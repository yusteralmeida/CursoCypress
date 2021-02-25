///<reference types = "cypress"/>

import loc from "../../support/locators"
import "../../support/commandsContas"
import buildEnv from "../../support/buildEnv"

describe('Work with alert', () => {

    after(() => {
        cy.clearLocalStorage()
    })

    beforeEach(() => {
        buildEnv()
        cy.login('yusteralmeida@gmail.com', '99063943')
        cy.get(loc.MENU.HOME).click()
        // cy.resetApp()
    })

    it('Should test the responsiveness', () => {
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.visible')

        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.not.visible')

        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.not.visible')

        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.visible')

    })
    
    it('Should create an account', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: "Conta de teste", visivel: true, usuario_id: 1 }
        }).as('saveConta')

        // Método do arquivo commandsConta.js, da pasta support
        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: "Carteira", visivel: true, usuario_id: 1 },
                { id: 2, nome: "Banco", visivel: true, usuario_id: 1 },
                { id: 3, nome: "Conta de teste", visivel: true, usuario_id: 1 },]
        }).as('contasSave')

        cy.inserirConta('Conta teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should update an account', () => {

        cy.route({
            method: 'PUT',
            url: '/contas/**',// ** Pega qualquer id 
            response: [
                { id: 3, nome: "Conta alterada", visivel: true, usuario_id: 1 }]
        }).as('inclusaoConta')

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_BTN_XPATH_ALTERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should not create an account with same name', () => {

        // O que a gente qr de resposta
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { error: "Já existe uma conta com esse nome!" },
            status: 400

        }).as('errorSaveConta')

        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'status code 400')
    })

    it('Should create a transaction', () => {

        cy.route({
            url: '/transacoes',
            method: 'POST',
            response: {
                id: 358753,
                descricao: "dsvvev",
                envolvido: "vewvevwevewvv",
                observacao: null,
                tipo: "REC",
                data_transacao: "2021-01-30T03:00:00.000Z",
                data_pagamento: "2021-01-30T03:00:00.000Z",
                valor: "100.00",
                status: true,
                conta_id: 392560,
                usuario_id: 5026,
                transferencia_id: null,
                parcelamento_id: null

            }
        })

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalvar'// <=  tem de ser tud junto sem espaço. Estar na pasta fixtures
        })

        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Descrição')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
    })

    it('Should get balance', () => {

        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 358749,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2021-01-30T03:00:00.000Z",
                "data_pagamento": "2021-01-30T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 392564,
                "usuario_id": 5026,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        }).as('obterMovimentacaoTest')

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 358749,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2021-01-30T03:00:00.000Z",
                "data_pagamento": "2021-01-30T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 392564,
                "usuario_id": 5026,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        }).as('alteracaoTest')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [
                { conta_id: 999, conta: "Carteira", saldo: "4034.00" },
                { conta_id: 9909, conta: "Banco", saldo: "1000000.00" },
            ]
        }).as('saldoTest')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '900,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')


    })

    it('Should remove transaction', () => {

        cy.route({
            url: '/transacoes/**',
            method: 'DELETE',
            response: {},
            status: 204
        }).as('delete')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    it('Should validate data send to create an account', () => {
        const reqStub = cy.stub()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: "Conta de teste", visivel: true, usuario_id: 1 },
            // Segunda forma
            // onRequest: req => {
            //     console.log(req)
            //     expect(req.request.body.nome).to.be.empty
            //     expect(req.request.headers).to.be.property('Authorization')
            // }
            onRequest: reqStub
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: "Carteira", visivel: true, usuario_id: 1 },
                { id: 2, nome: "Banco", visivel: true, usuario_id: 1 },
                { id: 3, nome: "Conta de teste", visivel: true, usuario_id: 1 },]
        }).as('contasSave')

        cy.inserirConta('{CONTROL}')
        // Primeira forma
        // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        // Terceira forma
        cy.wait('@saveConta').then(() => {
            console.log(reqStub.args[0][0].request.nome)// args é os argumentos dele 
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.be.property('Authorization')
        })

        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    // Falta implementar este teste 86-Verificar Layout
})