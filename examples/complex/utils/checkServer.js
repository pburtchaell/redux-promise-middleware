import Network from './network';

export default function checkServer() {
  return Network().ping();
}
