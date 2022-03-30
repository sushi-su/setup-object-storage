import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as toolCache from '@actions/tool-cache';
import fs from 'fs';
import path from 'path';

async function runCOSCMD(): Promise<void> {
  const secretId = core.getInput('secret-id');
  const secretKey = core.getInput('secret-key');
  const token = core.getInput('token');
  const bucketnameAppid = core.getInput('bucketname-appid');
  const region = core.getInput('region');
  const endpoint = core.getInput('endpoint');
  const maxThread = core.getInput('max-thread');
  const partSize = core.getInput('part-size');
  const doNotUseSsl = core.getInput('do-not-use-ssl');
  const anonymous = core.getInput('anonymous');

  const args = [
    'config',
    '-a',
    secretId,
    '-s',
    secretKey,
    '-b',
    bucketnameAppid,
    '-r',
    region,
    '-m',
    maxThread,
    '-p',
    partSize,
  ];

  if (token) {
    args.push('-t', token);
  }

  if (endpoint) {
    args.push('-e', endpoint);
  }

  if (doNotUseSsl) {
    args.push('--do-not-use-ssl', doNotUseSsl);
  }

  if (anonymous) {
    args.push('--anonymous', anonymous);
  }

  const exitCode = await exec.exec('coscmd', args);

  if (exitCode === 0) {
    core.info('complete initialization');
  }
}

async function runOSSUtil(): Promise<void> {
  const ENDPOINT = core.getInput('endpoint');
  const ACCESS_KEY_ID = core.getInput('access-key-id');
  const ACCESS_KEY_SECRET = core.getInput('access-key-secret');
  const STS_TOKEN = core.getInput('sts-token');
  const VERSION = core.getInput('version');

  const url = `https://gosspublic.alicdn.com/ossutil/${VERSION}/ossutil64`;

  let toolPath = toolCache.find('ossutil', VERSION);

  if (!toolPath) {
    core.info(`downloading from ${url}`);
    toolPath = await toolCache.downloadTool(url);
    core.info(`downloaded to ${toolPath}`);
  }

  const bin = path.join(__dirname, '.bin');
  if (!fs.existsSync(bin)) {
    fs.mkdirSync(bin, {
      recursive: true,
    });
  }

  fs.copyFileSync(toolPath, path.join(bin, 'ossutil'));
  fs.chmodSync(path.join(bin, 'ossutil'), 0o755);

  core.addPath(bin);

  await exec.exec('ossutil', [
    'config',
    '-e',
    ENDPOINT,
    '-i',
    ACCESS_KEY_ID,
    '-k',
    ACCESS_KEY_SECRET,
    ...(STS_TOKEN ? ['-t', STS_TOKEN] : []),
    '-L',
    'CH',
  ]);
}

async function run(): Promise<void> {
  const type = core.getInput('util-type');

  if (type === 'coscmd') {
    await runCOSCMD();
  }

  if (type === 'ossutil') {
    await runOSSUtil();
  }
}

run().catch((error) => {
  if (error instanceof Error) core.setFailed(error.message);
});
