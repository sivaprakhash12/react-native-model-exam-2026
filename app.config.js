module.exports = ({ config }) => {
  const isDeploy =
    process.env.npm_lifecycle_event === 'predeploy' ||
    process.env.DEPLOY_GH_PAGES === 'true';

  return {
    ...config,
    experiments: {
      ...config.experiments,
      ...(isDeploy ? { baseUrl: '/react-native-model-exam-2026' } : {}),
    },
  };
};
