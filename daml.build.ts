import {Parcel} from '@parcel/core';

const bundler = new Parcel({
  entries: 'index.html',
  defaultConfig: '@parcel/config-default',
});

const {bundleGraph, buildTime} = await bundler.run();
const bundles = bundleGraph.getBundles();

console.log(
  `✨ Built ${bundles.length} bundles in ${buildTime}ms!`,
);
