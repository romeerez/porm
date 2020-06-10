import {Config} from './model'

export const join = ({config: {camelCase}}: {config: Config}, ...args: string[]) =>
  camelCase ?
    `${args[0]}${args.slice(1).map(arg => `${arg[0].toUpperCase()}${arg.slice(1)}`)}` :
    args.join('_')
