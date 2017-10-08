/**
 * setup.js
 * Description: This file runs setup for the Chain and Sinon test
 * environment and adds support for ES6+ with the Babel Polyfill.
 */
import 'babel-polyfill';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Set commonly used libraries to global namespaces
global.chai = chai;
global.sinon = sinon;
global.expect = expect;

// Tell Chai to use Sinon
chai.use(sinonChai);
