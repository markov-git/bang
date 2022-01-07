import * as React from 'react';
import css from './BangGame.module.sass';

import { Card } from '../Card/Card';

export const BangGame: React.FC = () => {
	return (
		<div className={css.bangGame}>
			<Card/>
		</div>
	);
};