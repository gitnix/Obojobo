require('../viewer_events')

jest.mock('../viewer/viewer_state', () => ({ set: jest.fn() }))
let vs = oboRequire('viewer/viewer_state')

let oboEvents = oboRequire('obo_events')

let mockEvent = { userId: 1, draftId: 2 }

describe('viewer events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetAllMocks()
	})
	afterEach(() => {})

	//@TODO: Unskip when nav:lock is being stored
	test.skip('client:nav:lock', () => {
		oboEvents.emit(`client:nav:lock`, mockEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isLocked', 1, true)
	})

	//@TODO: Unskip when nav:lock is being stored
	test.skip('client:nav:unlock', () => {
		oboEvents.emit(`client:nav:unlock`, mockEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isLocked', 1, false)
	})

	test('client:nav:open', () => {
		oboEvents.emit(`client:nav:open`, mockEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isOpen', 1, true)
	})

	test('client:nav:close', () => {
		let vs = oboRequire('viewer/viewer_state')
		oboEvents.emit(`client:nav:close`, mockEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isOpen', 1, false)
	})

	test('client:nav:toggle', () => {
		let toggleEvent = Object.assign({}, mockEvent, { payload: { open: true } })
		oboEvents.emit(`client:nav:toggle`, toggleEvent)
		expect(vs.set).toBeCalledWith(1, 2, 'nav:isOpen', 1, true)
	})
})