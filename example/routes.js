let routeConfig = [{
  path: '/',
  component: require('./components/app').default,
  indexRoute: require('./routes/home').default,
  childRoutes: [
    require('./routes/sign-in').default
  ]
}];

export default routeConfig;
