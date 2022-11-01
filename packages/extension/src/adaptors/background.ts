import {MessageEndpoint} from '@remote-ui/rpc'
import type {Runtime} from 'webextension-polyfill'
import { fromPort } from './port';

interface Options {
  to: 'content-script' | 'dev-tools',
  port: Runtime.Port
}

export function fromBackground({port}: Options): MessageEndpoint {
  return fromPort(port)
}