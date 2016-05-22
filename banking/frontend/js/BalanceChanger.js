import React from 'react';
import ReactDOM from 'react-dom';

import BalanceChanger from './components/BalanceChanger'
import {clear} from './utils/array';

const id = clear(window.location.pathname.split('/')).pop();

ReactDOM.render(
    <BalanceChanger userId={id}/>,
    document.getElementById('balance-changer')
);
