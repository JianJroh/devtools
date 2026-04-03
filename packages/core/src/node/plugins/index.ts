import type { Plugin } from 'vite'
import { DevToolsBuild } from './build'
import { DevToolsInjection } from './injection'
import { DevToolsServer } from './server'

export interface DevToolsOptions {
  /**
   * Include the Vite builtin devtools UI.
   *
   * @default true
   */
  builtinDevTools?: boolean

  /**
   * Specify the WebSocket server port. Note if the port is already being
   * used, it will automatically try the next available port so this may not
   * be the actual port the server ends up listening on.
   *
   * @default 7812
   */
  websocketServerPort?: number

  /**
   * Options for building static DevTools output alongside `vite build`.
   */
  build?: {
    /**
     * Automatically build DevTools when running `vite build`.
     *
     * @default false
     */
    withApp?: boolean
    /**
     * Output directory for the DevTools build (relative to root).
     * Defaults to Vite's `build.outDir`.
     */
    outDir?: string
  }
}

export async function DevTools(options: DevToolsOptions = {}): Promise<Plugin[]> {
  const {
    builtinDevTools = true,
    websocketServerPort,
    build,
  } = options

  const plugins = [
    DevToolsInjection(),
    DevToolsServer({ port: websocketServerPort }),
  ]

  if (build?.withApp) {
    plugins.push(DevToolsBuild({ outDir: build.outDir }))
  }

  if (builtinDevTools) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore ignore the type error
    plugins.push(await import('@vitejs/devtools-rolldown').then(m => m.DevToolsRolldownUI()))
  }

  return plugins
}

export {
  DevToolsBuild,
  DevToolsInjection,
  DevToolsServer,
}
