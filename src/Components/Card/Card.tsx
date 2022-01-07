import * as React from 'react';
import css from './Card.module.sass';
import classNames from 'classnames';

export const Card: React.FC = () => {
	return (
		<div className={classNames({
			[css.card]: true,
			[css._base]: true,
		})}>

		</div>
	);
};