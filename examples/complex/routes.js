let routeConfig = [{
  path: '/',
  component: require('./components/app').default,
  indexRoute: require('./routes/home').default,
  childRoutes: [
    
  ]
}];

export default routeConfig;
