import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { notarize } from 'electron-notarize'
import * as path from 'path'
import * as fs from 'fs'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'MiniPoker',
    appBundleId: 'com.minipoker.app',
    appCategoryType: 'public.app-category.games',
    icon: path.join(__dirname, 'assets', 'icon'),
    protocols: [
      {
        name: 'MiniPoker',
        schemes: ['minipoker']
      }
    ],
    osxSign: {
      identity: process.env.APPLE_DEVELOPER_ID || undefined,
      entitlements: path.join(__dirname, 'entitlements.mac.plist'),
      entitlementsInherit: path.join(__dirname, 'entitlements.mac.plist'),
      hardenedRuntime: true,
      gatekeeperAssess: false
    },
    osxNotarize: async (buildPath: string, electronVersion: string, platform: string, arch: string, callback: (error?: Error) => void) => {
      try {
        if (process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD && process.env.APPLE_TEAM_ID) {
          const appPath = path.join(buildPath, 'MiniPoker.app')
          if (fs.existsSync(appPath)) {
            await notarize({
              appBundleId: 'com.minipoker.app',
              appPath,
              appleId: process.env.APPLE_ID,
              appleIdPassword: process.env.APPLE_ID_PASSWORD,
              teamId: process.env.APPLE_TEAM_ID
            })
          }
        }
        callback()
      } catch (error) {
        callback(error as Error)
      }
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'MiniPoker',
      authors: 'MiniPoker Team',
      description: 'Mini Poker - 扑克游戏合集',
      setupIcon: path.join(__dirname, 'assets', 'icon.ico'),
      loadingGif: path.join(__dirname, 'assets', 'install.gif'),
      noMsi: true
    }, ['win32']),
    new MakerZIP({}, ['darwin', 'win32', 'linux']),
    new MakerDMG({
      name: 'MiniPoker',
      icon: path.join(__dirname, 'assets', 'icon.icns'),
      background: path.join(__dirname, 'assets', 'dmg-background.png'),
      contents: [
        { x: 130, y: 220, type: 'file', path: '' },
        { x: 410, y: 220, type: 'link', path: '/Applications' }
      ],
      window: {
        width: 540,
        height: 380
      }
    }, ['darwin']),
    new MakerDeb({
      name: 'minipoker',
      productName: 'MiniPoker',
      genericName: 'Poker Games',
      description: 'Mini Poker - 扑克游戏合集',
      icon: path.join(__dirname, 'assets', 'icon.png'),
      categories: ['Game'],
      mimeType: ['x-scheme-handler/minipoker']
    }, ['linux']),
    new MakerRpm({
      name: 'minipoker',
      productName: 'MiniPoker',
      genericName: 'Poker Games',
      description: 'Mini Poker - 扑克游戏合集',
      icon: path.join(__dirname, 'assets', 'icon.png'),
      categories: ['Game'],
      mimeType: ['x-scheme-handler/minipoker']
    }, ['linux'])
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'minipoker',
          name: 'minipoker'
        },
        draft: true,
        prerelease: false
      }
    }
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true
    })
  ],
  buildIdentifier: 'minipoker'
}

export default config
