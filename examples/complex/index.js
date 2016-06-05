import React from 'react';
import { render } from 'react-dom';
import { renderRouter } from './router';
import './polyfills';

global.React = React;

render(renderRouter(), document.querySelector('#mount'));
