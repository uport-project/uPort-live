import React from 'react'

import ModalWrapper from './ModalWrapper'
import MenuWrapper from './MenuWrapper'

const AppWrapper = ({children}) => (
	<MenuWrapper>
		<ModalWrapper>
			{children}
		</ModalWrapper>
	</MenuWrapper>
)

export default AppWrapper