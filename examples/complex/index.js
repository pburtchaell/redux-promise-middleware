import 'babel-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import { render } from 'react-dom';
import { renderRouter } from './router';

global.React = React;

render(renderRouter(), document.querySelector('#mount'));
