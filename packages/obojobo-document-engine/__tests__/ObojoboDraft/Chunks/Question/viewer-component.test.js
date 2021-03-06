import React from 'react'
import renderer from 'react-test-renderer'

import Question from '../../../../ObojoboDraft/Chunks/Question/viewer-component'
import FocusStore from '../../../../src/scripts/common/stores/focus-store'
import FocusUtil from '../../../../src/scripts/common/util/focus-util'
import QuestionStore from '../../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../../src/scripts/viewer/stores/nav-store'
import AssessmentStore from '../../../../src/scripts/viewer/stores/assessment-store'
import QuestionUtil from '../../../../src/scripts/viewer/util/question-util'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../../src/scripts/viewer/util/api-util'

describe('MCAssessment', () => {
	_.shuffle = a => a

	OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.Question',
		content: {
			title: 'Title',
			solution: {
				id: 'page-id',
				type: 'ObojoboDraft.Pages.Page',
				children: [
					{
						id: 'text-id',
						type: 'ObojoboDraft.Chunks.Text',
						content: {
							textGroup: [
								{
									text: {
										value: 'Example text'
									}
								}
							]
						}
					}
				]
			}
		},
		children: [
			{
				id: 'mc-assessment-id',
				type: 'ObojoboDraft.Chunks.MCAssessment',
				content: {
					correctLabels: 'test'
				},
				children: [
					{
						id: 'choice1',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 100
						},
						children: [
							{
								id: 'choice1-answer1',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-1-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text'
													}
												}
											]
										}
									}
								]
							},
							{
								id: 'choice1-answer2',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-2-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 2'
													}
												}
											]
										}
									}
								]
							}
						]
					},
					{
						id: 'choice2',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 0
						},
						children: [
							{
								id: 'choice2-answer1',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-1-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 3'
													}
												}
											]
										}
									}
								]
							},
							{
								id: 'choice2-answer2',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-1-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 4'
													}
												}
											]
										}
									}
								]
							}
						]
					}
				]
			}
		]
	})

	let model = OboModel.models.id

	let getModuleData = () => {
		QuestionStore.init()
		AssessmentStore.init()
		FocusStore.init()
		NavStore.setState({
			itemsById: {}
		})

		return {
			focusState: FocusStore.getState(),
			questionState: QuestionStore.getState(),
			assessmentState: AssessmentStore.getState(),
			navState: NavStore.getState()
		}
	}

	test('Question component', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question with response', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		APIUtil.postEvent = jest.fn()
		QuestionUtil.setResponse('id', { ids: ['choice1'] })
		const component2 = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('Question with revealAll', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.setData('id', 'revealAll', true)
		const component2 = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('Question with a set score', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.setScore('id', 100)
		const component2 = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('Question view question', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.viewQuestion('id')
		const component2 = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('Question view & focus question', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.viewQuestion('id')
		FocusUtil.focusComponent('id')
		const component2 = renderer.create(<Question model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})
})
