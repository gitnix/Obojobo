const lti = jest.fn()
lti.getLTIStatesByAssessmentIdForUserAndDraft = jest.fn()
lti.replaceResult = jest.fn()
lti.sendHighestAssessmentScore = jest.fn()
lti.getLatestHighestAssessmentScoreRecord = jest.fn()
module.exports = lti
