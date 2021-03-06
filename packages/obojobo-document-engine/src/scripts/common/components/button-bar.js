import './button-bar.scss'

import Button from './button'

const onClickButton = (index, isSelected, originalOnClick, buttonBarOnClick = () => {}) => {
	if (typeof originalOnClick === 'function') {
		originalOnClick()
	}

	buttonBarOnClick(index, isSelected)
}

export default props => (
	<div className={`obojobo-draft--components--button-bar`}>
		{props.children.map((child, i) => {
			let isSelected = i === props.selectedIndex
			let childProps = Object.assign({}, child.props)

			if (props.altAction) {
				childProps.altAction = props.altAction
			}

			if (props.isDangerous) {
				childProps.isDangerous = props.isDangerous
			}

			if (props.disabled) {
				childProps.disabled = props.disabled
			}

			childProps.onClick = onClickButton.bind(
				null,
				i,
				isSelected,
				childProps.onClick || (() => {}),
				props.onClick
			)

			return (
				<div key={i} className={isSelected ? 'is-selected' : ''}>
					<Button {...childProps}>{child.props.children}</Button>
				</div>
			)
		})}
	</div>
)
