import FocusStore from '../../../src/scripts/common/stores/focus-store'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('FocusStore', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.useFakeTimers()

		FocusStore.init()
		FocusStore.triggerChange = jest.fn()
	})

	test('should init state with a specific structure and return it', () => {
		expect(FocusStore.getState()).toEqual({
			focussedId: null,
			viewState: 'inactive'
		})
	})

	test('focus will update state, trigger change', () => {
		FocusStore._focus('testId')

		expect(FocusStore.getState()).toEqual({
			focussedId: 'testId',
			viewState: 'enter'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		jest.runAllTimers()

		expect(FocusStore.getState()).toEqual({
			focussedId: 'testId',
			viewState: 'active'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(2)
	})

	test('unfocus will update state, trigger change', () => {
		FocusStore.setState({
			focussedId: 'testId',
			viewState: 'active'
		})

		FocusStore._unfocus()

		expect(FocusStore.getState()).toEqual({
			focussedId: 'testId',
			viewState: 'leave'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(1)

		jest.runAllTimers()

		expect(FocusStore.getState()).toEqual({
			focussedId: null,
			viewState: 'inactive'
		})
		expect(FocusStore.triggerChange).toHaveBeenCalledTimes(2)
	})
})
