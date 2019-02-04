import './viewer-component.scss'

import React from 'react'
import _ from 'underscore'

import { CSSTransition } from 'react-transition-group'

import Common from 'Common'
import Viewer from 'Viewer'
import isOrNot from '../../../src/scripts/common/isornot'

const { OboComponent } = Common.components
const { Button } = Common.components
const { OboModel } = Common.models
const { Dispatcher } = Common.flux
const { DOMUtil } = Common.page
// FocusUtil = Common.util.FocusUtil

const { QuestionUtil } = Viewer.util

const DEFAULT_CORRECT_PRACTICE_LABELS = ['Correct!', 'You got it!', 'Great job!', "That's right!"]
const DEFAULT_CORRECT_REVIEW_LABELS = ['Correct']
const DEFAULT_INCORRECT_LABELS = ['Incorrect']

export default class MCAssessment extends React.Component {
	constructor(props) {
		super(props)

		const { correctLabels, incorrectLabels } = this.props.model.modelState

		this.onClickShowExplanation = this.onClickShowExplanation.bind(this)
		this.onClickHideExplanation = this.onClickHideExplanation.bind(this)
		this.onClickSubmit = this.onClickSubmit.bind(this)
		this.onClickReset = this.onClickReset.bind(this)
		this.onClick = this.onClick.bind(this)
		this.onCheckAnswer = this.onCheckAnswer.bind(this)
		this.isShowingExplanation = this.isShowingExplanation.bind(this)
		if (correctLabels) {
			this.correctLabels = correctLabels
		} else {
			this.correctLabels =
				this.props.mode === 'review'
					? DEFAULT_CORRECT_REVIEW_LABELS
					: DEFAULT_CORRECT_PRACTICE_LABELS
		}
		this.incorrectLabels = incorrectLabels ? incorrectLabels : DEFAULT_INCORRECT_LABELS
		this.updateFeedbackLabels()
	}

	getQuestionModel() {
		return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question')
	}

	getResponseData() {
		const questionResponse = QuestionUtil.getResponse(
			this.props.moduleData.questionState,
			this.getQuestionModel(),
			this.props.moduleData.navState.context
		) || { ids: [] }

		const correct = new Set()
		const responses = new Set()
		let childId

		for (const child of Array.from(this.props.model.children.models)) {
			childId = child.get('id')

			if (child.modelState.score === 100) {
				correct.add(childId)
			}

			if (questionResponse.ids.indexOf(childId) !== -1) {
				responses.add(childId)
			}
		}

		return {
			correct,
			responses
		}
	}

	calculateScore() {
		const responseData = this.getResponseData()
		const { correct } = responseData
		const { responses } = responseData

		switch (this.props.model.modelState.responseType) {
			case 'pick-all': {
				if (correct.size !== responses.size) {
					return 0
				}
				let score = 100
				correct.forEach(function(id) {
					if (!responses.has(id)) {
						return (score = 0)
					}
				})
				return score
			}

			default:
				// pick-one | pick-one-multiple-correct
				for (const id of Array.from(Array.from(correct))) {
					if (responses.has(id)) {
						return 100
					}
				}

				return 0
		}
	}

	isShowingExplanation() {
		return QuestionUtil.isShowingExplanation(
			this.props.moduleData.questionState,
			this.getQuestionModel()
		)
	}

	retry() {
		QuestionUtil.retryQuestion(
			this.getQuestionModel().get('id'),
			this.props.moduleData.navState.context
		)
	}

	hideExplanation() {
		QuestionUtil.hideExplanation(this.getQuestionModel().get('id'), 'user')
	}

	onClickReset(event) {
		event.preventDefault()

		this.retry()
	}

	onClickSubmit(event) {
		event.preventDefault()

		QuestionUtil.setScore(
			this.getQuestionModel().get('id'),
			this.calculateScore(),
			this.props.moduleData.navState.context
		)
		// ScoreUtil.setScore(this.getQuestionModel().get('id'), this.calculateScore())
		this.updateFeedbackLabels()
		QuestionUtil.checkAnswer(this.getQuestionModel().get('id'))
	}

	onClickShowExplanation(event) {
		event.preventDefault()

		QuestionUtil.showExplanation(this.getQuestionModel().get('id'))
	}

	onClickHideExplanation(event) {
		event.preventDefault()

		this.hideExplanation()
	}

	onClick(event) {
		let response
		const questionModel = this.getQuestionModel()
		const mcChoiceEl = DOMUtil.findParentWithAttr(
			event.target,
			'data-type',
			'ObojoboDraft.Chunks.MCAssessment.MCChoice'
		)
		if (!mcChoiceEl) {
			return
		}

		const mcChoiceId = mcChoiceEl.getAttribute('data-id')
		if (!mcChoiceId) {
			return
		}

		if (this.getScore() !== null) {
			this.retry()
		}

		switch (this.props.model.modelState.responseType) {
			case 'pick-all': {
				response = QuestionUtil.getResponse(
					this.props.moduleData.questionState,
					questionModel,
					this.props.moduleData.navState.context
				) || {
					ids: []
				}
				const responseIndex = response.ids.indexOf(mcChoiceId)

				if (responseIndex === -1) {
					response.ids.push(mcChoiceId)
				} else {
					response.ids.splice(responseIndex, 1)
				}
				break
			}

			default:
				response = {
					ids: [mcChoiceId]
				}
				break
		}

		QuestionUtil.setResponse(
			questionModel.get('id'),
			response,
			mcChoiceId,
			this.props.moduleData.navState.context,
			this.props.moduleData.navState.context.split(':')[1],
			this.props.moduleData.navState.context.split(':')[2]
		)
	}

	getScore() {
		return QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.getQuestionModel(),
			this.props.moduleData.navState.context
		)
	}

	componentWillReceiveProps() {
		this.sortIds()
	}

	componentDidMount() {
		Dispatcher.on('question:checkAnswer', this.onCheckAnswer)
	}

	componentWillUnmount() {
		Dispatcher.off('question:checkAnswer', this.onCheckAnswer)
	}

	onCheckAnswer(payload) {
		const questionId = this.getQuestionModel().get('id')

		if (payload.value.id === questionId) {
			QuestionUtil.setScore(
				questionId,
				this.calculateScore(),
				this.props.moduleData.navState.context
			)
		}
	}

	componentWillMount() {
		this.sortIds()
	}

	sortIds() {
		if (!QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'sortedIds')) {
			let ids = this.props.model.children.models.map(model => model.get('id'))
			if (this.props.model.modelState.shuffle) ids = _.shuffle(ids)
			QuestionUtil.setData(this.props.model.get('id'), 'sortedIds', ids)
		}
	}

	updateFeedbackLabels() {
		this.correctLabelToShow = this.getRandomItem(this.correctLabels)
		this.incorrectLabelToShow = this.getRandomItem(this.incorrectLabels)
	}

	getRandomItem(arrayOfOptions) {
		return arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)]
	}

	createInstructions(responseType) {
		switch (responseType) {
			case 'pick-one':
				return <span>Pick the correct answer</span>
			case 'pick-one-multiple-correct':
				return <span>Pick one of the correct answers</span>
			case 'pick-all':
				return (
					<span>
						Pick <b>all</b> of the correct answers
					</span>
				)
		}
	}

	renderSubmitFooter(isAnswerSelected, isAnswerScored) {
		return (
			<div className="submit">
				{isAnswerScored ? (
					<Button altAction onClick={this.onClickReset} value="Try Again" />
				) : (
					<Button
						onClick={this.onClickSubmit}
						value="Check Your Answer"
						disabled={!isAnswerSelected}
					/>
				)}
			</div>
		)
	}

	renderSubmittedResultsFooter(isCorrect, isPickAll) {
		if (isCorrect) {
			return (
				<div className="result-container">
					<p className="result correct">{this.correctLabelToShow}</p>
				</div>
			)
		}

		return (
			<div className="result-container">
				<p className="result incorrect">{this.incorrectLabelToShow}</p>
				{isPickAll ? (
					<span className="pick-all-instructions">
						You have either missed some correct answers or selected some incorrect answers
					</span>
				) : null}
			</div>
		)
	}

	render() {
		let SolutionComponent = null
		const sortedIds = QuestionUtil.getData(
			this.props.moduleData.questionState,
			this.props.model,
			'sortedIds'
		)
		if (!sortedIds) return null

		const responseType = this.props.model.modelState.responseType
		const isShowingExplanation = this.isShowingExplanation()
		const score = this.getScore()
		const isAnswerScored = score !== null // Question has been submitted in practice or scored by server in assessment
		const isAnswerSelected = this.getResponseData().responses.size >= 1 // An answer choice was selected

		const feedbacks = Array.from(this.getResponseData().responses)
			.filter(mcChoiceId => OboModel.models[mcChoiceId].children.length > 1)
			.sort((id1, id2) => sortedIds.indexOf(id1) - sortedIds.indexOf(id2))
			.map(mcChoiceId => OboModel.models[mcChoiceId].children.at(1))

		const { solution } = this.props.model.parent.modelState
		if (solution !== null && typeof solution !== 'undefined') {
			SolutionComponent = solution.getComponentClass()
		}

		let explanationFooter = null
		if (isShowingExplanation) {
			explanationFooter = (
				<Button altAction onClick={this.onClickHideExplanation} value="Hide Explanation" />
			)
		} else if (solution) {
			explanationFooter = (
				<Button
					className="show-explanation-button"
					altAction
					onClick={this.onClickShowExplanation}
					value="Read an explanation of the answer"
				/>
			)
		}

		let feedbackAndSolution = null
		if (isAnswerScored && (feedbacks.length > 0 || solution)) {
			feedbackAndSolution = (
				<div className="solution" key="solution">
					<div className="score">
						{feedbacks.length === 0 ? null : (
							<div
								className={`feedback${isOrNot(responseType === 'pick-all', 'pick-all-feedback')}`}
							>
								{feedbacks.map(model => {
									const Component = model.getComponentClass()
									return (
										<Component
											key={model.get('id')}
											model={model}
											moduleData={this.props.moduleData}
											responseType={responseType}
											isShowingExplanation
											questionSubmitted
											label={String.fromCharCode(sortedIds.indexOf(model.parent.get('id')) + 65)}
										/>
									)
								})}
							</div>
						)}
					</div>
					{explanationFooter}
					<CSSTransition timeout={800} classNames="solution">
						{isShowingExplanation ? (
							<div className="solution-container" key="solution-component">
								<SolutionComponent model={solution} moduleData={this.props.moduleData} />
							</div>
						) : null}
					</CSSTransition>
				</div>
			)
		}

		const className =
			'obojobo-draft--chunks--mc-assessment' +
			` is-response-type-${this.props.model.modelState.responseType}` +
			` is-mode-${this.props.mode}` +
			isOrNot(isShowingExplanation, 'showing-explanation') +
			isOrNot(score !== null, 'scored')

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				onClick={this.props.mode !== 'review' ? this.onClick : null}
				tag="form"
				className={className}
			>
				<span className="instructions">{this.createInstructions(responseType)}</span>
				{sortedIds.map((id, index) => {
					const child = OboModel.models[id]
					if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
						return null
					}

					const Component = child.getComponentClass()
					return (
						<Component
							key={child.get('id')}
							model={child}
							moduleData={this.props.moduleData}
							responseType={responseType}
							isShowingExplanation
							mode={this.props.mode}
							questionSubmitted={isAnswerScored}
							label={String.fromCharCode(index + 65)}
						/>
					)
				})}
				{this.props.mode === 'practice' || this.props.mode === 'review' ? (
					<div className="submit-and-result-container">
						{this.props.mode === 'practice'
							? this.renderSubmitFooter(isAnswerSelected, isAnswerScored)
							: null}
						{isAnswerScored
							? this.renderSubmittedResultsFooter(score === 100, responseType === 'pick-all')
							: null}
					</div>
				) : null}
				<CSSTransition classNames="submit" timeout={800}>
					<feedbackAndSolution />
				</CSSTransition>
			</OboComponent>
		)
	}
}
