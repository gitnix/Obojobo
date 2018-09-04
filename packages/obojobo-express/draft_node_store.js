const DraftNode = global.oboRequire('models/draft_node')
const draftNodeStorage = new Map()

const add = (nodeName, nodeFile) => {
	if (draftNodeStorage.has(nodeName)) return
	draftNodeStorage.set(nodeName, require(nodeFile))
}

const get = nodeName => {
	if (draftNodeStorage.has(nodeName)) {
		return draftNodeStorage.get(nodeName)
	}

	// default to a generic draft node
	return DraftNode
}

module.exports = {
	get: get,
	add: add
}
