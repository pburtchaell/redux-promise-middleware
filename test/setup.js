import 'babel-polyfill';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

global.chai = chai;
global.sinon = sinon;
global.expect = expect;

chai.use(sinonChai);
